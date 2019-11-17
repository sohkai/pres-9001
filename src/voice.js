const desiredVoiceURI = 'Google UK English Female'
const fallbackVoiceLanguage = 'en-US'

const desiredVoiceRate = 0.9
const desiredVoicePitch = 0.9

// We can't get the immediately, because we have to wait for the onvoiceschanged event
let selectedVoice
;(() => {
  function getSelectedVoice() {
    const availableVoices = window.speechSynthesis.getVoices()
    const desiredVoice = availableVoices.find(
      ({ voiceURI }) => voiceURI === desiredVoiceURI
    )

    if (desiredVoice) {
      selectedVoice = desiredVoice
    } else {
      // If we can't find our desired voice, settle for the first voice matching the language
      selectedVoice = availableVoices.find(
        ({ lang }) => lang === fallbackVoiceLanguage
      )
    }
    console.log('Selected voice')
  }

  getSelectedVoice()
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = getSelectedVoice
  }
})()

export function speak(text, { onend, onerror, onstart } = {}) {
  if (!selectedVoice && onerror) {
    onerror(new Error('No voice available yet'))
  }

  const utter = new SpeechSynthesisUtterance(text)
  utter.onstart = onstart
  utter.onend = onend
  utter.onerror = onerror

  utter.voice = selectedVoice
  utter.rate = desiredVoiceRate
  utter.pitch = desiredVoicePitch
  window.speechSynthesis.speak(utter)
}
