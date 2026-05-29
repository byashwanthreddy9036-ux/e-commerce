import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendSMS(to, body) {
  try {
    const message = await client.messages.create({
      body,

      messagingServiceSid:
        process.env.TWILIO_MESSAGING_SERVICE_SID,

      to,
    })

    console.log('SMS Sent')

    return message
  } catch (error) {
    console.error(error)

    throw error
  }
}