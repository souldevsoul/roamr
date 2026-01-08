'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Globe, ArrowRight, X, ChevronRight, Wifi, Zap } from 'lucide-react'

interface Country {
  code: string
  name: string
  flag: string
  region: string
  startPrice: number
  networks: string[]
}

const regions = ['All', 'Asia', 'Europe', 'Americas', 'Oceania', 'Middle East', 'Africa']

const countries: Country[] = [
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia', startPrice: 4.99, networks: ['NTT Docomo', 'au', 'SoftBank'] },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia', startPrice: 3.99, networks: ['AIS', 'DTAC', 'True Move'] },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia', startPrice: 4.99, networks: ['SK Telecom', 'KT', 'LG U+'] },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia', startPrice: 3.99, networks: ['Singtel', 'StarHub', 'M1'] },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'Asia', startPrice: 3.49, networks: ['Maxis', 'Celcom', 'Digi'] },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia', startPrice: 3.49, networks: ['Telkomsel', 'XL', 'Indosat'] },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia', startPrice: 2.99, networks: ['Viettel', 'Vinaphone', 'Mobifone'] },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'Asia', startPrice: 3.49, networks: ['Globe', 'Smart', 'DITO'] },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia', startPrice: 5.99, networks: ['China Mobile', 'China Unicom', 'China Telecom'] },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia', startPrice: 3.99, networks: ['CSL', 'PCCW', 'SmarTone'] },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', region: 'Asia', startPrice: 4.49, networks: ['Chunghwa', 'Taiwan Mobile', 'FarEasTone'] },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia', startPrice: 2.99, networks: ['Jio', 'Airtel', 'Vi'] },
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'Americas', startPrice: 5.99, networks: ['T-Mobile', 'AT&T', 'Verizon'] },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'Americas', startPrice: 5.99, networks: ['Rogers', 'Bell', 'Telus'] },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'Americas', startPrice: 4.49, networks: ['Telcel', 'AT&T', 'Movistar'] },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'Americas', startPrice: 4.99, networks: ['Vivo', 'Claro', 'TIM'] },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', startPrice: 4.49, networks: ['EE', 'Three', 'Vodafone'] },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe', startPrice: 4.49, networks: ['Orange', 'SFR', 'Bouygues'] },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe', startPrice: 4.49, networks: ['Deutsche Telekom', 'Vodafone', 'O2'] },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe', startPrice: 4.49, networks: ['Movistar', 'Orange', 'Vodafone'] },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe', startPrice: 4.49, networks: ['TIM', 'Vodafone', 'Wind Tre'] },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', startPrice: 4.49, networks: ['KPN', 'T-Mobile', 'Vodafone'] },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', startPrice: 5.99, networks: ['Swisscom', 'Sunrise', 'Salt'] },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europe', startPrice: 4.49, networks: ['A1', 'Magenta', 'Drei'] },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europe', startPrice: 4.49, networks: ['MEO', 'NOS', 'Vodafone'] },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'Europe', startPrice: 4.49, networks: ['Cosmote', 'Vodafone', 'Wind'] },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'Europe', startPrice: 4.99, networks: ['Telia', 'Tele2', 'Tre'] },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'Europe', startPrice: 5.49, networks: ['Telenor', 'Telia', 'Ice'] },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', region: 'Europe', startPrice: 4.99, networks: ['TDC', 'Telenor', 'Tre'] },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'Europe', startPrice: 4.99, networks: ['Elisa', 'DNA', 'Telia'] },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceania', startPrice: 5.99, networks: ['Telstra', 'Optus', 'Vodafone'] },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania', startPrice: 5.49, networks: ['Spark', 'Vodafone', '2degrees'] },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', region: 'Middle East', startPrice: 5.99, networks: ['Etisalat', 'du'] },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', startPrice: 5.99, networks: ['STC', 'Mobily', 'Zain'] },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'Middle East', startPrice: 4.99, networks: ['Cellcom', 'Partner', 'Pelephone'] },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'Europe', startPrice: 4.49, networks: ['Turkcell', 'Vodafone', 'Turk Telekom'] },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa', startPrice: 4.99, networks: ['Vodacom', 'MTN', 'Cell C'] },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Africa', startPrice: 3.99, networks: ['Vodafone', 'Orange', 'Etisalat'] },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'Africa', startPrice: 4.49, networks: ['Maroc Telecom', 'Orange', 'Inwi'] },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Africa', startPrice: 4.49, networks: ['Safaricom', 'Airtel', 'Telkom'] },
]

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null)

  // Filter countries
  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           country.code.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRegion = selectedRegion === 'All' || country.region === selectedRegion
      return matchesSearch && matchesRegion
    })
  }, [searchQuery, selectedRegion])

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-20">
      {/* Spotlight Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-xl bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search destinations..."
                    className="flex-1 bg-transparent outline-none text-white text-lg placeholder:text-[var(--text-muted)]"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 text-xs bg-[var(--bg)] rounded border border-[var(--border)] text-[var(--text-muted)]">
                    ESC
                  </kbd>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filteredCountries.slice(0, 8).map(country => (
                  <Link
                    key={country.code}
                    href={`/destinations/${country.code.toLowerCase()}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--surface-light)] transition-colors"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium text-white">{country.name}</div>
                      <div className="text-sm text-[var(--text-muted)]">{country.region}</div>
                    </div>
                    <div className="text-[var(--primary)] font-bold">From ${country.startPrice}</div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  </Link>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="p-8 text-center text-[var(--text-muted)]">
                    No destinations found
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="text-gradient">Explore</span> Destinations
              </h1>
              <p className="text-[var(--text-secondary)]">
                190+ countries with instant eSIM activation
              </p>
            </div>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 px-4 py-3 bg-[var(--bg)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors group w-full md:w-80"
            >
              <Search className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
              <span className="flex-1 text-left text-[var(--text-muted)]">Search destinations...</span>
              <kbd className="px-2 py-1 text-xs bg-[var(--surface)] rounded border border-[var(--border)] text-[var(--text-muted)]">
                ⌘K
              </kbd>
            </button>
          </motion.div>

          {/* Region Filters - Orbital Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedRegion === region
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--bg)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)] hover:border-[var(--primary)]'
                }`}
              >
                {region}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Country Grid */}
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredCountries.map((country, index) => (
                  <motion.div
                    key={country.code}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.02 }}
                    layout
                  >
                    <Link
                      href={`/destinations/${country.code.toLowerCase()}`}
                      className="card block group hover:border-[var(--primary)]"
                      onMouseEnter={() => setHoveredCountry(country)}
                      onMouseLeave={() => setHoveredCountry(null)}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{country.flag}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white group-hover:text-[var(--primary)] transition-colors truncate">
                            {country.name}
                          </h3>
                          <p className="text-sm text-[var(--text-muted)]">{country.region}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-[var(--text-muted)]">From</span>
                            <span className="text-lg font-bold text-[var(--primary)]">
                              ${country.startPrice}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredCountries.length === 0 && (
              <div className="text-center py-16">
                <Globe className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No destinations found</h3>
                <p className="text-[var(--text-secondary)]">
                  Try adjusting your search or filter
                </p>
              </div>
            )}
          </div>

          {/* Live Feed Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-28">
              {/* Preview Card */}
              <motion.div
                className="card mb-6 overflow-hidden"
                animate={{
                  borderColor: hoveredCountry ? 'var(--primary)' : 'var(--border)'
                }}
              >
                <AnimatePresence mode="wait">
                  {hoveredCountry ? (
                    <motion.div
                      key={hoveredCountry.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-6xl">{hoveredCountry.flag}</span>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{hoveredCountry.name}</h3>
                          <span className="badge-coral">{hoveredCountry.region}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                            Starting Price
                          </div>
                          <div className="text-3xl font-bold text-[var(--primary)]">
                            ${hoveredCountry.startPrice}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                            Available Networks
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {hoveredCountry.networks.map(network => (
                              <span
                                key={network}
                                className="px-3 py-1 bg-[var(--bg)] rounded-lg text-sm text-[var(--text-secondary)]"
                              >
                                {network}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <div className="flex items-center gap-2 text-sm text-[var(--accent-lime)]">
                            <Wifi className="w-4 h-4" />
                            <span>4G/5G</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--accent-blue)]">
                            <Zap className="w-4 h-4" />
                            <span>Instant</span>
                          </div>
                        </div>

                        <Link
                          href={`/destinations/${hoveredCountry.code.toLowerCase()}`}
                          className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                        >
                          View Plans
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <Globe className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4 animate-float" />
                      <h3 className="text-lg font-bold text-white mb-2">Hover to Preview</h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Hover over a country to see details
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Stats Card */}
              <div className="card bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent-purple)]/10 border-[var(--primary)]/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-[var(--bg)]/50 rounded-xl">
                    <div className="text-3xl font-bold text-[var(--primary)]">190+</div>
                    <div className="text-sm text-[var(--text-muted)]">Countries</div>
                  </div>
                  <div className="text-center p-4 bg-[var(--bg)]/50 rounded-xl">
                    <div className="text-3xl font-bold text-[var(--accent-lime)]">500+</div>
                    <div className="text-sm text-[var(--text-muted)]">Networks</div>
                  </div>
                  <div className="text-center p-4 bg-[var(--bg)]/50 rounded-xl">
                    <div className="text-3xl font-bold text-[var(--accent-blue)]">4G/5G</div>
                    <div className="text-sm text-[var(--text-muted)]">Speed</div>
                  </div>
                  <div className="text-center p-4 bg-[var(--bg)]/50 rounded-xl">
                    <div className="text-3xl font-bold text-[var(--accent-purple)]">24/7</div>
                    <div className="text-sm text-[var(--text-muted)]">Support</div>
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
