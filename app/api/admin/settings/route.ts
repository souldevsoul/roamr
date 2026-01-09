import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

// GET /api/admin/settings - Get current settings
export async function GET() {
  const adminResult = await requireAdmin()
  if ('error' in adminResult) return adminResult.error

  try {
    // Get or create settings
    let settings = await prisma.settings.findFirst()

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          businessName: 'ROAMR',
          businessAddress: '123 Travel Street, London, UK',
          businessEmail: 'support@roamr.co',
          businessPhone: '+44 20 1234 5678',
          businessVAT: 'GB123456789',
          invoicePrefix: 'ROAMR',
          invoiceFooter: 'Thank you for traveling with ROAMR!',
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Admin settings GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
  const adminResult = await requireAdmin()
  if ('error' in adminResult) return adminResult.error

  try {
    const body = await request.json()
    const {
      businessName,
      businessAddress,
      businessEmail,
      businessPhone,
      businessVAT,
      invoicePrefix,
      invoiceFooter,
      telegramBotToken,
      telegramChatId,
    } = body

    // Get existing settings or create new
    let settings = await prisma.settings.findFirst()

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          businessName,
          businessAddress,
          businessEmail,
          businessPhone,
          businessVAT,
          invoicePrefix,
          invoiceFooter,
          telegramBotToken,
          telegramChatId,
        },
      })
    } else {
      settings = await prisma.settings.create({
        data: {
          businessName,
          businessAddress,
          businessEmail,
          businessPhone,
          businessVAT,
          invoicePrefix,
          invoiceFooter,
          telegramBotToken,
          telegramChatId,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Admin settings PUT error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
