import { createContext, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import PublicTransactions from './pages/PublicTransactions'
import { translations } from './i18n'

export const LanguageContext = createContext()

function ProtectedRoute({ children }) {
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('userName')
  return isLoggedIn ? children : <Navigate to="/" replace />
}

export default function App() {
  const [lang, setLang] = useState('en')
  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ t, lang, setLang }}>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/landing"
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <PublicTransactions />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LanguageContext.Provider>
  )
}