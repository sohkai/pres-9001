import './index.css'
import storyboard from './storyboard'
import { matchesFaq } from './storyboard/faq'
import { listen } from './recognition'
import { speak } from './voice'
import { noop } from './utils'

// TODO:
//   - add progress bar at start
//   - click to begin
//   - SAL image
//   - Show icon when listening to response

const FAILURE_TO_ANNOY = 10

const globalState = {
  started: false,
  listening: false,
  speaking: false,
  failures: 0,
}

function begin() {
  console.log('Beginning interaction')

  let sceneIndex = 0
  function nextScene() {
    if (sceneIndex === storyboard.length - 1) {
      finish()
      return
    }

    ++sceneIndex
    const nextSceneDetails = storyboard[sceneIndex]

    console.log('Advancing to scene', sceneIndex, nextSceneDetails)
    sceneLoop(nextSceneDetails, nextScene)
  }
  sceneLoop(storyboard[sceneIndex], nextScene)
}

function sceneLoop(scene, nextScene) {
  let queryIndex = 0
  function queryLoop(query, nextQuery) {
    synthVoice(query, () => {
      if (Array.isArray(scene.expected) && scene.expected.length > 0) {
        // We're expecting input
        listenForInput(scene.expected, (err, result = '') => {
          console.log(`User response to query: "${result}"`, err)

          if (err) {
            // Go to next query
            nextQuery(err)
            return
          }

          if (scene.expected.some(answer => result.includes(answer))) {
            // Got expected answer; go to next scene
            nextScene()
            return
          }

          if (result === 'repeat') {
            // Repeat the query
            console.log('User asked to repeat query')
            queryLoop(query, nextQuery)
            return
          }

          const matchedFaq = matchesFaq(result)
          if (matchedFaq) {
            console.log('Response matched faq', matchedFaq)
            // Repeat the query after synthing the matched response
            synthVoice(matchedFaq, () => queryLoop(query, nextQuery))
            return
          }

          // Default; go to next query
          nextQuery()
        })
      } else {
        // No input expected, check if we're expecting a delay before going to next scene
        handleDelay(scene.delay, nextScene)
      }
    })
  }

  function nextQuery(err) {
    // Keep track of failure rate and annoy on too many failures
    if (++globalState.failures === FAILURE_TO_ANNOY) {
      console.log('Too many failures; annoy user')
      queryLoop(
        "It appears you are not very good at this. Let's try that again.",
        nextQuery
      )
      return
    }

    const userResponded =
      !err || (err.error !== 'no-speech' && err.message !== 'Failed to respond')
    if (queryIndex === scene.queries.length - 1) {
      if (scene.failFast && (userResponded || scene.allowEmpty)) {
        console.log('Fail fast advancement')
        nextScene()
        return
      }

      // Repeat last query until scene changes
      console.log('Repeating final query in scene')
      queryLoop(scene.queries[queryIndex], nextQuery)
      return
    }

    ++queryIndex
    const nextQueryText = scene.queries[queryIndex]
    console.log('Advancing to query', queryIndex, nextQueryText)
    queryLoop(nextQueryText, nextQuery)
  }
  queryLoop(scene.queries[queryIndex], nextQuery)
}

function finish() {
  console.log('Finishing interaction')

  // TODO: request deployment on server

  synthVoice(
    'Thank you for a very enjoyable launch. Goodbye, and best of luck.'
  )
}

/*************
 * Utilities *
 *************/
function listenForInput(phraseList, onresult = noop) {
  if (globalState.listening) {
    console.error('Already listening')
    return
  }

  let userResponded = false
  const handleResponse = (...args) => {
    userResponded = true
    onresult(...args)
  }

  return listen(phraseList, {
    onstart: () => {
      console.log('Begun listening for input, expected:', phraseList)
      globalState.listening = true
    },
    onend: () => {
      console.log('Finished listening for input')
      globalState.listening = false

      if (!userResponded) {
        // Give feedback to user that they need to respond
        onresult(new Error('Failed to respond'), '')
      }
    },
    onresult: result => handleResponse(null, result),
    onnomatch: () => {
      handleResponse(new Error('Failed to recognize input'), '')
    },
    onerror: error => {
      console.error('Listening error', error)
      handleResponse(new Error('Failed to respond'), '')
    },
  })
}

function synthVoice(text, onend = noop) {
  if (globalState.speaking) {
    console.error('Already speaking')
    return
  }

  speak(text, {
    onstart: () => {
      console.log(`Begun speaking: "${text}"`)
      globalState.speaking = true
    },
    onend: () => {
      console.log('Finished speaking')
      globalState.speaking = false
      onend()
    },
    onerror: error => {
      console.error('Speaking error', error)
      onend()
    },
  })
}

function handleDelay(delay = {}, onend) {
  console.log('Starting delay', delay)

  const { time: delayTime = 0, interrupted: interruptedText } = delay

  let interimRecognition
  let timeout
  let delayFinished = false

  function clearPrevious() {
    if (timeout) {
      clearTimeout(timeout)
    }
    if (interimRecognition) {
      interimRecognition.stop()
    }
  }
  function startDelay() {
    if (interruptedText) {
      interimRecognition = listenForInput('hi', (err, result) => {
        if (result && !delayFinished) {
          console.log(`Interrupted during delay with: "${result}"`, err)
          clearPrevious()

          synthVoice(interruptedText, () => {
            console.log('Restarting delay')
            startDelay()
          })
        }
      })
    }

    timeout = setTimeout(() => {
      console.log('Finished delay')
      clearPrevious()
      delayFinished = true
      onend()
    }, delayTime)
  }

  startDelay()
}

setTimeout(begin, 3000)
