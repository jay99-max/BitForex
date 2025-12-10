import { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Send, AlertCircle, TrendingUp, Shield, LogOut,
  ArrowUpRight, ArrowDownRight, DollarSign, Activity,
  BarChart3, RefreshCw
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { LanguageContext } from '../App.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import axios from 'axios'

// COINS — USDT LAST
const COINS = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple', 'tether']
const ICONS = [
  '/icons/btc.svg',
  '/icons/eth.svg',
  '/icons/bnb.svg',
  '/icons/sol.svg',
  '/icons/xrp.svg',
  '/icons/usdt.svg'
]

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useContext(LanguageContext)
  const queryClient = useQueryClient()

  const userName = localStorage.getItem('userName') || 'User'
  const savedConfig = JSON.parse(localStorage.getItem('userConfig') || '{}')
  const [totalBalance, setTotalBalance] = useState(savedConfig.totalBalance || 1000)

  // PERSISTENT YIELD GROWTH (NO RESET)
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalBalance(prev => {
        const growth = prev * (0.092 / 365 / 24 / 60 / 60)
        const newBalance = prev + growth
        localStorage.setItem('userConfig', JSON.stringify({ ...savedConfig, totalBalance: newBalance }))
        return newBalance
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [savedConfig])

  // WITHDRAWABLE FROM userConfig (LOGIN SET)
  const withdrawable = savedConfig.withdrawableMin !== undefined
    ? savedConfig.withdrawableMin.toFixed(4)
    : (totalBalance * 0.8).toFixed(4)

  // REAL CRYPTO PRICES
  const { data: cryptoData, isLoading: cryptoLoading } = useQuery({
    queryKey: ['crypto-prices'],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${COINS.join(',')}&vs_currencies=usd&include_24hr_change=true`
      )
      return data
    },
    refetchInterval: 30000,
    staleTime: 10000,
    retry: 2
  })

  const usdtPrice = cryptoData?.tether?.usd || 1.0000

  // PARTICLES
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  const particlesOptions = useMemo(() => ({
    background: { color: { value: 'transparent' } },
    fpsLimit: 120,
    particles: {
      number: { value: 80, density: { enable: true } },
      color: { value: '#0d9488' },
      shape: { type: 'circle' },
      opacity: { value: 0.5 },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, speed: 1 }
    },
    detectRetina: true
  }), [])

  // FAKE WITHDRAW
  const fakeWithdraw = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 2500))
    if (Math.random() < 0.6) {
      setError('Transaction failed: insufficient coupon')
    } else {
      setError(['ERC20: transfer amount exceeds allowance', 'Gas limit exceeded'][Math.floor(Math.random() * 2)])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-teal-950 to-black text-white relative overflow-hidden">
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="absolute inset-0 -z-10" />

      {/* HEADER */}
      <header className="border-b border-teal-500/20 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="BitForex" className="h-10 w-10 rounded-lg shadow-lg" />
            <h1 className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent crypto-font">
              BitForex
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-teal-300">{t.hi.replace('{name}', userName)}</span>
            <button onClick={() => queryClient.invalidateQueries(['crypto-prices'])} className="p-2 rounded-lg hover:bg-white/10">
              <RefreshCw className="h-5 w-5 text-teal-300" />
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/') }} className="flex items-center gap-2 text-sm text-teal-300 hover:text-white">
              <LogOut className="h-5 w-5" /> {t.logout}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* LIVE PRICES — USDT LAST */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-teal-100 mb-4">Live Market</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {cryptoLoading ? (
              Array(6).fill().map((_, i) => <div key={i} className="skeleton h-20 rounded-xl"></div>)
            ) : (
              COINS.map((coin, i) => {
                const data = cryptoData?.[coin]
                if (!data) return null
                const change = data.usd_24h_change?.toFixed(2)
                const symbol = coin === 'binancecoin' ? 'BNB' : coin === 'tether' ? 'USDT' : coin.slice(0, 3).toUpperCase()
                return (
                  <motion.div
                    key={coin}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center p-3 rounded-xl bg-black/40 border border-teal-500/30 hover-glow"
                  >
                    <img src={ICONS[i]} alt={symbol} className="w-8 h-8 mb-1" />
                    <p className="text-xs font-medium text-teal-300">{symbol}</p>
                    <p className="text-sm font-bold">
                      ${data.usd.toLocaleString(undefined, { minimumFractionDigits: coin === 'tether' ? 4 : 2 })}
                    </p>
                    <p className={`text-xs ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {change > 0 ? <ArrowUpRight className="inline h-3 w-3" /> : <ArrowDownRight className="inline h-3 w-3" />}
                      {Math.abs(change)}%
                    </p>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* STATS — FROM userConfig */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">
          {[
            { label: t.totalBalance, value: totalBalance.toFixed(4), unit: 'USDT', icon: DollarSign },
            { label: t.currentApy, value: '9.2%', sub: t.dailyCompound, icon: TrendingUp },
            { label: t.withdrawable, value: withdrawable.toLocaleString(), unit: 'USDT', icon: Activity },
            { label: t.securityStatus, value: 'Active', sub: t.multiSig, icon: Shield },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="rounded-2xl border border-teal-500/30 bg-black/40 p-6 shadow-2xl backdrop-blur-xl hover-glow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-teal-200">{stat.label}</p>
                {stat.icon && <stat.icon className="h-5 w-5 text-teal-400" />}
              </div>
              <h3 className="text-2xl font-bold text-white">
                {stat.value} {stat.unit && <span className="text-teal-300 text-lg">{stat.unit}</span>}
              </h3>
              <p className="mt-1 text-xs text-teal-300">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <motion.div className="rounded-2xl border border-teal-500/30 bg-black/40 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-teal-100 mb-4">Portfolio</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={[{ value: 100, color: '#0d9488' }]} dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={60}>
                  <Cell fill="#0d9488" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className="rounded-2xl border border-teal-500/30 bg-black/40 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-teal-100 mb-4">APY Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={Array.from({ length: 7 }, (_, i) => ({ day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i], apy: 9.0 + Math.random() * 0.5 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="day" stroke="#0d9488" />
                <YAxis stroke="#0d9488" />
                <Tooltip />
                <Line type="monotone" dataKey="apy" stroke="#0d9488" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* WITHDRAW */}
        <div className="text-center">
          <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-12 py-5 font-bold text-xl text-white transition-all duration-300 hover-glow hover:scale-105 mx-auto">
            <Send className="h-6 w-6" /> {t.requestWithdrawal}
          </button>
        </div>

        {/* MODAL */}
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => !loading && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-md rounded-2xl border border-teal-500/30 bg-black/40 p-6 shadow-2xl backdrop-blur-xl" onClick={e => e.stopPropagation()}>
              <h3 className="mb-5 text-2xl font-bold text-teal-100">Withdraw USDT</h3>
              <form onSubmit={fakeWithdraw}>
                <input type="number" step="0.0001" placeholder="0.0000" value={amount} onChange={e => setAmount(e.target.value)} className="mb-4 w-full rounded-xl border border-teal-500/30 bg-black/50 px-4 py-3 text-center text-xl font-mono text-white placeholder:text-teal-300" required />
                <div className="mb-4 space-y-1 text-sm text-teal-300">
                  <p>Available: {withdrawable.toLocaleString()} USDT</p>
                  <p>Est. Gas: ~$2.50</p>
                </div>
                {error && <div className="mb-4 rounded-xl border border-red-500 bg-red-900/30 p-4 text-sm text-red-300"><AlertCircle className="mr-2 inline h-5 w-5" />{error}</div>}
                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-4 font-bold text-white transition-all duration-300 disabled:opacity-50 hover-glow">
                  {loading ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>Processing</> : 'Confirm'}
                </button>
              </form>
              <button onClick={() => setShowModal(false)} className="mt-4 w-full text-sm text-teal-300 hover:text-white" disabled={loading}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  )
}