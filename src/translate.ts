const phrasePairs = [
  ['water', '水'],
  ['i would like a meal', '我想吃饭'],
  ['a snack, please', '请给我一点零食'],
  ['bathroom', '洗手间'],
  ['call the doctor', '请叫医生'],
  ['i am in pain', '我很痛'],
  ['i need help', '我需要帮助'],
  ['i would like music', '我想听音乐'],
  ['i would like to watch tv', '我想看电视'],
  ['call my family', '请给我的家人打电话'],
] as const

export function translateOffline(text: string, from: 'english' | 'chinese'): string | null {
  const normalized = text.trim().toLowerCase()
  const match = phrasePairs.find(([english, chinese]) => (from === 'english' ? english : chinese) === normalized)
  if (!match) return null
  return from === 'english' ? match[1] : match[0]
}

export async function translateOnline(text: string, from: 'english' | 'chinese'): Promise<string | null> {
  if (!navigator.onLine) return null
  const source = from === 'english' ? 'en' : 'zh'
  const target = from === 'english' ? 'zh-CN' : 'en'
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) return null
    const data = await response.json() as { responseData?: { translatedText?: string } }
    const translation = data.responseData?.translatedText?.trim()
    return translation || null
  } catch {
    return null
  }
}

export async function translateBest(text: string, from: 'english' | 'chinese'): Promise<string | null> {
  return await translateOnline(text, from) ?? translateOffline(text, from)
}