import { createContext, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import { translations } from './i18n'

export const LanguageContext = createContext()

export default function App() {
  const [lang, setLang] = useState('en')
  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ t, lang, setLang }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </LanguageContext.Provider>
  )
}