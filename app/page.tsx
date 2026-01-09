'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Wifi,
  Zap,
  Shield,
  ChevronRight,
  QrCode,
  Smartphone,
  ArrowRight,
  Star,
  CheckCircle2,
  Signal,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react'

const popularDestinations = [
  { name: 'Japan', code: 'JP', price: 4.99, flag: '🇯🇵', data: '5GB' },
  { name: 'Thailand', code: 'TH', price: 3.99, flag: '🇹🇭', data: '3GB' },
  { name: 'United States', code: 'US', price: 5.99, flag: '🇺🇸', data: '10GB' },
  { name: 'United Kingdom', code: 'GB', price: 4.49, flag: '🇬🇧', data: '5GB' },
  { name: 'France', code: 'FR', price: 4.49, flag: '🇫🇷', data: '5GB' },
  { name: 'Germany', code: 'DE', price: 4.49, flag: '🇩🇪', data: '5GB' },
  { name: 'South Korea', code: 'KR', price: 4.99, flag: '🇰🇷', data: '5GB' },
  { name: 'Singapore', code: 'SG', price: 3.99, flag: '🇸🇬', data: '3GB' },
]

const features = [
  {
    icon: Zap,
    title: 'Instant Activation',
    description: 'Get connected in seconds with QR code installation',
    color: 'var(--accent-lime)',
    stat: '<60s',
    statLabel: 'Setup time',
  },
  {
    icon: Globe,
    title: '190+ Countries',
    description: 'Coverage across the globe for seamless travel',
    color: 'var(--accent-blue)',
    stat: '190+',
    statLabel: 'Destinations',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade network with guaranteed uptime',
    color: 'var(--accent-purple)',
    stat: '99.9%',
    statLabel: 'Uptime',
  },
  {
    icon: Signal,
    title: '5G Speed',
    description: 'Lightning-fast 4G/5G wherever you roam',
    color: 'var(--primary)',
    stat: '5G',
    statLabel: 'Network',
  },
]

const steps = [
  {
    number: '01',
    title: 'Choose Destination',
    description: 'Select your country and data plan',
    icon: MapPin,
  },
  {
    number: '02',
    title: 'Scan QR Code',
    description: 'Use your phone camera to scan',
    icon: QrCode,
  },
  {
    number: '03',
    title: 'Connect & Go',
    description: 'Activate and start using data',
    icon: Wifi,
  },
]

const stats = [
  { value: '100K+', label: 'Happy Travelers' },
  { value: '4.9', label: 'App Rating' },
  { value: '24/7', label: 'Support' },
  { value: '190+', label: 'Countries' },
]

