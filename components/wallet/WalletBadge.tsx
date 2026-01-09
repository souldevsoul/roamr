'use client'

import { useState, useEffect } from 'react'
import { Coins, Plus } from 'lucide-react'
import { WalletDrawer } from './WalletDrawer'

interface WalletBadgeProps {
  className?: string
  showTopupButton?: boolean
  onBalanceChange?: (balance: number) => void
}

export function WalletBadge({ className = '', showTopupButton = true, onBalanceChange }: WalletBadgeProps) {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/wallet')
      if (response.ok) {
        const data = await response.json()
        setBalance(data.balance)
        onBalanceChange?.(data.balance)
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  const handleTopupInitiated = () => {
    // Balance will be updated when user returns from payment
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-5 h-5 rounded bg-[var(--surface-light)] animate-pulse" />
        <div className="w-16 h-5 rounded bg-[var(--surface-light)] animate-pulse" />
      </div>
    )
  }

  if (balance === null) return null

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-colors group ${className}`}
      >
        <Coins className="w-5 h-5 text-[#D4AF37]" />
        <span className="font-bold text-[#D4AF37]">${(balance / 100).toFixed(2)}</span>
        {showTopupButton && (
          <Plus className="w-4 h-4 text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors" />
        )}
      </button>

      <WalletDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentBalance={balance}
        onTopupInitiated={handleTopupInitiated}
      />
    </>
  )
}
