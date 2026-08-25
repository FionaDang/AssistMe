export type SpeechLanguage = 'en-US' | 'zh-CN'

export function speak(text: string, language: SpeechLanguage): boolean {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = language
  window.speechSynthesis.speak(utterance)
  return true
}