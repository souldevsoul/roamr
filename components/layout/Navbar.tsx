'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  User,
  Menu,
  X,
  Compass,
  LifeBuoy,
  LogOut,
  ChevronDown,
  Zap,
  Signal
} from 'lucide-react'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/destinations', label: 'DESTINATIONS', icon: Compass },
    { href: '/help', label: 'SUPPORT', icon: LifeBuoy },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-2'
          : 'py-4'
      }`}
    >
      {/* Animated background */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isScrolled
          ? 'bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--border)]'
          : 'bg-transparent'
      }`}>
        {/* Glow effect when scrolled */}
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Logo container with animated border on hover */}
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center overflow-hidden">
                <Globe className="w-6 h-6 text-white relative z-10" />
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {/* Live indicator */}
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--accent-lime)] border-2 border-[var(--bg)]">
                <span className="absolute inset-0 rounded-full bg-[var(--accent-lime)] animate-ping opacity-75" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gradient">
                ROAMR
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] -mt-1">
                Global eSIM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-4 py-2.5 rounded-xl transition-all duration-300"
              >
                <span className="flex items-center gap-2 text-[var(--text-secondary)] group-hover:text-white transition-colors relative z-10">
                  <link.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </span>
                {/* Hover background */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-[var(--surface)] opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="nav-hover"
                />
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)]">
              <Signal className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
              <span className="text-xs text-[var(--text-muted)]">190+ Countries</span>
            </div>

            {status === 'loading' ? (
              <div className="w-9 h-9 rounded-xl bg-[var(--surface)] animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--surface)] transition-colors border border-transparent hover:border-[var(--border)]"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--primary)] flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {session.user?.name?.[0] || session.user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-[var(--border)]">
                        <p className="text-sm font-medium text-white truncate">
                          {session.user?.name || 'Traveler'}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-light)] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-light)] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-purple)] rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                  <div className="relative px-4 py-2 bg-[var(--primary)] rounded-xl text-sm font-semibold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Get Started
                  </div>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-[var(--surface)] transition-colors border border-transparent hover:border-[var(--border)]"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface)] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}

                {!session && (
                  <div className="pt-4 border-t border-[var(--border)] space-y-2">
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-center rounded-xl border border-[var(--border)] text-white font-medium hover:border-[var(--primary)] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block btn-primary text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
