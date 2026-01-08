'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Globe, Mail, Plane } from 'lucide-react'

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

  return (
    <footer className="relative bg-[var(--surface)] border-t border-[var(--border)]">
      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-gradient">ROAMR</span>
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-xs">
              Stay connected anywhere in the world with instant eSIM activation.
              No physical SIM cards, no roaming fees.
            </p>

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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-white transition-colors"
                  >
                    <span className="text-base">{getFlagEmoji(dest.code)}</span>
                    <span>{dest.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
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

          {/* Explore Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
              <Plane className="w-4 h-4 text-[var(--primary)]" />
              <span>&copy; {currentYear} ROAMR. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-4">
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

      {/* Decorative airplane path */}
      <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden pointer-events-none opacity-5">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60 Q300 20, 600 40 T1200 30"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 8"
            className="text-[var(--primary)]"
          />
        </svg>
      </div>
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
