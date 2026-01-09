import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'

export async function GET() {
  const adminResult = await requireAdmin()
  if ('error' in adminResult) return adminResult.error

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Admin orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
