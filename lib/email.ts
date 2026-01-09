import { Resend } from 'resend'

// Lazy initialize to avoid build-time errors
let resend: Resend | null = null

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

const FROM_EMAIL = 'ROAMR <noreply@roamr.co>'
const BASE_URL = process.env.NEXTAUTH_URL || 'https://roamr.co'

// ROAMR Brand Colors
const NAVY = '#0f1f35'
const TEAL = '#0d9488'
const GOLD = '#D4AF37'
const SLATE = '#94a3b8'

interface GiftEsimEmailProps {
  recipientEmail: string
  senderName: string
  recipientName?: string
  personalMessage?: string
  country: string
  planName: string
  dataAmount: string
  validity: number
  qrCodeUrl: string
  activationCode?: string
}

// Gift eSIM email to a friend
export async function sendGiftEsimEmail({
  recipientEmail,
  senderName,
  recipientName,
  personalMessage,
  country,
  planName,
  dataAmount,
  validity,
  qrCodeUrl,
  activationCode,
}: GiftEsimEmailProps) {
  try {
    const greeting = recipientName ? `Hi ${recipientName}!` : 'Hi there!'

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `${senderName} sent you an eSIM gift for ${country}!`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a1628;">
  <div style="max-width: 600px; margin: 0 auto; background-color: ${NAVY};">
    <!-- Header with navy/gold passport style -->
    <div style="background-color: ${NAVY}; padding: 40px 30px; text-align: center; border-bottom: 3px solid ${GOLD};">
      <div style="font-size: 48px; margin-bottom: 10px;">🎁</div>
      <h1 style="color: ${GOLD}; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 2px;">ROAMR</h1>
      <p style="color: ${SLATE}; margin: 8px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Digital Travel Passport</p>
      <p style="color: #ffffff; margin: 15px 0 0; font-size: 18px;">You've Received a Gift!</p>
      <p style="color: ${SLATE}; margin: 5px 0 0; font-size: 14px;">From ${senderName}</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #ffffff; margin: 0 0 10px; font-size: 24px;">${greeting}</h2>
      <p style="color: ${SLATE}; font-size: 16px; margin: 0 0 20px;">
        <strong style="color: ${GOLD};">${senderName}</strong> has sent you an eSIM for <strong style="color: ${TEAL};">${country}</strong>!
      </p>

      ${personalMessage ? `
      <div style="background-color: rgba(13, 148, 136, 0.15); border-left: 4px solid ${TEAL}; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <p style="color: ${SLATE}; font-size: 14px; font-style: italic; margin: 0;">"${personalMessage}"</p>
        <p style="color: ${GOLD}; font-size: 12px; margin: 10px 0 0;">- ${senderName}</p>
      </div>
      ` : ''}

      <!-- Gift Details with gold border -->
      <div style="background-color: rgba(212, 175, 55, 0.08); border-radius: 12px; padding: 24px; margin: 30px 0; border: 2px solid ${GOLD};">
        <h3 style="color: ${GOLD}; margin: 0 0 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">Your Travel eSIM</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: ${SLATE}; font-size: 14px;">Destination</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right; font-weight: bold;">${country}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: ${SLATE}; font-size: 14px;">Plan</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right;">${planName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: ${SLATE}; font-size: 14px;">Data</td>
            <td style="padding: 10px 0; color: ${TEAL}; font-size: 14px; text-align: right; font-weight: bold;">${dataAmount}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: ${SLATE}; font-size: 14px;">Validity</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right;">${validity} days from activation</td>
          </tr>
        </table>
      </div>

      <!-- QR Code with gold accent -->
      <div style="text-align: center; margin: 30px 0; padding: 30px; background-color: #ffffff; border-radius: 12px; border-top: 4px solid ${GOLD};">
        <h3 style="color: ${NAVY}; margin: 0 0 20px; font-size: 18px;">Scan to Install Your eSIM</h3>
        <img src="${qrCodeUrl}" alt="eSIM QR Code" style="width: 200px; height: 200px; border-radius: 8px; border: 2px solid ${NAVY};" />
        ${activationCode ? `
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9ff; border-radius: 8px;">
          <p style="color: #666666; font-size: 12px; margin: 0 0 5px;">Manual Activation Code:</p>
          <code style="color: ${TEAL}; font-size: 11px; word-break: break-all;">${activationCode}</code>
        </div>
        ` : ''}
      </div>

      <!-- Installation Steps -->
      <div style="background-color: rgba(13, 148, 136, 0.1); border-radius: 12px; padding: 24px; margin: 30px 0;">
        <h3 style="color: ${TEAL}; margin: 0 0 15px; font-size: 16px;">How to Install</h3>
        <ol style="color: ${SLATE}; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Make sure your phone supports eSIM</li>
          <li>Go to <strong style="color: #ffffff;">Settings</strong> > <strong style="color: #ffffff;">Cellular</strong> > <strong style="color: #ffffff;">Add eSIM</strong></li>
          <li>Select <strong style="color: #ffffff;">Use QR Code</strong> and scan the code above</li>
          <li>Enable the eSIM when you arrive at your destination</li>
        </ol>
      </div>
    </div>

    <!-- Footer with navy/gold -->
    <div style="background-color: ${NAVY}; padding: 30px; text-align: center; border-top: 3px solid ${GOLD};">
      <p style="color: ${GOLD}; font-size: 14px; font-weight: bold; margin: 0 0 10px; letter-spacing: 1px;">
        ROAMR
      </p>
      <p style="color: ${SLATE}; font-size: 11px; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 1px;">
        Your Digital Travel Passport
      </p>
      <p style="color: ${SLATE}; font-size: 12px; margin: 0;">
        Questions? Visit <a href="${BASE_URL}/help" style="color: ${TEAL};">our help center</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Failed to send gift email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending gift email:', error)
    return { success: false, error }
  }
}
