'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Calendar,
  Globe,
  Wifi,
  Clock,
  QrCode,
  X,
  Download,
  Copy,
  Check,
  Plane,
  ChevronRight,
  AlertCircle
} from 'lucide-react'

interface ESim {
  id: string
  iccid: string
  qrCode: string
  activationCode: string
  status: string
  dataUsed: string
  dataLimit: string
  expiresAt: string
  country: string
  countryName: string
  planName: string
  createdAt: string
}

interface Order {
  id: string
  status: string
  total: number
  country: string
  countryName: string
  planName: string
  createdAt: string
  esim: ESim | null
}

// Country stamp component
function CountryStamp({ country, countryName, date }: { country: string; countryName: string; date: string }) {
  const colors = ['text-[var(--primary)]', 'text-[var(--accent-blue)]', 'text-[var(--accent-purple)]', 'text-[var(--accent-lime)]']
  const color = colors[countryName.length % colors.length]

  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: Math.random() * 10 - 5 }}
      className={`stamp ${color} text-center`}
    >
      <div className="text-2xl mb-1">{getFlagEmoji(country)}</div>
      <div className="text-xs font-bold uppercase tracking-wider">{countryName}</div>
      <div className="text-[10px] opacity-70">{new Date(date).toLocaleDateString()}</div>
    </motion.div>
  )
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEsim, setSelectedEsim] = useState<ESim | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : [])
      } catch {
        // Handle error silently
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchOrders()
    }
  }, [session])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeEsims = orders.filter(o => o.esim && o.esim.status !== 'EXPIRED')
  const visitedCountries = [...new Set(orders.filter(o => o.esim).map(o => o.country))]

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading your passport...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-mesh pt-24 pb-12 px-4">
      {/* QR Modal */}
      <AnimatePresence>
        {selectedEsim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedEsim(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[var(--surface)] rounded-2xl p-8 max-w-md w-full border border-[var(--border)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Your eSIM</h3>
                <button
                  onClick={() => setSelectedEsim(null)}
                  className="p-2 hover:bg-[var(--bg)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center">
                {selectedEsim.qrCode ? (
                  <div className="inline-block p-6 bg-white rounded-2xl mb-6">
                    <Image
                      src={selectedEsim.qrCode}
                      alt="eSIM QR Code"
                      width={200}
                      height={200}
                    />
                  </div>
                ) : (
                  <div className="w-52 h-52 bg-[var(--bg)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <QrCode className="w-24 h-24 text-[var(--text-muted)]" />
                  </div>
                )}

                <h4 className="text-lg font-bold text-white mb-1">
                  {selectedEsim.countryName}
                </h4>
                <p className="text-[var(--text-secondary)] mb-4">
                  {selectedEsim.planName}
                </p>

                {selectedEsim.activationCode && (
                  <div className="p-4 bg-[var(--bg)] rounded-xl mb-4">
                    <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      Activation Code
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <code className="text-sm text-white font-mono truncate flex-1">
                        {selectedEsim.activationCode}
                      </code>
                      <button
                        onClick={() => handleCopy(selectedEsim.activationCode)}
                        className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-[var(--accent-lime)]" />
                        ) : (
                          <Copy className="w-5 h-5 text-[var(--text-muted)]" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <button className="w-full btn-primary flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  <span>Download QR Code</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Passport Book Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-gradient">Travel</span> Journal
          </h1>
          <p className="text-[var(--text-secondary)]">
            Your digital passport and eSIM collection
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Passport Page (Profile) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="passport-cover p-6 gold-emboss">
              {/* Passport Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70">
                  Digital Passport
                </div>
                <div className="text-lg font-bold text-[#D4AF37]">ROAMR</div>
              </div>

              {/* User Info */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#D4AF37]/60" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]/60">Name</div>
                    <div className="font-medium text-white">{session.user?.name || 'Traveler'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#D4AF37]/60" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]/60">Email</div>
                    <div className="font-medium text-white truncate">{session.user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#D4AF37]/60" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]/60">Member Since</div>
                    <div className="font-medium text-white">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#D4AF37]/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37]">{visitedCountries.length}</div>
                  <div className="text-xs text-[#D4AF37]/60 uppercase tracking-wider">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37]">{orders.length}</div>
                  <div className="text-xs text-[#D4AF37]/60 uppercase tracking-wider">eSIMs</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-3">
              <Link
                href="/destinations"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Plane className="w-5 h-5" />
                <span>Get New eSIM</span>
              </Link>
              <Link
                href="/help/install-esim"
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <span>Installation Guide</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Stamps & eSIMs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Country Stamps */}
            {visitedCountries.length > 0 && (
              <div className="card mb-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[var(--primary)]" />
                  Your Stamps
                </h3>
                <div className="flex flex-wrap gap-4">
                  {orders.filter(o => o.esim).map((order) => (
                    <CountryStamp
                      key={order.id}
                      country={order.country}
                      countryName={order.countryName}
                      date={order.createdAt}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Active eSIMs */}
            <div className="card mb-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-[var(--accent-lime)]" />
                Active eSIMs
              </h3>

              {activeEsims.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[var(--surface-light)] flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-[var(--text-muted)]" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">No active eSIMs</h4>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Get your first eSIM and start traveling connected
                  </p>
                  <Link href="/destinations" className="btn-primary">
                    Browse Destinations
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeEsims.map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 bg-[var(--bg)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer"
                      onClick={() => order.esim && setSelectedEsim(order.esim)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{getFlagEmoji(order.country)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white">{order.countryName}</h4>
                            <span className={`badge ${
                              order.esim?.status === 'ACTIVE' ? 'badge-lime' :
                              order.esim?.status === 'INACTIVE' ? 'badge-blue' :
                              'badge-coral'
                            }`}>
                              {order.esim?.status || 'UNKNOWN'}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-muted)]">{order.planName}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
                            <Clock className="w-4 h-4" />
                            <span>
                              {order.esim?.expiresAt
                                ? new Date(order.esim.expiresAt).toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <QrCode className="w-5 h-5 text-[var(--text-muted)]" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Order History */}
            <div className="card">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--accent-blue)]" />
                Order History
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-6 text-[var(--text-muted)]">
                  No orders yet
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-[var(--bg)] rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getFlagEmoji(order.country)}</span>
                        <div>
                          <div className="font-medium text-white">{order.countryName}</div>
                          <div className="text-xs text-[var(--text-muted)]">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">
                          ${(order.total / 100).toFixed(2)}
                        </div>
                        <span className={`text-xs ${
                          order.status === 'COMPLETED' ? 'text-[var(--accent-lime)]' :
                          order.status === 'PENDING' ? 'text-[var(--accent-blue)]' :
                          'text-red-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
