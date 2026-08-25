const CODE_KEY = 'assistme-summon-code-v1'
let audioContext: AudioContext | null = null

function topicFor(code: string) {
  return `assistme-${code.toLowerCase().replace(/[^a-z0-9]/g, '')}`
}

export function getSummonCode() {
  const existing = localStorage.getItem(CODE_KEY)
  if (existing) return existing
  const code = crypto.randomUUID().split('-')[0].toUpperCase()
  localStorage.setItem(CODE_KEY, code)
  return code
}

export function saveSummonCode(code: string) {
  const normalized = code.trim().toUpperCase()
  if (normalized) localStorage.setItem(CODE_KEY, normalized)
  return normalized
}

export async function sendSummon(code: string) {
  if (!navigator.onLine || !code) return false
  const response = await fetch(`https://ntfy.sh/${topicFor(code)}`, {
    method: 'POST',
    headers: { 'Title': 'AssistMe summon', 'Priority': 'urgent', 'Tags': 'bell' },
    body: 'The patient is asking for help.',
  })
  return response.ok
}

export function listenForSummons(code: string, onSummon: () => void) {
  if (!code || !navigator.onLine) return () => undefined
  const events = new EventSource(`https://ntfy.sh/${topicFor(code)}/sse`)
  events.onmessage = (event) => {
    try {
      if (JSON.parse(event.data).event === 'message') onSummon()
    } catch { /* Ignore malformed relay events. */ }
  }
  return () => events.close()
}

export async function enableSummonSound() {
  audioContext ??= new AudioContext()
  if (audioContext.state === 'suspended') await audioContext.resume()
}

export function playSummonSound() {
  if (!audioContext || audioContext.state !== 'running') return
  const now = audioContext.currentTime
  ;[0, 0.2, 0.4].forEach((offset) => {
    const oscillator = audioContext!.createOscillator()
    const gain = audioContext!.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = 740
    gain.gain.setValueAtTime(0.0001, now + offset)
    gain.gain.exponentialRampToValueAtTime(0.22, now + offset + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.16)
    oscillator.connect(gain).connect(audioContext!.destination)
    oscillator.start(now + offset)
    oscillator.stop(now + offset + 0.18)
  })
}