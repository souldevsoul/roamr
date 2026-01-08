'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Lock,
  Check,
  AlertCircle,
  ArrowLeft,
  Mail,
  User,
  Wifi,
  Clock,
  Globe,
  QrCode,
  Zap,
  Shield,
  Smartphone
} from 'lucide-react'

interface Package {
  packageCode: string
  slug: string
  country: string
  countryCode: string
  flag: string
  data: string
  days: number
  price: number
  speed: string
  dataType: string
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()

  const packageCode = searchParams.get('packageCode')
  const slug = searchParams.get('slug')

  const [pkg, setPackage] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1) // 1: Info, 2: Payment
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // Generate stable order number
  const orderNumber = useMemo(() => `ORD-${Date.now().toString().slice(-8)}`, [])

  // Auto-fill for logged in users
  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.email) {
      setEmail(session.user.email)
      setName(session.user.name || '')
      setStep(2) // Skip to payment
    }
  }, [session, sessionStatus])

  // Fetch package details
  useEffect(() => {
    if (!packageCode && !slug) {
      router.push('/destinations')
      return
    }

    async function fetchPackage() {
      try {
        const res = await fetch(`/api/packages/plan?packageCode=${packageCode}&slug=${slug}`)
        const data = await res.json()
        if (data) {
          setPackage(data)
        } else {
          setError('Package not found')
        }
      } catch {
        setError('Failed to load package')
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [packageCode, slug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (step === 1) {
      // Validate email and move to payment
      if (!email) {
        setError('Please enter your email')
        return
      }
      setStep(2)
      return
    }

    // Process payment
    setIsProcessing(true)

    try {
      // Simulate card validation (in production, use Stripe)
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Create order
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageCode: pkg?.packageCode,
          slug,
          promoCode,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Order failed')
      }

      // Redirect to success
      router.push(`/checkout/success?orderId=${data.orderId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const priceUSD = pkg ? pkg.price : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (error && !pkg) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <Link href="/destinations" className="btn-primary">
            Browse Destinations
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href={`/destinations/${slug}`}
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to plans</span>
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-3">
            <div className="card">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border)]">
                <div>
                  <h1 className="text-2xl font-bold text-white">Checkout</h1>
                  <p className="text-sm text-[var(--text-muted)]">Order {orderNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--accent-lime)]" />
                  <span className="text-xs text-[var(--text-muted)]">Secure checkout</span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 1 ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-light)] text-[var(--text-muted)]'
                  }`}>
                    {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <span className="font-medium text-sm hidden sm:inline">Details</span>
                </div>
                <div className="flex-1 h-px bg-[var(--border)]" />
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 2 ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-light)] text-[var(--text-muted)]'
                  }`}>
                    2
                  </div>
                  <span className="font-medium text-sm hidden sm:inline">Payment</span>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                          <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="John Doe"
                            className="input pl-12"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                          <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="input pl-12"
                            required
                          />
                        </div>
                        <p className="mt-2 text-xs text-[var(--text-muted)]">
                          Your eSIM QR code will be sent to this email
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="btn-primary w-full"
                      >
                        Continue to Payment
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="p-4 bg-[var(--surface-light)] rounded-xl">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--text-muted)]">Email</span>
                          <span className="text-white">{email}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                            placeholder="4242 4242 4242 4242"
                            className="input pl-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={e => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="input"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            value={cvc}
                            onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="123"
                            className="input"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          Promo Code (Optional)
                        </label>
                        <input
                          type="text"
                          value={promoCode}
                          onChange={e => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Enter code"
                          className="input"
                        />
                      </div>

                      {/* Payment Icons */}
                      <div className="flex items-center gap-4 py-2">
                        <Image
                          src="/images/visa.png"
                          alt="Visa"
                          width={40}
                          height={25}
                          className="opacity-60"
                        />
                        <Image
                          src="/images/master-card.png"
                          alt="Mastercard"
                          width={40}
                          height={25}
                          className="opacity-60"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isProcessing}
                        className="btn-primary w-full flex items-center justify-center gap-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Pay ${priceUSD.toFixed(2)}</span>
                          </>
                        )}
                      </motion.button>

                      <p className="text-center text-xs text-[var(--text-muted)]">
                        Your payment is secured with 256-bit SSL encryption
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="card sticky top-28">
              {/* Destination Header */}
              {pkg && (
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-2xl">
                    {pkg.flag}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{pkg.country}</h2>
                    <p className="text-sm text-[var(--text-muted)]">eSIM Data Plan</p>
                  </div>
                </div>
              )}

              {/* Plan Details */}
              {pkg && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <Wifi className="w-5 h-5 text-[var(--accent-blue)]" />
                      <span>Data</span>
                    </div>
                    <span className="font-bold text-white">{pkg.data}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <Clock className="w-5 h-5 text-[var(--accent-purple)]" />
                      <span>Validity</span>
                    </div>
                    <span className="font-bold text-white">{pkg.days} Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <Zap className="w-5 h-5 text-[var(--accent-lime)]" />
                      <span>Speed</span>
                    </div>
                    <span className="font-bold text-white">{pkg.speed || '4G/5G'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <QrCode className="w-5 h-5 text-[var(--primary)]" />
                      <span>Delivery</span>
                    </div>
                    <span className="font-bold text-[var(--accent-lime)]">Instant</span>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="pt-6 border-t border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[var(--text-secondary)]">Subtotal</span>
                  <span className="text-white">${priceUSD.toFixed(2)}</span>
                </div>
                {promoCode && (
                  <div className="flex items-center justify-between mb-2 text-[var(--accent-lime)]">
                    <span>Discount</span>
                    <span>-$0.00</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-gradient">${priceUSD.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Shield className="w-4 h-4 text-[var(--accent-lime)]" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Smartphone className="w-4 h-4 text-[var(--accent-blue)]" />
                    <span>Instant Activation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Globe className="w-4 h-4 text-[var(--accent-purple)]" />
                    <span>Global Coverage</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Check className="w-4 h-4 text-[var(--primary)]" />
                    <span>No Hidden Fees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="spinner" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
