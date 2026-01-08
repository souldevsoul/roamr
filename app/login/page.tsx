'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Plane, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Globe } from 'lucide-react'

// Flip clock character component
function FlipChar({ char, delay = 0 }: { char: string; delay?: number }) {
  return (
    <motion.div
      className="flip-number text-2xl md:text-3xl min-w-[1.5rem] text-center"
      initial={{ rotateX: 90 }}
      animate={{ rotateX: 0 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
    >
      {char}
    </motion.div>
  )
}

// Departure board style header
function DepartureBoard({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {text.split('').map((char, i) => (
        <FlipChar key={i} char={char} delay={i * 0.05} />
      ))}
    </div>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push(callbackUrl)
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Gate Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-[var(--accent-lime)] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
              Now Boarding
            </span>
          </div>
          <DepartureBoard text="GATE A1" />
          <h1 className="text-2xl font-bold text-white mb-2">Member Login</h1>
          <p className="text-[var(--text-secondary)]">
            Access your travel dashboard
          </p>
        </motion.div>

        {/* Login Card - styled as boarding terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-[var(--surface)] border-[var(--border)]"
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                  Destination
                </div>
                <div className="font-bold text-white">ROAMR Dashboard</div>
              </div>
            </div>
            <Plane className="w-6 h-6 text-[var(--primary)]" />
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Passenger Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input pl-12"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Boarding Pass Code
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5" />
                  <span>Boarding...</span>
                </>
              ) : (
                <>
                  <span>Board Flight</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[var(--surface)] px-4 text-sm text-[var(--text-muted)]">
                or
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-[var(--text-secondary)] mb-3">
              New to ROAMR?
            </p>
            <Link
              href="/register"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <span>Create Account</span>
              <Plane className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Bottom Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-[var(--text-muted)] mt-6"
        >
          By signing in, you agree to our{' '}
          <Link href="/legal/terms" className="text-[var(--primary)] hover:underline">
            Terms of Service
          </Link>
        </motion.p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="spinner" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
