import { noop } from './utils'

const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

function buildGrammar(phraseList = '') {
  if (!Array.isArray(phraseList)) {
    phraseList = [phraseList]
  }
  return `#JSGF V1.0; grammar phrase; public <phrase> = ${phraseList.join(
    ' | '
  )};`
}

function buildRecognition(phraseList) {
  const speechRecognitionList = new SpeechGrammarList()
  speechRecognitionList.addFromString(buildGrammar(phraseList), 1)

  const recognition = new SpeechRecognition()
  recognition.grammars = speechRecognitionList
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.continuous = false
  recognition.maxAlternatives = 1

  return recognition
}

export function listen(
  phraseList,
  { onend, onerror, onnomatch = noop, onresult = noop, onstart } = {}
) {
  const recognition = buildRecognition(phraseList)

  // Lifecycle events
  recognition.onend = onend
  recognition.onstart = onstart
  recognition.onerror = onerror

  // Recognition events
  recognition.onnomatch = onnomatch
  recognition.onresult = event => {
    let result
    try {
      result = event.results[0][0].transcript.toLowerCase()
      onresult(result)
    } catch (err) {
      console.error('Failed on result', err)
      onnomatch()
    }
  }

  recognition.start()

  return recognition
}