// Animated counter component
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return <span>{count.toLocaleString()}{suffix}</span>
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const [activeDestination, setActiveDestination] = useState(0)

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Auto-rotate destinations
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDestination(prev => (prev + 1) % popularDestinations.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-[var(--bg)] min-h-screen overflow-x-hidden" ref={containerRef}>
      {/* Minimal Progress Bar */}
      <div className="fixed top-20 left-0 right-0 h-px bg-[var(--border)] z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent-purple)] to-[var(--accent-lime)]"
          style={{ width: progressWidth }}
        />
      </div>

      {/* Hero Section - Completely Redesigned */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.4, 0.6],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168,245,119,0.1) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Centered Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Live Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-lime)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-lime)]"></span>
              </span>
              <span className="text-sm text-[var(--text-secondary)]">
                <AnimatedNumber value={190} suffix="+" /> countries online
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-6 leading-[1.05]">
              <span className="text-white">Global Data.</span>
              <br />
              <span className="text-gradient">Zero Friction.</span>
            </h1>

            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
              Instant eSIM activation for travelers. Connect to local networks worldwide without swapping cards or dealing with roaming fees.
            </p>

            {/* CTA Buttons - Centered */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/destinations"
                className="group relative inline-flex items-center justify-center"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent-purple)] to-[var(--accent-lime)] rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-500" />
                <div className="relative px-8 py-4 bg-[var(--primary)] rounded-xl text-lg font-semibold text-white flex items-center gap-2">
                  Get Your eSIM
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link
                href="/destinations"
                className="px-8 py-4 rounded-xl text-lg font-medium text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                View Coverage
              </Link>
            </div>

            {/* Social Proof - Centered */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-purple)] border-2 border-[var(--bg)] flex items-center justify-center text-xs font-bold text-white"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-[var(--text-muted)]">100K+ travelers</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-[var(--accent-lime)] fill-[var(--accent-lime)]" />
                ))}
                <span className="text-sm text-[var(--text-muted)] ml-1">4.9/5</span>
              </div>
            </div>
          </motion.div>

          {/* Destination Carousel - Below Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Floating Feature Pills */}
            <div className="flex justify-center gap-4 mb-8">
              <motion.div
                className="px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] backdrop-blur-sm"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[var(--accent-lime)]" />
                  <span className="text-sm font-medium text-white">Instant Setup</span>
                </div>
              </motion.div>
              <motion.div
                className="px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] backdrop-blur-sm"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--accent-blue)]" />
                  <span className="text-sm font-medium text-white">Secure</span>
                </div>
              </motion.div>
              <motion.div
                className="px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] backdrop-blur-sm"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <Signal className="w-4 h-4 text-[var(--accent-purple)]" />
                  <span className="text-sm font-medium text-white">5G Ready</span>
                </div>
              </motion.div>
            </div>

            {/* Active Destination Card */}
            <div className="relative max-w-md mx-auto bg-[var(--surface)]/80 backdrop-blur-xl rounded-3xl border border-[var(--border)] p-8 overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDestination}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4">{popularDestinations[activeDestination].flag}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {popularDestinations[activeDestination].name}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm mb-4">
                    {popularDestinations[activeDestination].data} • 30 Days • 4G/5G
                  </p>
                  <div className="text-4xl font-bold text-gradient">
                    ${popularDestinations[activeDestination].price}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Destination Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {popularDestinations.slice(0, 8).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDestination(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeDestination
                        ? 'bg-[var(--primary)] w-6'
                        : 'bg-[var(--border)] hover:bg-[var(--text-muted)]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-[var(--border)] flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations - Card Grid */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6">
              <Sparkles className="w-4 h-4 text-[var(--accent-lime)]" />
              <span className="text-sm text-[var(--text-secondary)]">Top picks</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Popular <span className="text-gradient">Destinations</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
              Join thousands of travelers staying connected worldwide
            </p>
          </motion.div>

          {/* Destination Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularDestinations.map((dest, index) => (
              <motion.div
                key={dest.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/destinations/${dest.code.toLowerCase()}`}
                  className="group block relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 hover:border-[var(--primary)] transition-all duration-300"
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 to-[var(--accent-purple)]/0 group-hover:from-[var(--primary)]/10 group-hover:to-[var(--accent-purple)]/10 transition-all duration-300" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl group-hover:scale-110 transition-transform inline-block">{dest.flag}</span>
                      <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{dest.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-4">{dest.data} • 4G/5G</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-xs text-[var(--text-muted)]">From</span>
                        <div className="text-2xl font-bold text-[var(--primary)]">${dest.price}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--accent-lime)]">
                        <Clock className="w-3 h-3" />
                        <span>30 days</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-white transition-all"
            >
              <span>View all 190+ destinations</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Minimal Steps */}
      <section className="py-20 px-4 bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">3 Simple</span> Steps
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Get connected in under a minute
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent -translate-y-1/2" />

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-[var(--bg)] rounded-2xl p-8 text-center relative z-10">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white font-bold text-lg mb-6">
                    {index + 1}
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-[var(--primary)]" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-[var(--text-secondary)]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Phone Demo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-[450px] bg-[var(--bg)] rounded-[2.5rem] border-4 border-[var(--surface-light)] p-3 shadow-2xl">
                <div className="w-full h-full bg-[var(--surface)] rounded-[2rem] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[var(--bg)] rounded-b-xl" />

                  <Smartphone className="w-10 h-10 text-[var(--text-muted)] mb-4" />
                  <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center mb-4">
                    <QrCode className="w-24 h-24 text-[var(--bg)]" />
                  </div>
                  <p className="text-center text-sm text-[var(--text-secondary)]">
                    Scan to activate
                  </p>
                </div>
              </div>

              {/* Floating Badges */}
              <motion.div
                className="absolute -right-16 top-16 px-3 py-2 rounded-lg bg-[var(--accent-lime)]/10 border border-[var(--accent-lime)]/30"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2 text-[var(--accent-lime)]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Activated</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -left-12 bottom-24 px-3 py-2 rounded-lg bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center gap-2 text-[var(--accent-blue)]">
                  <Signal className="w-4 h-4" />
                  <span className="text-sm font-medium">5G Connected</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - With Stats */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="text-gradient">ROAMR</span>?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Built for modern travelers who demand more
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 hover:border-[color:var(--feature-color)] transition-colors"
                style={{ '--feature-color': feature.color } as React.CSSProperties}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: feature.color }}>
                      {feature.stat}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">{feature.statLabel}</div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] p-12 md:p-16 text-center"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-8"
              >
                <Globe className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Roam?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                Join 100,000+ travelers who stay connected with ROAMR
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/destinations"
                  className="group px-8 py-4 bg-white rounded-xl text-[var(--primary)] font-bold text-lg flex items-center gap-2 hover:bg-white/90 transition-colors"
                >
                  Get Your eSIM
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/destinations"
                  className="px-8 py-4 border-2 border-white/30 rounded-xl text-white font-medium text-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Browse Countries
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
