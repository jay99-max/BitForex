import { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LanguageContext } from '../App.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher'

const USERS = [
  {
    email: 'Josefina1@bitforex.online',
    password: 'Medrano2025',
    name: 'Josefina',
    totalBalance: 150237.8912,
    withdrawableMin: 21000,
    withdrawableMax: 21100,
  },
  {
    email: 'Anabel@bitforex.online',
    password: 'Caguana2025',
    name: 'Anabel',
    totalBalance: 527.8912,
    withdrawableMin: 527.8912,
    withdrawableMax: 527.8912,
  }
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t } = useContext(LanguageContext)

  useEffect(() => {
    setEmail('')
    setPassword('')
    setError('')
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const user = USERS.find(u => u.email === email && u.password === password)
    if (!user) {
      return setError(t.invalidCredentials)
    }

    localStorage.clear()
    localStorage.setItem('userName', user.name)
    localStorage.setItem('userConfig', JSON.stringify({
      totalBalance: user.totalBalance,
      withdrawableMin: user.withdrawableMin,
      withdrawableMax: user.withdrawableMax,
    }))

    window.location.href = '/landing'
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative bg-gradient-to-br from-black via-teal-950 to-black">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md space-y-6 rounded-2xl border border-teal-500/30 bg-black/40 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center">
          <img src="/logo.png" alt="BitForex" className="mx-auto h-16 w-16 rounded-xl shadow-lg ring-4 ring-teal-500/20" />
          <h1 className="mt-3 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent crypto-font">
            BitForex
          </h1>
          <p className="mt-2 text-sm text-teal-200">{t.loginTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-teal-100">{t.emailLabel}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-teal-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-teal-500/30 bg-black/50 px-4 py-3 pl-10 text-white placeholder:text-teal-300 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                placeholder={t.emailLabel}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-teal-100">{t.passwordLabel}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-teal-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-teal-500/30 bg-black/50 px-4 py-3 pl-10 text-white placeholder:text-teal-300 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                placeholder={t.passwordLabel}
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500 bg-red-900/30 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover-glow"
          >
            {t.loginButton}
          </button>
        </form>

        <p className="text-center text-xs text-teal-300">
          {t.footer}
        </p>
      </motion.div>
    </div>
  )
}