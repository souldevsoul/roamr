'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CheckCircle2, Plane, Mail, QrCode, Download, Copy, Check, ArrowRight } from 'lucide-react'

interface OrderData {
  id: string
  status: string
  country: string
  countryName: string
  planName: string
  total: number
  esim?: {
    qrCode: string
    activationCode: string
    iccid: string
  }
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!orderId) return

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders?id=${orderId}`)
        const data = await res.json()
        setOrder(data)
      } catch {
        // Handle error silently
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading your eSIM...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="w-24 h-24 rounded-full bg-[var(--accent-lime)] flex items-center justify-center mx-auto mb-6"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <CheckCircle2 className="w-12 h-12 text-[var(--bg)]" />
            </motion.div>
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-2">Boarding Complete!</h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Your eSIM is ready for takeoff
          </p>
        </motion.div>

        {/* QR Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-[var(--surface)] mb-6"
        >
          <div className="text-center">
            {order?.esim?.qrCode ? (
              <div className="inline-block p-6 bg-white rounded-2xl mb-6">
                <Image
                  src={order.esim.qrCode}
                  alt="eSIM QR Code"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
            ) : (
              <div className="w-52 h-52 bg-[var(--bg)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-24 h-24 text-[var(--text-muted)]" />
              </div>
            )}

            <h2 className="text-2xl font-bold text-white mb-2">
              {order?.countryName || 'Your'} eSIM
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              {order?.planName || 'Data Plan'}
            </p>

            {order?.esim?.activationCode && (
              <div className="p-4 bg-[var(--bg)] rounded-xl mb-4">
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Activation Code
                </div>
                <div className="flex items-center justify-between gap-4">
                  <code className="text-sm text-white font-mono truncate flex-1">
                    {order.esim.activationCode}
                  </code>
                  <button
                    onClick={() => handleCopy(order.esim!.activationCode)}
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

            <div className="flex gap-3">
              <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                <span>Download QR</span>
              </button>
              <Link
                href="/help/install-esim"
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <span>How to Install</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-[var(--surface)]"
        >
          <h3 className="font-bold text-white mb-4">Order Details</h3>

          <div className="space-y-3 pb-4 border-b border-[var(--border)]">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Order ID</span>
              <span className="font-mono text-white">{orderId?.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Status</span>
              <span className="badge-lime">{order?.status || 'COMPLETED'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Total Paid</span>
              <span className="font-bold text-[var(--primary)]">
                ${((order?.total || 0) / 100).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-start gap-3">
            <Mail className="w-5 h-5 text-[var(--accent-blue)] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[var(--text-secondary)]">
              A confirmation email with your eSIM details has been sent to your email address.
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/dashboard"
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Plane className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </Link>
          <Link
            href="/destinations"
            className="flex-1 btn-secondary flex items-center justify-center gap-2"
          >
            <span>Browse More Plans</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="spinner" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
