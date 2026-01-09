import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'

export async function GET() {
  const adminResult = await requireAdmin()
  if ('error' in adminResult) return adminResult.error

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalUsers,
      totalOrders,
      activeEsims,
      todayOrders,
      revenueData,
      todayRevenueData,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count({ where: { status: { in: ['PAID', 'COMPLETED'] } } }),
      prisma.eSim.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count({
        where: {
          createdAt: { gte: today },
          status: { in: ['PAID', 'COMPLETED'] },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['PAID', 'COMPLETED'] } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: today },
          status: { in: ['PAID', 'COMPLETED'] },
        },
      }),
    ])

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalRevenue: revenueData._sum.total || 0,
      activeEsims,
      todayOrders,
      todayRevenue: todayRevenueData._sum.total || 0,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
