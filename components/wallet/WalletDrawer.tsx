'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Coins,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Plane,
  Shield
} from 'lucide-react'

interface WalletDrawerProps {
  isOpen: boolean
  onClose: () => void
  currentBalance: number // In cents
  minimumRequired?: number // In cents, for checkout flow
  onTopupInitiated?: () => void
}

// Quick top-up amounts as "travel fund" tiers
const FUND_TIERS = [
  { amount: 10, label: '$10', tier: 'Day Trip' },
  { amount: 25, label: '$25', tier: 'Weekend' },
  { amount: 50, label: '$50', tier: 'Explorer', popular: true },
  { amount: 100, label: '$100', tier: 'Adventurer' },
  { amount: 200, label: '$200', tier: 'Globetrotter' },
]

export function WalletDrawer({
  isOpen,
  onClose,
  currentBalance,
  minimumRequired,
  onTopupInitiated,
}: WalletDrawerProps) {
  const [step, setStep] = useState<'select' | 'custom' | 'confirm'>('select')
  const [selectedAmount, setSelectedAmount] = useState<number>(50)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shortfall = minimumRequired ? Math.max(0, minimumRequired - currentBalance) : 0

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('select')
      setError(null)
      setCustomAmount('')
      // Auto-select tier that covers shortfall
      if (shortfall > 0) {
        const minTier = FUND_TIERS.find(t => t.amount * 100 >= shortfall)
        if (minTier) setSelectedAmount(minTier.amount)
      }
    }
  }, [isOpen, shortfall])

  const getTopupAmount = () => {
    return step === 'custom' ? (parseFloat(customAmount) || 0) : selectedAmount
  }

  const handleTopup = async () => {
    const amount = getTopupAmount()

    if (amount < 1 || amount > 2000) {
      setError('Amount must be between $1 and $2,000')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate top-up')
      }

      onTopupInitiated?.()

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  const handleTierSelect = (amount: number) => {
    setSelectedAmount(amount)
    setStep('confirm')
  }

  const handleCustomClick = () => {
    setStep('custom')
  }

  const handleCustomSubmit = () => {
    const amount = parseFloat(customAmount)
    if (amount >= 1 && amount <= 2000) {
      setSelectedAmount(amount)
      setStep('confirm')
    } else {
      setError('Amount must be between $1 and $2,000')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer - slides in from right */}
      <motion.div
        key="drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header with balance */}
        <div className="relative bg-gradient-to-br from-[#008080] to-[#006666] p-6 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/30 flex items-center justify-center">
              <Coins className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Travel Fund</h2>
              <p className="text-white/80 text-sm">Add credits for your adventures</p>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#D4AF37]">${(currentBalance / 100).toFixed(2)}</span>
            <span className="text-white/70">available</span>
          </div>

          {shortfall > 0 && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10">
              <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-white">
                Add <strong>${(shortfall / 100).toFixed(2)}</strong> or more for this eSIM
              </span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Step: Select Amount */}
          {step === 'select' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-[var(--primary)]" />
                Choose Your Travel Fund
              </h3>

              <div className="space-y-3">
                {FUND_TIERS.map((tier) => (
                  <motion.button
                    key={tier.amount}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTierSelect(tier.amount)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left relative ${
                      tier.popular
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-[var(--border)] hover:border-[var(--primary)]'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-2 right-3 px-2 py-0.5 bg-[#D4AF37] text-black text-xs font-bold rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        POPULAR
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-white">{tier.label}</div>
                        <div className="text-sm text-[var(--text-muted)]">{tier.tier}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={handleCustomClick}
                className="w-full mt-4 p-3 rounded-xl border border-dashed border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-white transition-colors"
              >
                Enter custom amount
              </button>
            </motion.div>
          )}

          {/* Step: Custom Amount */}
          {step === 'custom' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => setStep('select')}
                className="mb-4 text-sm text-[var(--text-muted)] hover:text-white flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to tiers
              </button>

              <h3 className="text-lg font-bold text-white mb-4">Custom Amount</h3>

              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#D4AF37] font-bold">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  max="2000"
                  className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#D4AF37]"
                  autoFocus
                />
              </div>

              <p className="text-sm text-[var(--text-muted)] mb-4">
                Min: $1.00 | Max: $2,000.00
              </p>

              <button
                onClick={handleCustomSubmit}
                disabled={!customAmount || parseFloat(customAmount) < 1}
                className="w-full py-4 rounded-xl bg-[#D4AF37] text-black font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#B8962F] transition-colors"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step: Confirm */}
          {step === 'confirm' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => setStep('select')}
                className="mb-4 text-sm text-[var(--text-muted)] hover:text-white flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Change amount
              </button>

              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Adding to Travel Fund</h3>
                <div className="text-4xl font-bold text-[#D4AF37]">
                  ${getTopupAmount().toFixed(2)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-muted)]">Current Balance</span>
                  <span className="text-white">${(currentBalance / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-muted)]">Adding</span>
                  <span className="text-[var(--accent-lime)]">+${getTopupAmount().toFixed(2)}</span>
                </div>
                <div className="border-t border-[var(--border)] pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-white">New Balance</span>
                  <span className="font-bold text-[#D4AF37]">
                    ${((currentBalance / 100) + getTopupAmount()).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#008080]/10 border border-[#008080]/20 mb-6">
                <Shield className="w-5 h-5 text-[#008080] mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-white mb-1">Secure Payment</p>
                  <p className="text-[var(--text-muted)]">
                    You&apos;ll be redirected to our secure payment partner. Funds are added instantly after payment.
                  </p>
                </div>
              </div>

              <button
                onClick={handleTopup}
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#008080] to-[#006666] text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay ${getTopupAmount().toFixed(2)}
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
