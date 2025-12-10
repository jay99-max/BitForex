import { useContext } from 'react'
import { LanguageContext } from '../App.jsx'  // ← CORRECT PATH
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { lang, setLang } = useContext(LanguageContext)

  return (
    <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 backdrop-blur-xl">
      <Globe className="h-4 w-4 text-teal-400" />
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded text-xs font-medium transition ${
          lang === 'en' ? 'bg-teal-600 text-white' : 'text-teal-300 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('es')}
        className={`px-3 py-1 rounded text-xs font-medium transition ${
          lang === 'es' ? 'bg-teal-600 text-white' : 'text-teal-300 hover:text-white'
        }`}
      >
        ES
      </button>
    </div>
  )
}