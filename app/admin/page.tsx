'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Wallet,
  Settings,
  TrendingUp,
  Download,
  Search,
  ChevronRight,
  X,
  Coins,
  Globe,
  Activity,
  FileText
} from 'lucide-react'

interface Stats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  activeEsims: number
  todayOrders: number
  todayRevenue: number
}

interface SettingsData {
  id: string
  businessName: string
  businessAddress: string
  businessEmail: string
  businessPhone: string
  businessVAT: string
  invoicePrefix: string
  invoiceFooter: string
  telegramBotToken: string | null
  telegramChatId: string | null
}

interface User {
  id: string
  email: string
  name: string | null
  role: string
  credits: number
  createdAt: string
  _count: {
    orders: number
    esims: number
    walletTransactions: number
  }
}

interface Order {
  id: string
  status: string
  total: number
  country: string
  countryName: string
  planName: string
  createdAt: string
  user: {
    email: string
    name: string | null
  }
}

type Section = 'overview' | 'users' | 'orders' | 'settings'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, usersRes, ordersRes, settingsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/users'),
          fetch('/api/admin/orders'),
          fetch('/api/admin/settings'),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json()
          setUsers(Array.isArray(usersData) ? usersData : [])
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          setOrders(Array.isArray(ordersData) ? ordersData : [])
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          setSettings(settingsData)
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchData()
    }
  }, [session])

  const handleSaveSettings = async () => {
    if (!settings) return
    setSettingsSaving(true)
    setSettingsMessage('')

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        const updatedSettings = await res.json()
        setSettings(updatedSettings)
        setSettingsMessage('Settings saved successfully!')
      } else {
        setSettingsMessage('Failed to save settings')
      }
    } catch {
      setSettingsMessage('Failed to save settings')
    } finally {
      setSettingsSaving(false)
      setTimeout(() => setSettingsMessage(''), 3000)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOrders = orders.filter(
    (o) =>
      o.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const downloadWalletStatement = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/wallet-statement`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `wallet-statement-${userId}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to download wallet statement:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const navItems = [
    { id: 'overview' as Section, label: 'Overview', icon: LayoutDashboard },
    { id: 'users' as Section, label: 'Users', icon: Users },
    { id: 'orders' as Section, label: 'Orders', icon: ShoppingBag },
    { id: 'settings' as Section, label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008080] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white">Roamr</div>
              <div className="text-xs text-[var(--text-muted)]">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#008080] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-light)] hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--text-muted)]">
            Logged in as
          </div>
          <div className="text-sm text-white truncate">{session.user?.email}</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[var(--bg)]/80 backdrop-blur-sm border-b border-[var(--border)] px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white capitalize">{activeSection}</h1>
            {(activeSection === 'users' || activeSection === 'orders') && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#008080]"
                />
              </div>
            )}
          </div>
        </header>

        <div className="p-8">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#008080] to-[#006666] text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                  <div className="text-sm opacity-80">Total Users</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                    <span className="text-xs text-[var(--accent-lime)]">+{stats?.todayOrders || 0} today</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats?.totalOrders || 0}</div>
                  <div className="text-sm text-[var(--text-muted)]">Total Orders</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Coins className="w-8 h-8 text-[#D4AF37]" />
                    <span className="text-xs text-[var(--accent-lime)]">+${((stats?.todayRevenue || 0) / 100).toFixed(0)} today</span>
                  </div>
                  <div className="text-3xl font-bold text-white">${((stats?.totalRevenue || 0) / 100).toFixed(0)}</div>
                  <div className="text-sm text-[var(--text-muted)]">Total Revenue</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-8 h-8 text-[var(--accent-lime)]" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats?.activeEsims || 0}</div>
                  <div className="text-sm text-[var(--text-muted)]">Active eSIMs</div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#008080]" />
                    Recent Users
                  </h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)]">
                        <div>
                          <div className="font-medium text-white">{user.name || 'Anonymous'}</div>
                          <div className="text-sm text-[var(--text-muted)]">{user.email}</div>
                        </div>
                        <div className="text-sm text-[var(--text-muted)]">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                    Recent Orders
                  </h3>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)]">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getFlagEmoji(order.country)}</span>
                          <div>
                            <div className="font-medium text-white">{order.countryName}</div>
                            <div className="text-sm text-[var(--text-muted)]">{order.user.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">${(order.total / 100).toFixed(2)}</div>
                          <div className={`text-xs ${
                            order.status === 'COMPLETED' ? 'text-[var(--accent-lime)]' : 'text-[var(--text-muted)]'
                          }`}>{order.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[#008080] transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#008080]/20 flex items-center justify-center text-lg font-bold text-[#008080]">
                        {(user.name || user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name || 'Anonymous'}</div>
                        <div className="text-sm text-[var(--text-muted)]">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#D4AF37]">${(user.credits / 100).toFixed(2)}</div>
                        <div className="text-xs text-[var(--text-muted)]">Balance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{user._count.orders}</div>
                        <div className="text-xs text-[var(--text-muted)]">Orders</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{getFlagEmoji(order.country)}</span>
                      <div>
                        <div className="font-medium text-white">{order.countryName} - {order.planName}</div>
                        <div className="text-sm text-[var(--text-muted)]">{order.user.email}</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">${(order.total / 100).toFixed(2)}</div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'COMPLETED' ? 'bg-[var(--accent-lime)]/20 text-[var(--accent-lime)]' :
                        order.status === 'PENDING' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                        order.status === 'PAID' ? 'bg-[#008080]/20 text-[#008080]' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="max-w-2xl space-y-6">
              {/* Business Information */}
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="text-lg font-bold text-white mb-4">Business Information</h3>
                <p className="text-sm text-[var(--text-muted)] mb-6">
                  This information appears on invoices and wallet statements.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={settings?.businessName || ''}
                      onChange={(e) => setSettings(s => s ? { ...s, businessName: e.target.value } : s)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#008080]"
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Business Address
                    </label>
                    <textarea
                      value={settings?.businessAddress || ''}
                      onChange={(e) => setSettings(s => s ? { ...s, businessAddress: e.target.value } : s)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#008080] resize-none"
                      rows={3}
                      placeholder="Street address, city, country"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings?.businessEmail || ''}
                        onChange={(e) => setSettings(s => s ? { ...s, businessEmail: e.target.value } : s)}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#008080]"
                        placeholder="support@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={settings?.businessPhone || ''}
                        onChange={(e) => setSettings(s => s ? { ...s, businessPhone: e.target.value } : s)}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#008080]"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      VAT Number
                    </label>
                    <input
                      type="text"
                      value={settings?.businessVAT || ''}
                      onChange={(e) => setSettings(s => s ? { ...s, businessVAT: e.target.value } : s)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#008080]"
                      placeholder="GB123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Settings */}
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="text-lg font-bold text-white mb-4">Invoice Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Invoice Prefix
                    </label>
                    <input
                      type="text"
                      value={settings?.invoicePrefix || ''}
                      onChange={(e) => setSettings(s => s ? { ...s, invoicePrefix: e.target.value } : s)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#008080]"
                      placeholder="INV"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Invoice Footer
                    </label>
                    <textarea
                      value={settings?.invoiceFooter || ''}
                      onChange={(e) => setSettings(s => s ? { ...s, invoiceFooter: e.target.value } : s)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#008080] resize-none"
                      rows={2}
                      placeholder="Thank you for your business!"
                    />
                  </div>
                </div>
              </div>

              {/* Telegram Notifications */}
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="text-lg font-bold text-white mb-4">Telegram Notifications</h3>
                <p className="text-sm text-[var(--text-muted)] mb-6">
                  Get instant notifications for new orders and user registrations.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Bot Token
                    </label>
                    <input
                      type="password"
                      value={settings?.telegramBotToken || ''}
                      onChange={(e) => setSettings(s => s ? { ...s, telegramBotToken: e.target.value } : s)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#008080]"
                      placeholder="123456789:ABCdefGHIjklMNO..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Chat ID
                    </label>
                    <input
                      type="text"
                      value={settings?.telegramChatId || ''}
                      onChange={(e) => setSettings(s => s ? { ...s, telegramChatId: e.target.value } : s)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[#008080]"
                      placeholder="-1001234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between">
                {settingsMessage && (
                  <span className={`text-sm ${settingsMessage.includes('success') ? 'text-[var(--accent-lime)]' : 'text-red-400'}`}>
                    {settingsMessage}
                  </span>
                )}
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsSaving}
                  className="ml-auto px-6 py-3 rounded-xl bg-[#008080] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {settingsSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface)] rounded-2xl p-6 max-w-md w-full border border-[var(--border)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-[var(--bg)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#008080]/20 flex items-center justify-center text-2xl font-bold text-[#008080]">
                    {(selectedUser.name || selectedUser.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{selectedUser.name || 'Anonymous'}</div>
                    <div className="text-sm text-[var(--text-muted)]">{selectedUser.email}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.role === 'ADMIN' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[var(--bg)] text-[var(--text-muted)]'
                    }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-[var(--bg)]">
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#D4AF37]">${(selectedUser.credits / 100).toFixed(2)}</div>
                    <div className="text-xs text-[var(--text-muted)]">Balance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{selectedUser._count.orders}</div>
                    <div className="text-xs text-[var(--text-muted)]">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{selectedUser._count.esims}</div>
                    <div className="text-xs text-[var(--text-muted)]">eSIMs</div>
                  </div>
                </div>

                <div className="text-sm text-[var(--text-muted)]">
                  Member since {new Date(selectedUser.createdAt).toLocaleDateString()}
                </div>

                <button
                  onClick={() => downloadWalletStatement(selectedUser.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#008080] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  <FileText className="w-4 h-4" />
                  Download Wallet Statement
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
