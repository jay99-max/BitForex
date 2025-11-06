import { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { Send, AlertCircle, TrendingUp, Shield, LogOut, ArrowUpRight, ArrowDownRight, DollarSign, Activity, BarChart3, PieChartIcon } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { LanguageContext } from '../App.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState(1.0000)
  const navigate = useNavigate()
  const { t } = useContext(LanguageContext)

  // USER DATA FROM LOCALSTORAGE
  const userName = localStorage.getItem('userName') || 'User'
  const config = JSON.parse(localStorage.getItem('userConfig') || '{}')
  const totalBalance = config.totalBalance || 0
  const withdrawable = config.withdrawableMin === config.withdrawableMax
    ? config.withdrawableMin.toFixed(4)
    : (config.withdrawableMin + Math.random() * (config.withdrawableMax - config.withdrawableMin)).toFixed(4)

  // LIVE USDT PRICE TICKER
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => (parseFloat(prev) + (Math.random() - 0.5) * 0.0002).toFixed(4))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // CHART DATA
  const portfolioData = [{ name: 'USDT Yield Vault', value: totalBalance, color: '#0d9488' }]
  const apyData = [
    { day: 'Mon', apy: 8.2 }, { day: 'Tue', apy: 8.5 }, { day: 'Wed', apy: 8.7 },
    { day: 'Thu', apy: 9.1 }, { day: 'Fri', apy: 9.3 }, { day: 'Sat', apy: 9.0 },
    { day: 'Sun', apy: 9.2 },
  ]

  // FAKE WITHDRAWAL — COUPON ERROR 60%
  const fakeWithdraw = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 3200))

    if (Math.random() < 0.6) {
      setError('Transaction failed: insufficient coupon')
    } else {
      const otherErrors = [
        'ERC20: transfer amount exceeds allowance',
        'Transaction failed: insufficient gas',
        'Network timeout — try again',
      ]
      setError(otherErrors[Math.floor(Math.random() * otherErrors.length)])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-teal-950 to-black text-white">
      {/* HEADER */}
      <header className="border-b border-teal-500/20 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="BitForex" className="h-10 w-10 rounded-lg shadow-lg" />
            <h1 className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent crypto-font">
              BitForex
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-teal-300">
              {t.hi.replace('{name}', userName)}
            </span>
            <button
              onClick={() => {
                // FULL LOGOUT: CLEAR EVERYTHING
                localStorage.clear()
                sessionStorage.clear()
                // FORCE FULL RELOAD TO LOGIN
                window.location.href = '/'
              }}
              className="flex items-center gap-2 text-sm text-teal-300 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" /> {t.logout}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* LIVE PRICE */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-teal-300">{t.livePrice}</span>
            <span className="font-mono text-xl font-bold text-cyan-300">${price}</span>
            {Math.random() > 0.5 ? (
              <ArrowUpRight className="h-5 w-5 text-green-400 animate-pulse" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-red-400 animate-pulse" />
            )}
          </div>
          <div className="text-xs text-teal-400">
            {t.lastUpdated} {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">
          {[
            { label: t.totalBalance, value: totalBalance.toFixed(4), unit: 'USDT', icon: DollarSign, change: '+12.34%' },
            { label: t.currentApy, value: '9.2%', sub: t.dailyCompound, icon: TrendingUp },
            { label: t.withdrawable, value: withdrawable, unit: 'USDT', icon: Activity },
            { label: t.securityStatus, value: 'Active', sub: t.multiSig, icon: Shield },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-teal-500/30 bg-black/40 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-teal-200">{stat.label}</p>
                {stat.icon && <stat.icon className="h-5 w-5 text-teal-400" />}
              </div>
              <h3 className="text-2xl font-bold text-white">
                {stat.value} {stat.unit && <span className="text-teal-300 text-lg">{stat.unit}</span>}
              </h3>
              <p className="mt-1 text-xs text-teal-300">
                {stat.sub || (stat.change && (
                  <span className={stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                    {stat.change} today
                  </span>
                ))}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Portfolio Pie Chart */}
          <motion.div className="rounded-2xl border border-teal-500/30 bg-black/40 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-teal-100">{t.portfolioTitle}</h3>
              <PieChartIcon className="h-5 w-5 text-teal-400" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={portfolioData} dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={60}>
                  {portfolioData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #0d9488', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-4 text-center text-sm text-teal-300">100% in USDT Yield Vault</p>
          </motion.div>

          {/* APY Line Chart */}
          <motion.div className="rounded-2xl border border-teal-500/30 bg-black/40 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-teal-100">{t.apyPerformance}</h3>
              <BarChart3 className="h-5 w-5 text-teal-400" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={apyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="day" stroke="#0d9488" />
                <YAxis stroke="#0d9488" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #0d9488', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="apy" stroke="#0d9488" strokeWidth={3} dot={{ fill: '#0d9488', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* REQUEST WITHDRAWAL BUTTON */}
        <div className="text-center mb-10">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-12 py-5 font-bold text-xl text-white transition-all duration-300 hover-glow hover:scale-105 mx-auto"
          >
            <Send className="h-6 w-6" />
            {t.requestWithdrawal}
          </button>
        </div>

        {/* WITHDRAWAL MODAL */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => !loading && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-md rounded-2xl border border-teal-500/30 bg-black/40 p-6 shadow-2xl backdrop-blur-xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="mb-5 text-2xl font-bold text-teal-100">{t.withdrawModalTitle}</h3>
              <form onSubmit={fakeWithdraw}>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="0.0000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="mb-4 w-full rounded-xl border border-teal-500/30 bg-black/50 px-4 py-3 text-center text-xl font-mono text-white placeholder:text-teal-300 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  required
                />
                <div className="mb-4 space-y-1 text-sm text-teal-300">
                  <p>{t.available} {withdrawable} USDT</p>
                  <p>{t.estGas}</p>
                </div>
                {error && (
                  <div className="mb-4 rounded-xl border border-red-500 bg-red-900/30 p-4 text-sm text-red-300">
                    <AlertCircle className="mr-2 inline h-5 w-5" />
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-4 font-bold text-white transition-all duration-300 disabled:opacity-50 hover-glow"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      {t.processing}
                    </>
                  ) : (
                    t.confirmWithdrawal
                  )}
                </button>
              </form>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-full text-sm text-teal-300 hover:text-white"
                disabled={loading}
              >
                {t.cancel}
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  )
}