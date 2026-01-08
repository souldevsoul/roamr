'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Wifi,
  Clock,
  Zap,
  ShoppingCart,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Signal
} from 'lucide-react'

interface Package {
  packageCode: string
  name: string
  volume: number
  duration: number
  price: number
  priceUSD: number
  description?: string
}

// Country info lookup
const countryInfo: { [key: string]: { name: string; flag: string; region: string } } = {
  'jp': { name: 'Japan', flag: '🇯🇵', region: 'Asia' },
  'th': { name: 'Thailand', flag: '🇹🇭', region: 'Asia' },
  'kr': { name: 'South Korea', flag: '🇰🇷', region: 'Asia' },
  'sg': { name: 'Singapore', flag: '🇸🇬', region: 'Asia' },
  'us': { name: 'United States', flag: '🇺🇸', region: 'Americas' },
  'gb': { name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  'fr': { name: 'France', flag: '🇫🇷', region: 'Europe' },
  'de': { name: 'Germany', flag: '🇩🇪', region: 'Europe' },
  'au': { name: 'Australia', flag: '🇦🇺', region: 'Oceania' },
  'ae': { name: 'UAE', flag: '🇦🇪', region: 'Middle East' },
}

function bytesToGB(bytes: number): number {
  return bytes / (1024 * 1024 * 1024)
}

function formatData(bytes: number): string {
  const gb = bytesToGB(bytes)
  if (gb >= 1) return `${gb}GB`
  return `${Math.round(gb * 1024)}MB`
}

export default function CountryPage() {
  const params = useParams()
  const countryCode = (params.country as string)?.toLowerCase()

  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const country = countryInfo[countryCode] || {
    name: countryCode?.toUpperCase() || 'Unknown',
    flag: '🌍',
    region: 'Global'
  }

  useEffect(() => {
    if (!countryCode) return

    async function fetchPackages() {
      try {
        const res = await fetch(`/api/packages?country=${countryCode.toUpperCase()}`)
        const data = await res.json()

        if (data.plans) {
          // API returns plans with: id, slug, data, days, price, speed, dataType
          const pkgs = data.plans.map((plan: { id: string; slug: string; data: string; days: number; price: number; speed: string }) => ({
            packageCode: plan.id,
            name: plan.slug,
            volume: parseDataToBytes(plan.data),
            duration: plan.days,
            price: plan.price * 10000, // Convert back to API format
            priceUSD: plan.price
          }))
          setPackages(pkgs)
        }
      } catch (err) {
        setError('Failed to load packages')
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [countryCode])

  // Helper to parse data string back to bytes
  function parseDataToBytes(dataStr: string): number {
    const num = parseFloat(dataStr)
    if (dataStr.includes('GB')) return num * 1024 * 1024 * 1024
    if (dataStr.includes('MB')) return num * 1024 * 1024
    return num
  }

  const selectedPackage = packages[selectedIndex]

  const handlePrevious = () => {
    setSelectedIndex(prev => (prev > 0 ? prev - 1 : packages.length - 1))
  }

  const handleNext = () => {
    setSelectedIndex(prev => (prev < packages.length - 1 ? prev + 1 : 0))
  }

  const handlePurchase = () => {
    if (!selectedPackage) return
    // Navigate to checkout with package info
    window.location.href = `/checkout?packageCode=${selectedPackage.packageCode}&slug=${countryCode}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh">
      {/* Immersive Hero */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/20 via-[var(--bg)] to-[var(--bg)]" />

        {/* Large Flag Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[40vw] leading-none">{country.flag}</span>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 pb-8">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Destinations</span>
          </Link>

          <div className="flex items-end gap-6">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="text-8xl md:text-9xl"
            >
              {country.flag}
            </motion.div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="badge-coral mb-2">{country.region}</span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                  {country.name}
                </h1>
                <p className="text-[var(--text-secondary)]">
                  {packages.length} data plans available
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Radial Wheel Plan Selector */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {error ? (
          <div className="text-center py-16">
            <Globe className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Unable to load plans</h3>
            <p className="text-[var(--text-secondary)]">{error}</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No plans available</h3>
            <p className="text-[var(--text-secondary)]">
              Plans for this destination are coming soon
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Wheel Section */}
            <div className="relative">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Select Your Plan</h2>
                <p className="text-[var(--text-secondary)]">
                  Use arrows or swipe to browse plans
                </p>
              </div>

              {/* Wheel Container */}
              <div className="relative h-[400px] flex items-center justify-center">
                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 z-10 w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--primary)] transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 z-10 w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--primary)] transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Plan Cards Carousel */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {packages.map((pkg, index) => {
                      const offset = index - selectedIndex
                      const isSelected = index === selectedIndex

                      // Only show nearby cards
                      if (Math.abs(offset) > 2) return null

                      return (
                        <motion.div
                          key={pkg.packageCode}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: isSelected ? 1 : 0.5,
                            scale: isSelected ? 1 : 0.7,
                            x: offset * 150,
                            zIndex: isSelected ? 10 : 5 - Math.abs(offset),
                            rotateY: offset * -15,
                          }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className="absolute cursor-pointer"
                          onClick={() => setSelectedIndex(index)}
                        >
                          <div
                            className={`card-gradient-border w-64 p-6 ${
                              isSelected ? 'border-[var(--primary)]' : ''
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="badge-lime">Best Value</span>
                              </div>
                            )}

                            <div className="text-center">
                              <div className="text-4xl font-bold text-[var(--primary)] mb-1">
                                {formatData(pkg.volume)}
                              </div>
                              <div className="text-sm text-[var(--text-muted)] mb-4">
                                {pkg.duration} Days
                              </div>

                              <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="flex items-center gap-1.5 text-sm text-[var(--accent-lime)]">
                                  <Wifi className="w-4 h-4" />
                                  <span>4G/5G</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-[var(--accent-blue)]">
                                  <Zap className="w-4 h-4" />
                                  <span>Instant</span>
                                </div>
                              </div>

                              <div className="text-3xl font-bold text-white">
                                ${pkg.priceUSD.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
                  {packages.slice(0, Math.min(packages.length, 10)).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === selectedIndex
                          ? 'bg-[var(--primary)] w-6'
                          : 'bg-[var(--border)] hover:bg-[var(--text-muted)]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Plan Details */}
            <div className="lg:pl-8">
              <AnimatePresence mode="wait">
                {selectedPackage && (
                  <motion.div
                    key={selectedPackage.packageCode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="card bg-[var(--surface)]"
                  >
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border)]">
                      <div>
                        <div className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">
                          Selected Plan
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {formatData(selectedPackage.volume)} / {selectedPackage.duration} Days
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[var(--text-muted)]">Total</div>
                        <div className="text-3xl font-bold text-[var(--primary)]">
                          ${selectedPackage.priceUSD.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--accent-lime)]/20 flex items-center justify-center">
                          <Wifi className="w-5 h-5 text-[var(--accent-lime)]" />
                        </div>
                        <div>
                          <div className="font-medium text-white">High-Speed Data</div>
                          <div className="text-sm text-[var(--text-muted)]">4G LTE / 5G where available</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--accent-blue)]/20 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-[var(--accent-blue)]" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Instant Activation</div>
                          <div className="text-sm text-[var(--text-muted)]">QR code delivery via email</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--accent-purple)]/20 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-[var(--accent-purple)]" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{selectedPackage.duration} Day Validity</div>
                          <div className="text-sm text-[var(--text-muted)]">Starts when you activate</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                          <Signal className="w-5 h-5 text-[var(--primary)]" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Local Networks</div>
                          <div className="text-sm text-[var(--text-muted)]">Best coverage in {country.name}</div>
                        </div>
                      </div>
                    </div>

                    {/* Included Features */}
                    <div className="p-4 bg-[var(--bg)] rounded-xl mb-6">
                      <div className="text-sm font-medium text-white mb-3">Included:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {['Data Only', 'No Contract', 'No Hidden Fees', '24/7 Support'].map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <Check className="w-4 h-4 text-[var(--accent-lime)]" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <motion.button
                      onClick={handlePurchase}
                      disabled={isAddingToCart}
                      className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isAddingToCart ? (
                        <>
                          <div className="spinner w-5 h-5" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          <span>Get This Plan</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
