'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Smartphone, QrCode, Settings, Wifi, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Ensure Device Compatibility',
    description: 'Make sure your device supports eSIM and is carrier-unlocked.',
    tips: [
      'iPhone XS and later models support eSIM',
      'Most Android phones from 2020 onwards have eSIM',
      'Your device must be carrier-unlocked'
    ],
    icon: Smartphone
  },
  {
    number: '02',
    title: 'Find Your QR Code',
    description: 'Locate the eSIM QR code from your purchase confirmation email.',
    tips: [
      'Check your email inbox (and spam folder)',
      'You can also find it in your ROAMR dashboard',
      'Keep the QR code accessible on another device'
    ],
    icon: QrCode
  },
  {
    number: '03',
    title: 'Open Device Settings',
    description: 'Navigate to your cellular or mobile data settings.',
    tips: [
      'iPhone: Settings > Cellular > Add eSIM',
      'Android: Settings > Network > SIM cards > Add eSIM',
      'Some devices may vary slightly'
    ],
    icon: Settings
  },
  {
    number: '04',
    title: 'Scan QR Code',
    description: 'Use your device camera to scan the eSIM QR code.',
    tips: [
      'Position the QR code clearly in view',
      'Ensure good lighting',
      'Wait for the scan to complete automatically'
    ],
    icon: QrCode
  },
  {
    number: '05',
    title: 'Configure Settings',
    description: 'Set up your eSIM as a secondary line for data.',
    tips: [
      'Label it "ROAMR" or your destination name',
      'Enable data roaming for this line',
      'Keep your primary SIM for calls/texts if needed'
    ],
    icon: Settings
  },
  {
    number: '06',
    title: 'Connect & Go',
    description: 'Your eSIM is ready! Connect to local networks at your destination.',
    tips: [
      'The plan activates on first connection',
      'Turn on mobile data when you arrive',
      'Check signal in the status bar'
    ],
    icon: Wifi
  }
]

export default function InstallEsimPage() {
  return (
    <div className="min-h-screen bg-mesh pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/help"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Help</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] mb-6">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            eSIM Installation Guide
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Follow these simple steps to install your ROAMR eSIM
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-[var(--accent-lime)]/10 border-[var(--accent-lime)]/30 mb-8"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[var(--accent-lime)] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-1">Before You Start</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Connect to WiFi for the installation process. Your device must be unlocked and eSIM-compatible.
                Each QR code can only be used once.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="card"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-[var(--primary)]">Step {step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-[var(--text-secondary)] mb-4">{step.description}</p>

                  <div className="space-y-2">
                    {step.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-lime)] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--text-muted)]">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 card bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent-purple)]/20 border-[var(--primary)]/30 text-center"
        >
          <CheckCircle2 className="w-12 h-12 text-[var(--accent-lime)] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Thats it!</h3>
          <p className="text-[var(--text-secondary)] mb-6">
            Your eSIM is now installed. Enjoy seamless connectivity during your travels!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary flex items-center gap-2">
              Go to Dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/help" className="btn-secondary">
              More Help Topics
            </Link>
          </div>
        </motion.div>

        {/* Troubleshooting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <p className="text-[var(--text-muted)] mb-2">Having trouble?</p>
          <Link href="/help#faq" className="text-[var(--primary)] hover:underline">
            Check our FAQ or contact support
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
