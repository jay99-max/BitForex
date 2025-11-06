import { useContext } from 'react'
import { LanguageContext } from '../App.jsx'

export default function LanguageSwitcher() {
  const { lang, setLang } = useContext(LanguageContext)

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      className="rounded-lg bg-teal-900/50 px-3 py-1.5 text-xs font-medium text-teal-300 hover:bg-teal-800/50 transition-colors"
    >
      {lang === 'en' ? 'ES' : 'EN'}
    </button>
  )
}