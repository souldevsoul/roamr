'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Globe, Mail, Zap, Shield, Signal, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    explore: [
      { label: 'Destinations', href: '/destinations' },
      { label: 'Coverage Map', href: '/destinations' },
      { label: 'How It Works', href: '/help' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Install eSIM', href: '/help/install-esim' },
      { label: 'FAQs', href: '/help#faq' },
      { label: 'Contact Us', href: '/help' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/legal/terms' },
      { label: 'Privacy Policy', href: '/legal/privacy' },
      { label: 'Refund Policy', href: '/legal/refund' },
    ],
  }

  const popularDestinations = [
    { name: 'Japan', code: 'JP' },
    { name: 'USA', code: 'US' },
    { name: 'Thailand', code: 'TH' },
    { name: 'UK', code: 'GB' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
  ]

  const features = [
    { icon: Zap, label: 'Instant Activation', color: 'var(--accent-lime)' },
    { icon: Shield, label: 'Secure', color: 'var(--accent-blue)' },
    { icon: Signal, label: '4G/5G Speed', color: 'var(--accent-purple)' },
  ]

  return (
    <footer className="relative bg-[var(--surface)] overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--primary)] opacity-5 blur-3xl rounded-full" />
        <div className="absolute bottom-20 right-40 w-48 h-48 bg-[var(--accent-blue)] opacity-5 blur-3xl rounded-full" />
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay Connected Everywhere
              </h3>
              <p className="text-[var(--text-secondary)]">
                Get travel tips and exclusive deals straight to your inbox
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input w-full sm:w-72 bg-[var(--bg)]"
              />
              <button className="btn-primary whitespace-nowrap flex items-center justify-center gap-2">
                Subscribe
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-xl border-2 border-[var(--primary)] animate-ping opacity-20" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient">ROAMR</span>
                <p className="text-xs text-[var(--text-muted)]">Global eSIM Provider</p>
              </div>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-sm">
              Stay connected anywhere in the world with instant eSIM activation.
              No physical SIM cards, no roaming fees. Just seamless connectivity.
            </p>

            {/* Features badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg)] border border-[var(--border)]"
                >
                  <feature.icon className="w-3.5 h-3.5" style={{ color: feature.color }} />
                  <span className="text-xs text-[var(--text-secondary)]">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Popular Destinations */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                Popular Destinations
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularDestinations.map((dest) => (
                  <Link
                    key={dest.code}
                    href={`/destinations/${dest.code.toLowerCase()}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-white transition-all group"
                  >
                    <span className="text-base">{getFlagEmoji(dest.code)}</span>
                    <span>{dest.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-[var(--text-muted)]">We accept:</span>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/visa.png"
                  alt="Visa"
                  width={40}
                  height={25}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
                <Image
                  src="/images/master-card.png"
                  alt="Mastercard"
                  width={40}
                  height={25}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-[var(--primary)] rounded-full" />
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-[var(--accent-blue)] rounded-full" />
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-[var(--accent-purple)] rounded-full" />
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-[var(--text-muted)] text-sm">
              <motion.div
                className="w-2 h-2 rounded-full bg-[var(--accent-lime)]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>&copy; {currentYear} ROAMR. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="mailto:support@roamr.co"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@roamr.co
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
    </footer>
  )
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
