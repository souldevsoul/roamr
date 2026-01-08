'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Globe,
  Plane,
  Wifi,
  Zap,
  Shield,
  ChevronRight,
  QrCode,
  Smartphone,
  ArrowRight,
  Star,
  CheckCircle2
} from 'lucide-react'

const popularDestinations = [
  { name: 'Japan', code: 'JP', price: 4.99, flag: '🇯🇵' },
  { name: 'Thailand', code: 'TH', price: 3.99, flag: '🇹🇭' },
  { name: 'United States', code: 'US', price: 5.99, flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', price: 4.49, flag: '🇬🇧' },
  { name: 'France', code: 'FR', price: 4.49, flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', price: 4.49, flag: '🇩🇪' },
  { name: 'South Korea', code: 'KR', price: 4.99, flag: '🇰🇷' },
  { name: 'Singapore', code: 'SG', price: 3.99, flag: '🇸🇬' },
]

const features = [
  {
    icon: Zap,
    title: 'Instant Activation',
    description: 'Get connected in seconds with QR code installation',
    color: 'var(--accent-lime)',
  },
  {
    icon: Globe,
    title: '190+ Countries',
    description: 'Coverage across the globe for seamless travel',
    color: 'var(--accent-blue)',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade network with guaranteed uptime',
    color: 'var(--accent-purple)',
  },
  {
    icon: Wifi,
    title: 'High Speed',
    description: '4G/5G speeds wherever you roam',
    color: 'var(--primary)',
  },
]

const steps = [
  {
    number: '01',
    title: 'Choose Destination',
    description: 'Select your country and data plan',
    icon: Globe,
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

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const airplaneX = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div className="bg-mesh min-h-screen" ref={containerRef}>
      {/* Progress Airplane */}
      <div className="fixed top-20 left-0 right-0 h-1 bg-[var(--surface)] z-40">
        <motion.div
          className="absolute top-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-lime)]"
          style={{ width: airplaneX }}
        />
        <motion.div
          className="absolute -top-3"
          style={{ left: airplaneX }}
        >
          <Plane className="w-6 h-6 text-[var(--primary)] transform -rotate-12" />
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--primary)] opacity-10 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-blue)] opacity-10 blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-8">
              <span className="badge-lime">New</span>
              <span className="text-sm text-[var(--text-secondary)]">
                190+ countries now available
              </span>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-white">TRAVEL</span>
              <br />
              <span className="text-gradient">CONNECTED</span>
            </h1>

            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
              Instant eSIM activation for global travelers.
              No physical cards. No roaming fees. Just data.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/destinations" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                Explore Destinations
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/help" className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                How It Works
                <Plane className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[var(--accent-lime)] fill-[var(--accent-lime)]"
                    />
                  ))}
                </div>
                <span className="text-sm">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-lime)]" />
                <span className="text-sm">100K+ Travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--accent-blue)]" />
                <span className="text-sm">Secure Payments</span>
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

      {/* Popular Destinations - Floating Cards */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Popular</span> Destinations
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Where will you roam next?
            </p>
          </motion.div>

          {/* Horizontal Scroll Container */}
          <div className="snap-scroll-x flex gap-6 pb-6 -mx-4 px-4">
            {popularDestinations.map((dest, index) => (
              <motion.div
                key={dest.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="snap-item flex-shrink-0"
              >
                <Link
                  href={`/destinations/${dest.code.toLowerCase()}`}
                  className="card-gradient-border block w-64 p-6 hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-5xl mb-4">{dest.flag}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-4">
                    High-speed 4G/5G data
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">From</span>
                      <div className="text-2xl font-bold text-[var(--primary)]">
                        ${dest.price}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[var(--text-muted)]" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
            >
              <span>View all 190+ destinations</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - QR Demo */}
      <section className="py-20 px-4 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get Connected in <span className="text-gradient">3 Steps</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Simple, fast, and hassle-free setup
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-[var(--primary)] to-transparent" />
                )}

                <div className="card text-center relative z-10 bg-[var(--bg)]">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] mb-6">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-[var(--primary)] mb-2">
                    Step {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-[var(--text-secondary)]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Phone Mockup with QR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <div className="relative">
              <div className="w-72 h-[500px] bg-[var(--bg)] rounded-[3rem] border-4 border-[var(--surface-light)] p-4 shadow-2xl">
                <div className="w-full h-full bg-[var(--surface)] rounded-[2.5rem] flex flex-col items-center justify-center p-8">
                  <Smartphone className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                  <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center mb-6">
                    <QrCode className="w-32 h-32 text-[var(--bg)]" />
                  </div>
                  <p className="text-center text-sm text-[var(--text-secondary)]">
                    Scan with your camera to activate eSIM
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -right-20 top-20 badge-lime px-3 py-2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Instant Setup
              </motion.div>
              <motion.div
                className="absolute -left-16 bottom-32 badge-blue px-3 py-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                No Physical SIM
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
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
              Built for modern travelers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group hover:border-[color:var(--feature-color)] transition-colors"
                style={{ '--feature-color': feature.color } as React.CSSProperties}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] p-12 text-center"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Roam?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of travelers who stay connected with ROAMR.
                Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/destinations"
                  className="btn-lime text-lg px-8 py-4 flex items-center gap-2"
                >
                  Get Your eSIM
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/destinations"
                  className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                  View Coverage
                </Link>
              </div>
            </div>

            {/* Decorative Plane */}
            <motion.div
              className="absolute -bottom-4 -right-4 opacity-20"
              animate={{
                x: [0, 20, 0],
                y: [0, -10, 0],
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Plane className="w-48 h-48 transform rotate-45" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
