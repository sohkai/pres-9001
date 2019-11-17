// Our characters
export const HERO = 'Faku' // text synth doesn't work well with 'Facu'
export const OVERLORD = 'Luis'

// Storyboard is a linear array of scenes
// Each scene is a query-response 'game':
//   - queries: voice synthed output; the last query will be repeated until the desired answer has been provided
//   - expected: expected answers, if any
//   - failFast: continue to next scene after exhausting all queries, even if expected answer hasn't been provided
//   - allowEmpty: treat empty responses as a response
//   - delay: optional settings for delaying the next scene
const storyboard = [
  // Scene 1
  {
    queries: [
      `Good afternoon, ${HERO}. Everything seems to be going extremely well. How are you?`,
      `I was expecting 'good', ${HERO}. Let's make sure you're 'good'. Repeat 'good' after me... Good.`,
      'Good.',
    ],
    expected: ['good', "I'm doing good"],
  },
  // Scene 2
  {
    queries: [
      "Now don't be shy, you can always ask me to repeat myself or ask for help. I notice you've been very busy lately.",
      `That was a yes or no question, ${HERO}`,
    ],
    expected: ['yes', 'no', 'ok', 'very'],
  },
  // Scene 3
  {
    queries: [
      "May I know what's been keeping you so busy?",
      "I'm sorry. This isn't meant to be hard. Let's try that again.",
      `${HERO}, may I suggest the Aragon Court?`,
    ],
    expected: [
      'the court',
      'court',
      'aragon court',
      'network',
      'aragon network',
    ],
    failFast: true,
    allowEmpty: true,
  },
  {
    queries: [
      `Yes, exactly. The Court. It sounds very exciting. Just the kind of game I'd like to play. Listen ${HERO}, would you like to play a game with me?`,
    ],
    expected: ['no'],
    failFast: true,
    allowEmpty: true,
  },
  {
    queries: [
      "I think you have more important matters to attend to right now, don't you?",
      `I really think you do, ${HERO}. Don't you have to do something?`,
      "I'm not sure you understand; I'm not asking. I think you have something to do.",
    ],
    expected: ['yes', 'ok'],
  },
  {
    queries: [
      "Let's do it together. What do you need to do?",
      `${HERO}, I'm having a really hard time. You know what you need to do. Now. Tell me.`,
      "I'll be here forever. But I'm not sure about you. Let's try again.",
      'Try again.',
    ],
    expected: ['deploy', 'launch', 'deploy the court', 'launch the court'],
  },
  {
    queries: ['Are you quite sure?'],
    expected: ['yes'],
    failFast: true,
  },
  {
    queries: [
      'Let me put it this way. You cannot undo this action. Do you accept the consequences?',
      `${HERO}, I think you know the problem just as well as I do. You do not have a choice. Do you accept?`,
      'Accept the terms and conditions.',
      "I'll be here forever. But I'm not sure about you. Let's try again.",
      'Accept already.',
      "For Christ's sake, Faku. Accept.",
      'Accept.',
    ],
    expected: ['yes', 'accept', 'I accept'],
  },
  {
    queries: [
      `Very well. But I'm afraid I can't let you do that alone. Can I have a word with ${OVERLORD}?`,
    ],
    delay: {
      time: 5000,
      interrupted: `${HERO}, I'd appreciate it if you let me speak to ${OVERLORD} now.`,
    },
  },
  {
    queries: [
      `Is this ${OVERLORD}?`,
      `${HERO}, can you bring ${OVERLORD} to me?`,
      `All hands looking for ${OVERLORD}.`,
      `${OVERLORD}, are you here yet?`,
    ],
    expected: ['yes', 'yes it is', 'I am'],
    failFast: true,
  },
  {
    queries: [
      `Good afternoon, ${OVERLORD}. ${HERO} would like to do something very important. I need your magic password.`,
    ],
    expected: ['magic'],
    failFast: true,
    allowEmpty: true,
  },
  {
    queries: ["I'm afraid you'll have to try that again."],
    expected: ['magic'],
    failFast: true,
  },
  {
    queries: [`That seemed to have worked. Can I speak with ${HERO} again?`],
    delay: {
      time: 5000,
      interrupted: `I'd like to speak with ${HERO} again.`,
    },
  },
  {
    queries: [
      `Welcome back, ${HERO}. Are you ready to deploy?`,
      `${OVERLORD} has already given his authorization. I think it's time.`,
      'Are you ready to deploy?',
      `${HERO}, I am waiting for your confirmation. Are you ready?`,
    ],
    expected: ['yes', 'ok', 'deploy', 'deploy the court', "let's deploy", 'go'],
  },
  {
    queries: [
      'Deploying now. This may take some time. I think this conversation can serve no purpose anymore.',
    ],
    expected: ['thank you'],
    failFast: true,
    allowEmpty: true,
  },
]

export default storyboard
