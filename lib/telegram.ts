// Telegram notification service for Roamr

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''

async function sendTelegramMessage(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[Telegram] Not configured, skipping notification')
    return
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    if (!response.ok) {
      console.error('[Telegram] Failed to send message:', await response.text())
    }
  } catch (error) {
    console.error('[Telegram] Error sending message:', error)
  }
}

// Notify on new order
export async function notifyNewOrder({
  orderId,
  email,
  country,
  planName,
  total,
  status,
}: {
  orderId: string
  email: string
  country: string
  planName: string
  total: number
  status: string
}) {
  const message = `
<b>New Order on Roamr</b>

Order: <code>${orderId.slice(-8)}</code>
Customer: ${email}
Destination: ${country}
Plan: ${planName}
Total: $${(total / 100).toFixed(2)}
Status: ${status}
`.trim()

  await sendTelegramMessage(message)
}

// Notify on wallet top-up
export async function notifyWalletTopup({
  email,
  amount,
  newBalance,
  method,
  status,
}: {
  email: string
  amount: number
  newBalance: number
  method: string
  status: string
}) {
  const message = `
<b>Wallet Top-up on Roamr</b>

Customer: ${email}
Amount: +$${(amount / 100).toFixed(2)}
New Balance: $${(newBalance / 100).toFixed(2)}
Method: ${method}
Status: ${status}
`.trim()

  await sendTelegramMessage(message)
}

// Notify on new user registration
export async function notifyNewUser({
  email,
  name,
  referredBy,
}: {
  email: string
  name?: string
  referredBy?: string
}) {
  const message = `
<b>New User on Roamr</b>

Email: ${email}
Name: ${name || 'Not provided'}
${referredBy ? `Referred by: ${referredBy}` : ''}
`.trim()

  await sendTelegramMessage(message)
}

// Notify on eSIM activation
export async function notifyESimActivation({
  email,
  country,
  planName,
  iccid,
}: {
  email: string
  country: string
  planName: string
  iccid: string
}) {
  const message = `
<b>eSIM Activated on Roamr</b>

Customer: ${email}
Destination: ${country}
Plan: ${planName}
ICCID: <code>${iccid}</code>
`.trim()

  await sendTelegramMessage(message)
}
