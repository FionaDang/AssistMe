export type SpeechLanguage = 'en-US' | 'zh-CN'

export function speak(text: string, language: SpeechLanguage): boolean {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = language
  const languagePrefix = language.split('-')[0]
  const voice = window.speechSynthesis.getVoices().find((candidate) => candidate.lang.toLowerCase().startsWith(language.toLowerCase()))
    ?? window.speechSynthesis.getVoices().find((candidate) => candidate.lang.toLowerCase().startsWith(languagePrefix))
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
  return true
}