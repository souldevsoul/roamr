'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Book,
  HelpCircle,
  Smartphone,
  QrCode,
  Globe,
  CreditCard,
  Shield,
  ChevronDown,
  Search,
  Mail,
  MessageCircle,
  ArrowRight,
  Wifi,
  RefreshCw
} from 'lucide-react'

const faqs = [
  {
    category: 'Getting Started',
    icon: Globe,
    questions: [
      {
        q: 'What is an eSIM?',
        a: 'An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan without using a physical SIM card. Its built directly into your device and can be programmed with multiple carrier profiles.'
      },
      {
        q: 'Is my device eSIM compatible?',
        a: 'Most modern smartphones support eSIM, including iPhone XS and later, Google Pixel 3 and later, Samsung Galaxy S20 and later, and many other devices. Check your device settings or contact your manufacturer to confirm compatibility.'
      },
      {
        q: 'How do I check if my phone is unlocked?',
        a: 'Your phone must be carrier-unlocked to use ROAMR eSIM. Go to Settings > General > About and look for "Carrier Lock" or contact your carrier to verify your unlock status.'
      }
    ]
  },
  {
    category: 'Installation',
    icon: QrCode,
    questions: [
      {
        q: 'How do I install my eSIM?',
        a: 'After purchase, youll receive a QR code via email. On your device, go to Settings > Cellular/Mobile > Add eSIM > Scan QR Code. Point your camera at the QR code to complete installation.'
      },
      {
        q: 'When should I install my eSIM?',
        a: 'You can install your eSIM before or during your trip. We recommend installing it before departure while connected to WiFi. The plan activates when you first connect to a network at your destination.'
      },
      {
        q: 'Can I install the eSIM multiple times?',
        a: 'No, each QR code can only be used once. If you accidentally delete your eSIM before using it, please contact our support team.'
      }
    ]
  },
  {
    category: 'Usage & Data',
    icon: Wifi,
    questions: [
      {
        q: 'How do I check my remaining data?',
        a: 'Go to your ROAMR dashboard to view real-time data usage and remaining balance. You can also check your devices cellular settings to see data consumed.'
      },
      {
        q: 'What happens when my data runs out?',
        a: 'When your data allowance is depleted, your connection will stop. You can purchase additional data or a new plan through our app or website.'
      },
      {
        q: 'Can I make calls with ROAMR eSIM?',
        a: 'ROAMR provides data-only eSIMs. You can make calls using VoIP apps like WhatsApp, Skype, or FaceTime over your data connection.'
      }
    ]
  },
  {
    category: 'Payment & Refunds',
    icon: CreditCard,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards including Visa, Mastercard, and American Express. All payments are processed securely.'
      },
      {
        q: 'Can I get a refund?',
        a: 'Yes, we offer refunds for unused eSIMs within 30 days of purchase. Once the eSIM has been installed or activated, it becomes non-refundable. See our refund policy for details.'
      },
      {
        q: 'Is my payment secure?',
        a: 'Absolutely. We use industry-standard 256-bit SSL encryption and never store your full card details. All transactions are processed through secure payment providers.'
      }
    ]
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-mesh pt-24 pb-12">
      {/* Hero */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg)] border border-[var(--border)] mb-6">
              <Book className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm text-[var(--text-secondary)]">Help Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we <span className="text-gradient">help</span>?
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto mb-8">
              Find answers to common questions about ROAMR eSIM
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="input pl-12 w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link href="/help/install-esim" className="card group hover:border-[var(--primary)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <h3 className="font-bold text-white mb-1">Installation Guide</h3>
            <p className="text-sm text-[var(--text-muted)]">Step-by-step setup</p>
          </Link>

          <Link href="/destinations" className="card group hover:border-[var(--accent-blue)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-blue)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-[var(--accent-blue)]" />
            </div>
            <h3 className="font-bold text-white mb-1">Coverage Map</h3>
            <p className="text-sm text-[var(--text-muted)]">190+ countries</p>
          </Link>

          <Link href="/legal/refund" className="card group hover:border-[var(--accent-purple)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-purple)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-6 h-6 text-[var(--accent-purple)]" />
            </div>
            <h3 className="font-bold text-white mb-1">Refund Policy</h3>
            <p className="text-sm text-[var(--text-muted)]">Easy returns</p>
          </Link>

          <div className="card group hover:border-[var(--accent-lime)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-lime)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-[var(--accent-lime)]" />
            </div>
            <h3 className="font-bold text-white mb-1">24/7 Support</h3>
            <p className="text-sm text-[var(--text-muted)]">Were here to help</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8" id="faq">
          {filteredFaqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <h2 className="text-xl font-bold text-white">{category.category}</h2>
              </div>

              <div className="space-y-3">
                {category.questions.map((faq, index) => {
                  const key = `${category.category}-${index}`
                  const isOpen = openFaq === key

                  return (
                    <motion.div
                      key={key}
                      className="card overflow-hidden"
                      layout
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : key)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="font-medium text-white pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-[var(--text-muted)] transition-transform flex-shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-[var(--text-secondary)] mt-4 pt-4 border-t border-[var(--border)]">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Our support team is available 24/7 to assist you
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:support@roamr.co"
              className="btn-primary flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              <span>Email Support</span>
            </a>
            <button className="btn-secondary flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>Live Chat</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
