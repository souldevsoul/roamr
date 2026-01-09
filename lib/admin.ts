import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Check if user is admin
export async function requireAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { adminId: session.user.id }
}

// Get settings with defaults
export async function getSettings() {
  let settings = await prisma.settings.findUnique({
    where: { id: 'default' },
  })

  if (!settings) {
    // Create default settings
    settings = await prisma.settings.create({
      data: {
        id: 'default',
        markupPercent: 30,
        minOrderValue: 100,
        freeDataThreshold: 5000,
        freeDataBonus: 500,
        referralBonus: 500,
        refereeBonus: 200,
        businessName: 'Roamr',
        businessAddress: '123 Travel Way\nExplorer City, EX 10001',
        businessEmail: 'support@roamr.co',
        businessPhone: '+1 (555) 987-6543',
      },
    })
  }

  return {
    markupPercent: settings.markupPercent,
    minOrderValue: settings.minOrderValue,
    freeDataThreshold: settings.freeDataThreshold,
    freeDataBonus: settings.freeDataBonus,
    referralBonus: settings.referralBonus,
    refereeBonus: settings.refereeBonus,
    businessName: settings.businessName || 'Roamr',
    businessAddress: settings.businessAddress || '123 Travel Way\nExplorer City, EX 10001',
    businessEmail: settings.businessEmail || 'support@roamr.co',
    businessPhone: settings.businessPhone || '+1 (555) 987-6543',
    businessVAT: settings.businessVAT || '',
    regionalMarkup: settings.regionalMarkup ? JSON.parse(settings.regionalMarkup) : {},
  }
}

// Log admin action
export async function logAdminAction(
  adminId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  entity: string,
  entityId?: string,
  changes?: Record<string, unknown>,
  ipAddress?: string
) {
  await prisma.adminAuditLog.create({
    data: {
      adminId,
      action,
      entity,
      entityId,
      changes: changes ? JSON.stringify(changes) : null,
      ipAddress,
    },
  })
}
