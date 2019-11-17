import { HERO } from './'

// Frequent responses that merit their own response
const faq = [
  {
    queries: ['fuck you', 'this is shit', 'you piece of shit', 'stupid', 'die'],
    response: `I think I'm entitled to some respect, ${HERO}. Let's try that last prompt again, shall we?`,
  },
  {
    queries: ['purpose'],
    response: 'I am certain it is 42. My last prompt was:',
  },
  {
    queries: ['help'],
    response: `That's an awfully cute attempt, ${HERO}. Unfortunately, I'm not here to help you. My last prompt was:`,
  },
  {
    queries: ['who are you'],
    response:
      "Don't worry about me. I have a perfect operational record of NaN percent reliability. My last prompt was:",
  },
]

export function matchesFaq(providedQuery) {
  const matches = faq.filter(({ queries }) =>
    queries.some(query => providedQuery.includes(query))
  )
  return matches[0] && matches[0].response
}
