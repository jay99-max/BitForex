import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

// Generate 120+ realistic USDT transactions (400–2500 USDT)
const generateTransactions = () => {
  const types = ['deposit', 'withdrawal', 'trade_profit']
  const statuses = ['completed', 'pending']
  const now = new Date()
  const txs = []

  for (let i = 0; i < 120; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const amount = (400 + Math.random() * 2100).toFixed(4) // 400–2500
    const status = i < 2 ? 'pending' : 'completed' // First 2 = pending
    const date = new Date(now)
    date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 1440)) // Up to 24h ago

    txs.push({
      id: `tx_${i}`,
      type,
      amount: parseFloat(amount),
      status,
      date: date.toISOString(),
    })
  }

  return txs.sort((a, b) => new Date(b.date) - new Date(a.date))
}

const transactions = generateTransactions()

export default function PublicTransactions() {
  const getIcon = (type) => {
    switch (type) {
      case 'deposit': return <ArrowDownRight className="h-5 w-5 text-green-400" />
      case 'withdrawal': return <ArrowUpRight className="h-5 w-5 text-red-400" />
      case 'trade_profit': return <TrendingUp className="h-5 w-5 text-cyan-400" />
      default: return null
    }
  }

  const getLabel = (type) => {
    switch (type) {
      case 'deposit': return 'Deposit'
      case 'withdrawal': return 'Withdrawal'
      case 'trade_profit': return 'Trade Profit'
      default: return type
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)

    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-teal-950 to-black text-white py-16 px-6">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Transaction History
          </h1>
          <p className="text-teal-300">Recent USDT activity on BitForex</p>
        </div>

        {/* BACK BUTTON */}
        <div className="flex justify-center mb-8">
          <Link
            to="/landing"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium transition"
          >
            Back to Home
          </Link>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl border border-teal-500/30 bg-black/40 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-teal-500/20">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-teal-300">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-teal-300">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-teal-300">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-teal-300">Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.01, duration: 0.3 }}
                    className="border-b border-teal-500/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getIcon(tx.type)}
                        <span className="font-medium">{getLabel(tx.type)}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-lg">
                      {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-teal-300">
                      {formatTime(tx.date)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-xs text-teal-400">
          <p>Showing 120 recent transactions</p>
        </div>
      </div>
    </div>
  )
}