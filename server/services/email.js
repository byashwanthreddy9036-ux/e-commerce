import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_APP_PASSWORD,
  },
})

export async function sendEmail(data) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,

      to: data.to,

      subject: data.subject,

      html: data.html,
    })

    console.log('Email Sent')

    return info
  } catch (error) {
    console.error(error)

    throw error
  }
}