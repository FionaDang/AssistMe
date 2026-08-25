import { useEffect, useState } from 'react'
import { copy, defaultCategories } from './data'
import { speak } from './speech'
import { translateBest } from './translate'
import { enableSummonSound, getSummonCode, listenForSummons, playSummonSound, saveSummonCode, sendSummon } from './summon'
import type { Category, Need } from './types'

const STORAGE_KEY = 'assistme-categories-v1'

function loadCategories(): Category[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as Category[] : defaultCategories
  } catch {
    return defaultCategories
  }
}

function App() {
  const [categories, setCategories] = useState(loadCategories)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [selected, setSelected] = useState<Need | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [speechMessage, setSpeechMessage] = useState('')
  const [addCategoryId, setAddCategoryId] = useState<string | null>(null)
  const [newEnglish, setNewEnglish] = useState('')
  const [newChinese, setNewChinese] = useState('')
  const [translationMessage, setTranslationMessage] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  const [summonCode, setSummonCode] = useState(getSummonCode)
  const [caregiverMode, setCaregiverMode] = useState(false)
  const [summonMessage, setSummonMessage] = useState('')
  const [hasSummon, setHasSummon] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(categories)), [categories])
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])
  useEffect(() => listenForSummons(caregiverMode ? summonCode : '', () => {
    setHasSummon(true)
    setSummonMessage('New summon received')
    playSummonSound()
    if ('Notification' in window && Notification.permission === 'granted') new Notification('AssistMe summon', { body: 'The patient is asking for help.' })
  }), [caregiverMode, summonCode])

  function chooseNeed(need: Need) {
    setSelected(need)
    setSpeechMessage('')
  }

  function read(need: Need, language: 'en-US' | 'zh-CN', label: string) {
    setSpeechMessage(speak(language === 'en-US' ? need.english : need.chinese, language) ? label : 'Speech is not available on this device')
  }

  function resetCategories() {
    if (window.confirm('Reset all requests to the original defaults?')) setCategories(defaultCategories)
  }

  async function summonCaregiver() {
    setSummonMessage('Sending summon...')
    try {
      setSummonMessage(await sendSummon(summonCode) ? 'Caregiver alerted' : 'Summon needs an internet connection')
    } catch {
      setSummonMessage('Could not reach the caregiver')
    }
  }

  function updateSummonCode(value: string) {
    setSummonCode(saveSummonCode(value))
  }

  async function enableCaregiverAlerts(enabled: boolean) {
    setCaregiverMode(enabled)
    if (enabled) {
      await enableSummonSound()
      setSoundEnabled(true)
      if ('Notification' in window) Notification.requestPermission()
    }
  }

  async function addRequest(categoryId: string) {
    let english = newEnglish.trim()
    let chinese = newChinese.trim()
    setIsTranslating(true)
    if (!english && chinese) english = await translateBest(chinese, 'chinese') ?? ''
    if (!chinese && english) chinese = await translateBest(english, 'english') ?? ''
    setIsTranslating(false)
    if (!english || !chinese) {
      setTranslationMessage('This phrase is not in the offline translator. Please enter both languages.')
      return
    }
    setCategories(categories.map((category) => category.id === categoryId
      ? { ...category, needs: [...category.needs, { id: `custom-${Date.now()}`, english, chinese }] }
      : category))
    setNewEnglish('')
    setNewChinese('')
    setTranslationMessage('')
    setAddCategoryId(null)
  }

  async function fillChineseFromEnglish() {
    if (!newEnglish.trim() || newChinese.trim()) return
    setIsTranslating(true)
    const translated = await translateBest(newEnglish, 'english')
    setIsTranslating(false)
    if (translated) setNewChinese(translated)
  }

  async function fillEnglishFromChinese() {
    if (!newChinese.trim() || newEnglish.trim()) return
    setIsTranslating(true)
    const translated = await translateBest(newChinese, 'chinese')
    setIsTranslating(false)
    if (translated) setNewEnglish(translated)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">A</div>
        <div><p className="eyebrow">ASSISTME</p><p className="subtitle">{copy.subtitle}</p></div>
        <button className="settings-button" onClick={() => setSettingsOpen(true)} aria-label={copy.settings} title={copy.settings}>Settings</button>
      </header>

      {!activeCategory && !selected && <section className="intro"><p className="eyebrow">HELLO / 你好</p><h1>{copy.choose}</h1><p>Tap a group to find what you need.</p></section>}

      {!activeCategory && !selected && <section className="summon-area"><button className="summon-button" onClick={summonCaregiver} disabled={!isOnline}><span aria-hidden="true">!</span><strong>Summon caregiver</strong><small>呼叫护理人员</small></button>{summonMessage && <p className="status" role="status">{summonMessage}</p>}</section>}

      {caregiverMode && hasSummon && <section className="alert-banner" role="alert"><strong>Caregiver alert</strong><span>The patient is asking for help.</span><button onClick={() => setHasSummon(false)}>Acknowledge</button></section>}

      {selected && <section className="confirmation" aria-live="polite">
        <div className="checkmark" aria-hidden="true">✓</div>
        <p className="eyebrow">{copy.selected}</p>
        <h1>{selected.english}</h1><h2>{selected.chinese}</h2>
        <div className="speech-actions">
          <button onClick={() => read(selected, 'en-US', 'English audio playing')}>{copy.sayEnglish}<span>EN</span></button>
          <button onClick={() => read(selected, 'zh-CN', 'Chinese audio playing')}>{copy.sayChinese}<span>中</span></button>
        </div>
        {speechMessage && <p className="status" role="status">{speechMessage}</p>}
        <button className="back-button" onClick={() => { setSelected(null); setSpeechMessage('') }}>{copy.back}</button>
      </section>}

      {!selected && activeCategory && <section className="category-view"><button className="back-link" onClick={() => setActiveCategory(null)}>← {copy.back}</button><div className={`category-heading ${activeCategory.color}`}><p className="eyebrow">{activeCategory.english}</p><h1>{activeCategory.chinese}</h1></div><div className="need-grid">{activeCategory.needs.map((need) => <button className="need-card" key={need.id} onClick={() => chooseNeed(need)}><strong>{need.english}</strong><span>{need.chinese}</span></button>)}</div></section>}

      {!selected && !activeCategory && <section className="category-grid" aria-label="Categories">{categories.map((category) => <button className={`category-card ${category.color}`} key={category.id} onClick={() => setActiveCategory(category)}><span className="category-number">0{categories.indexOf(category) + 1}</span><strong>{category.english}</strong><span>{category.chinese}</span><small>{category.needs.length} requests</small></button>)}</section>}

      {settingsOpen && <aside className="settings-panel" aria-label={copy.settings}><div className="settings-header"><div><p className="eyebrow">CAREGIVER MODE</p><h2>{copy.settings}</h2></div><button onClick={() => setSettingsOpen(false)} aria-label={copy.close}>×</button></div><p className="edit-hint">{copy.editHint}</p><section className="summon-settings"><h3>Device connection</h3><p className="form-hint">Use the same code on the patient and caregiver devices. Online connection required for alerts.</p><label className="edit-row">Connection code<input value={summonCode} onChange={(event) => updateSummonCode(event.target.value)} aria-label="Summon connection code" /></label><label className="toggle-row"><input type="checkbox" checked={caregiverMode} onChange={(event) => enableCaregiverAlerts(event.target.checked)} /> Receive caregiver alerts on this device</label>{caregiverMode && <><button className="sound-test" onClick={() => { enableSummonSound(); playSummonSound() }}>{soundEnabled ? 'Test alert sound' : 'Enable alert sound'}</button><p className="form-hint">Keep this page or installed app open to receive alerts.</p></>}</section>{categories.map((category) => <div className="settings-category" key={category.id}><label className="edit-row"><span>{category.english} / {category.chinese}</span><input value={category.english} onChange={(event) => setCategories(categories.map((item) => item.id === category.id ? { ...item, english: event.target.value } : item))} aria-label={`Edit ${category.english}`} /></label>{addCategoryId === category.id ? <div className="add-form"><input value={newEnglish} onChange={(event) => setNewEnglish(event.target.value)} onBlur={fillChineseFromEnglish} placeholder="English request (optional)" aria-label="New request in English" /><input value={newChinese} onChange={(event) => setNewChinese(event.target.value)} onBlur={fillEnglishFromChinese} placeholder="Chinese request (optional)" aria-label="New request in Chinese" /><p className="form-hint">{isOnline ? 'Online translation is enabled for better results. Text may be sent to a translation service.' : 'Offline mode: common phrases translate automatically.'}</p>{isTranslating && <p className="form-hint" role="status">Translating...</p>}{translationMessage && <p className="form-error" role="alert">{translationMessage}</p>}<div><button onClick={() => addRequest(category.id)} disabled={isTranslating}>Save request</button><button onClick={() => { setAddCategoryId(null); setTranslationMessage('') }}>Cancel</button></div></div> : <button className="add-request-link" onClick={() => setAddCategoryId(category.id)}>+ {copy.add}</button>}</div>)}<button className="reset-button" onClick={resetCategories}>{copy.reset}</button></aside>}
    </main>
  )
}

export default App