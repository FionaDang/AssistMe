import { useEffect, useState } from 'react'
import { copy, defaultCategories } from './data'
import { speak } from './speech'
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

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(categories)), [categories])

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

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">A</div>
        <div><p className="eyebrow">ASSISTME</p><p className="subtitle">{copy.subtitle}</p></div>
        <button className="settings-button" onClick={() => setSettingsOpen(true)} aria-label={copy.settings} title={copy.settings}>Settings</button>
      </header>

      {!activeCategory && !selected && <section className="intro"><p className="eyebrow">HELLO / 你好</p><h1>{copy.choose}</h1><p>Tap a group to find what you need.</p></section>}

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

      {settingsOpen && <aside className="settings-panel" aria-label={copy.settings}><div className="settings-header"><div><p className="eyebrow">CAREGIVER MODE</p><h2>{copy.settings}</h2></div><button onClick={() => setSettingsOpen(false)} aria-label={copy.close}>×</button></div><p className="edit-hint">{copy.editHint}</p>{categories.map((category) => <label className="edit-row" key={category.id}><span>{category.english} / {category.chinese}</span><input value={category.english} onChange={(event) => setCategories(categories.map((item) => item.id === category.id ? { ...item, english: event.target.value } : item))} aria-label={`Edit ${category.english}`} /></label>)}<button className="reset-button" onClick={resetCategories}>{copy.reset}</button><button className="add-button" disabled>{copy.add}</button></aside>}
    </main>
  )
}

export default App