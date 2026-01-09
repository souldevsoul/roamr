import { jsPDF } from 'jspdf'

interface InvoiceData {
  orderId: string
  orderDate: Date
  customerName: string
  customerEmail: string
  country: string
  planName: string
  dataAmount: string
  validity: number
  subtotal: number
  discount: number
  total: number
  promoCode?: string
  status?: string
}

interface BusinessSettings {
  businessName?: string | null
  businessAddress?: string | null
  businessEmail?: string | null
  businessPhone?: string | null
  businessVAT?: string | null
}

export function generateInvoicePDF(data: InvoiceData, business?: BusinessSettings): Buffer {
  const doc = new jsPDF()

  // ROAMR brand colors - dark navy/teal/gold passport theme
  const navyColor = [15, 31, 53] as [number, number, number] // Dark navy #0f1f35
  const tealColor = [13, 148, 136] as [number, number, number] // Teal #0d9488
  const goldColor = [212, 175, 55] as [number, number, number] // Gold #D4AF37
  const textColor = [26, 26, 26] as [number, number, number]
  const grayColor = [102, 102, 102] as [number, number, number]
  const lightGray = [200, 200, 200] as [number, number, number]

  // Business info with defaults
  const businessName = business?.businessName || 'ROAMR'
  const businessAddress = business?.businessAddress || '123 Travel Way\nExplorer City, EX 10001'
  const businessEmail = business?.businessEmail || 'support@roamr.co'
  const businessPhone = business?.businessPhone || ''
  const businessVAT = business?.businessVAT || ''

  // Header - dark navy passport style
  doc.setFillColor(...navyColor)
  doc.rect(0, 0, 210, 50, 'F')

  // Gold accent line
  doc.setFillColor(...goldColor)
  doc.rect(0, 50, 210, 3, 'F')

  // Brand name in gold
  doc.setTextColor(...goldColor)
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.text(businessName.toUpperCase(), 20, 28)

  // Tagline
  doc.setTextColor(148, 163, 184) // Slate gray
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Your Digital Travel Passport', 20, 38)

  // Invoice badge
  doc.setFillColor(...tealColor)
  doc.roundedRect(150, 15, 45, 25, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', 172, 24, { align: 'center' })
  doc.setFontSize(9)
  doc.text(`#${data.orderId.slice(-8).toUpperCase()}`, 172, 33, { align: 'center' })

  // Date below header
  doc.setTextColor(...grayColor)
  doc.setFontSize(9)
  doc.text(formatDate(data.orderDate), 20, 62)

  // Company Info
  let y = 75
  doc.text(businessName, 20, y)

  const addressLines = businessAddress.split('\n')
  addressLines.forEach((line, i) => {
    doc.text(line.trim(), 20, y + 5 + (i * 5))
  })
  y += 5 + (addressLines.length * 5)

  if (businessEmail) {
    doc.text(businessEmail, 20, y)
    y += 5
  }
  if (businessPhone) {
    doc.text(businessPhone, 20, y)
    y += 5
  }
  if (businessVAT) {
    doc.text(`VAT: ${businessVAT}`, 20, y)
  }

  y = 75

  // Bill To with gold accent
  doc.setTextColor(...goldColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('TRAVELER', 120, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  doc.text(data.customerName, 120, y + 7)
  doc.text(data.customerEmail, 120, y + 14)

  // Divider with teal accent
  y = 110
  doc.setDrawColor(...tealColor)
  doc.setLineWidth(0.5)
  doc.line(20, y, 190, y)

  // Table Header with navy background
  y = 125
  doc.setFillColor(...navyColor)
  doc.rect(20, y - 6, 170, 12, 'F')

  doc.setTextColor(...goldColor)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DESTINATION', 25, y)
  doc.text('QTY', 120, y)
  doc.text('PRICE', 145, y)
  doc.text('AMOUNT', 170, y)

  // Table Content
  y = 145
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  doc.setFontSize(10)
  doc.text(`${data.country} eSIM`, 25, y)
  doc.setFontSize(8)
  doc.setTextColor(...grayColor)
  doc.text(`${data.planName}`, 25, y + 5)
  doc.text(`${data.dataAmount} - ${data.validity} days`, 25, y + 10)

  doc.setTextColor(...textColor)
  doc.setFontSize(10)
  doc.text('1', 125, y)
  doc.text(`$${(data.subtotal / 100).toFixed(2)}`, 145, y)
  doc.text(`$${(data.subtotal / 100).toFixed(2)}`, 170, y)

  // Subtotals
  y = 180
  doc.setDrawColor(...tealColor)
  doc.line(120, y, 190, y)

  y = 192
  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  doc.text('Subtotal', 120, y)
  doc.setTextColor(...textColor)
  doc.text(`$${(data.subtotal / 100).toFixed(2)}`, 170, y)

  if (data.discount > 0) {
    y += 10
    doc.setTextColor(...tealColor)
    doc.text(`Discount${data.promoCode ? ` (${data.promoCode})` : ''}`, 120, y)
    doc.text(`-$${(data.discount / 100).toFixed(2)}`, 170, y)
  }

  // Total
  y += 15
  doc.setDrawColor(...goldColor)
  doc.setLineWidth(1)
  doc.line(120, y - 5, 190, y - 5)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...textColor)
  doc.text('Total', 120, y + 3)
  doc.setTextColor(...goldColor)
  doc.text(`$${(data.total / 100).toFixed(2)}`, 165, y + 3)

  // Payment Status with teal
  y += 25
  doc.setFillColor(...tealColor)
  doc.roundedRect(120, y - 5, 70, 15, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('PAID', 155, y + 3, { align: 'center' })

  // Footer with navy background
  doc.setFillColor(...navyColor)
  doc.rect(0, 265, 210, 32, 'F')

  // Gold accent line
  doc.setFillColor(...goldColor)
  doc.rect(0, 265, 210, 2, 'F')

  doc.setTextColor(...goldColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Thank you for traveling with ROAMR!', 105, 278, { align: 'center' })

  doc.setTextColor(148, 163, 184)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`Questions? Contact ${businessEmail}`, 105, 288, { align: 'center' })

  // Return as buffer
  const arrayBuffer = doc.output('arraybuffer')
  return Buffer.from(arrayBuffer)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

interface WalletTransaction {
  id: string
  type: string
  amount: number // in cents
  balance: number // in cents
  description: string
  status: string
  createdAt: Date
}

interface WalletStatementData {
  customerName: string
  customerEmail: string
  currentBalance: number // in cents
  transactions: WalletTransaction[]
  generatedAt: Date
}

export function generateWalletStatementPDF(data: WalletStatementData, business?: BusinessSettings): Buffer {
  const doc = new jsPDF()

  // ROAMR brand colors - dark navy/teal/gold passport theme
  const navyColor = [15, 31, 53] as [number, number, number] // Dark navy #0f1f35
  const tealColor = [13, 148, 136] as [number, number, number] // Teal #0d9488
  const goldColor = [212, 175, 55] as [number, number, number] // Gold #D4AF37

  // Business info with defaults
  const businessName = business?.businessName || 'ROAMR'
  const businessAddress = business?.businessAddress || '123 Travel Way\nExplorer City, EX 10001'
  const businessEmail = business?.businessEmail || 'support@roamr.co'

  const textColor = [26, 26, 26] as [number, number, number]
  const grayColor = [102, 102, 102] as [number, number, number]
  const lightGray = [200, 200, 200] as [number, number, number]
  const greenColor = [22, 163, 74] as [number, number, number]
  const redColor = [220, 38, 38] as [number, number, number]
  const yellowColor = [202, 138, 4] as [number, number, number]

  // Header - dark navy passport style
  doc.setFillColor(...navyColor)
  doc.rect(0, 0, 210, 50, 'F')

  // Gold accent line
  doc.setFillColor(...goldColor)
  doc.rect(0, 50, 210, 3, 'F')

  // Brand name in gold
  doc.setTextColor(...goldColor)
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.text(businessName.toUpperCase(), 20, 28)

  // Tagline
  doc.setTextColor(148, 163, 184) // Slate gray
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Travel Fund Statement', 20, 38)

  // Statement badge
  doc.setFillColor(...tealColor)
  doc.roundedRect(140, 15, 55, 25, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('STATEMENT', 167, 24, { align: 'center' })
  doc.setFontSize(9)
  doc.text(formatDate(data.generatedAt).split(',')[0], 167, 33, { align: 'center' })

  // Company Info
  doc.setTextColor(...grayColor)
  doc.setFontSize(9)
  let y = 65
  doc.text(businessName, 20, y)

  const addressLines = businessAddress.split('\n')
  addressLines.forEach((line, i) => {
    doc.text(line.trim(), 20, y + 5 + (i * 5))
  })

  y = 65

  // Account Info with gold accent
  doc.setTextColor(...goldColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('TRAVELER', 120, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  doc.text(data.customerName, 120, y + 7)
  doc.text(data.customerEmail, 120, y + 14)

  // Current Balance Box with gold border
  y = 90
  doc.setFillColor(...navyColor)
  doc.roundedRect(120, y, 70, 22, 3, 3, 'F')
  doc.setDrawColor(...goldColor)
  doc.setLineWidth(1)
  doc.roundedRect(120, y, 70, 22, 3, 3, 'S')
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(8)
  doc.text('TRAVEL FUND BALANCE', 125, y + 8)
  doc.setTextColor(...goldColor)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`$${(data.currentBalance / 100).toFixed(2)}`, 125, y + 18)

  // Divider with teal accent
  y = 120
  doc.setDrawColor(...tealColor)
  doc.setLineWidth(0.5)
  doc.line(20, y, 190, y)

  // Table Header with navy background
  y = 133
  doc.setFillColor(...navyColor)
  doc.rect(20, y - 6, 170, 12, 'F')

  doc.setTextColor(...goldColor)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('DATE', 25, y)
  doc.text('TYPE', 55, y)
  doc.text('DESCRIPTION', 85, y)
  doc.text('AMOUNT', 145, y)
  doc.text('STATUS', 170, y)

  // Table Content
  y = 145
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)

  const maxTransactionsPerPage = 20
  let transactionCount = 0

  for (const tx of data.transactions) {
    if (transactionCount >= maxTransactionsPerPage) {
      // Add new page
      doc.addPage()
      y = 30

      // Table Header on new page with navy background
      doc.setFillColor(...navyColor)
      doc.rect(20, y - 6, 170, 12, 'F')
      doc.setTextColor(...goldColor)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('DATE', 25, y)
      doc.text('TYPE', 55, y)
      doc.text('DESCRIPTION', 85, y)
      doc.text('AMOUNT', 145, y)
      doc.text('STATUS', 170, y)

      y = 42
      doc.setFont('helvetica', 'normal')
      transactionCount = 0
    }

    // Date
    doc.setTextColor(...grayColor)
    doc.text(formatShortDate(tx.createdAt), 25, y)

    // Type
    doc.setTextColor(...textColor)
    const typeLabel = tx.type.charAt(0).toUpperCase() + tx.type.slice(1).toLowerCase()
    doc.text(typeLabel, 55, y)

    // Description (truncate if too long)
    const desc = tx.description.length > 30 ? tx.description.substring(0, 27) + '...' : tx.description
    doc.text(desc, 85, y)

    // Amount (with color based on type)
    const isPositive = tx.type.toLowerCase() === 'topup' || tx.type.toLowerCase() === 'refund' || tx.type.toLowerCase() === 'bonus'
    if (isPositive) {
      doc.setTextColor(...greenColor)
      doc.text(`+$${(tx.amount / 100).toFixed(2)}`, 145, y)
    } else {
      doc.setTextColor(...redColor)
      doc.text(`-$${(tx.amount / 100).toFixed(2)}`, 145, y)
    }

    // Status
    const status = tx.status.toLowerCase()
    if (status === 'completed') {
      doc.setTextColor(...greenColor)
    } else if (status === 'failed') {
      doc.setTextColor(...redColor)
    } else {
      doc.setTextColor(...yellowColor)
    }
    doc.text(tx.status.charAt(0).toUpperCase() + tx.status.slice(1).toLowerCase(), 170, y)

    y += 10
    transactionCount++
  }

  // Summary section
  if (data.transactions.length > 0) {
    y += 10
    doc.setDrawColor(...lightGray)
    doc.line(20, y, 190, y)

    y += 12
    doc.setTextColor(...grayColor)
    doc.setFontSize(9)
    doc.text(`Total Transactions: ${data.transactions.length}`, 20, y)

    // Calculate totals
    const totalTopups = data.transactions
      .filter(t => t.type.toLowerCase() === 'topup' && t.status.toLowerCase() === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    const totalPurchases = data.transactions
      .filter(t => t.type.toLowerCase() === 'purchase' && t.status.toLowerCase() === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)

    doc.text(`Total Top-ups: $${(totalTopups / 100).toFixed(2)}`, 80, y)
    doc.text(`Total Purchases: $${(totalPurchases / 100).toFixed(2)}`, 140, y)
  }

  // Footer with navy background on each page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    // Navy footer background
    doc.setFillColor(...navyColor)
    doc.rect(0, 275, 210, 22, 'F')

    // Gold accent line
    doc.setFillColor(...goldColor)
    doc.rect(0, 275, 210, 2, 'F')

    doc.setTextColor(...goldColor)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('ROAMR - Your Digital Travel Passport', 105, 284, { align: 'center' })

    doc.setTextColor(148, 163, 184)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(`Page ${i} of ${pageCount} | ${businessEmail}`, 105, 291, { align: 'center' })
  }

  const arrayBuffer = doc.output('arraybuffer')
  return Buffer.from(arrayBuffer)
}

function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
