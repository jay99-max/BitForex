import { motion } from 'framer-motion'
import { Shield, TrendingUp, Users, Send, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { LanguageContext } from '../App.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Landing() {
  const navigate = useNavigate()
  const { t } = useContext(LanguageContext)
  const userName = localStorage.getItem('userName') || 'User'

  const features = [
    { icon: TrendingUp, title: t.featuresTitle1, desc: t.featuresDesc1 },
    { icon: Shield, title: t.featuresTitle2, desc: t.featuresDesc2 },
    { icon: Users, title: t.featuresTitle3, desc: t.featuresDesc3 }
  ]

  const testimonials = [
    { name: 'Elena R.', role: 'Tech Entrepreneur', quote: 'BitForex is the best — 9.2% APY changed everything.' },
    { name: 'Jose L.', role: 'Financial Advisor', quote: 'Secure, compliant, and transparent. BitForex is unmatched.' },
    { name: 'Hernandez L.', role: 'Retired Investor', quote: 'From $2K to $5K+ in months. BitForex is the best.' },
    { name: 'Emilia T.', role: 'Business Owner', quote: 'Intuitive and secure. BitForex is the best crypto platform.' },
  ]

  return (
    <div className="min-h-screen px-6 py-20 bg-gradient-to-br from-black via-teal-950 to-black text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-end mb-8">
          <LanguageSwitcher />
        </div>

        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
          <img src="/logo.png" alt="BitForex" className="mx-auto h-20 w-20 rounded-xl mb-4 shadow-2xl ring-4 ring-teal-500/20" />
          <h1 className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-5xl md:text-7xl font-bold text-transparent crypto-font">
            {t.welcome.replace('{name}', userName)}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-teal-100 font-medium">
            {t.earning} <span className="font-bold text-cyan-300">{t.apy}</span> {t.securely}
          </p>
        </motion.div>

        {/* ACTION BUTTONS — FIXED: NO <Link>, USE navigate() */}
        <motion.div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
          <button
            onClick={() => navigate('/dashboard')}
            className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-12 py-5 font-bold text-xl text-white hover-glow hover:scale-105 transition-all duration-300"
          >
            <Send className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            My Dashboard
          </button>

          <button
            onClick={() => navigate('/transactions')}
            className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-5 font-bold text-xl text-white hover-glow hover:scale-105 transition-all duration-300"
          >
            <Activity className="h-6 w-6" />
            View Transactions
          </button>
        </motion.div>

        {/* FEATURES */}
        <section className="mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group rounded-2xl border border-teal-500/30 bg-black/40 p-8 shadow-2xl backdrop-blur-xl text-center hover:border-teal-400 hover:shadow-teal-500/20 hover:-translate-y-1 transition-all"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg group-hover:scale-110 transition-transform">
                  <f.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{f.title}</h3>
                <p className="text-sm text-teal-200 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12 text-center text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text crypto-font"
          >
            {t.testimonialsTitle}
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-teal-500/30 bg-black/40 p-6 shadow-xl backdrop-blur-xl hover:border-cyan-400 hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all"
              >
                <p className="mb-4 text-sm italic text-teal-100 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500"></div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-teal-300">— {t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-20 text-center">
          <p className="text-xs text-teal-400">{t.footerLanding}</p>
        </footer>
      </div>
    </div>
  )
}