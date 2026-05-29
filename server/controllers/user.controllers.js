import User from '../models/Users.js'

import { sendEmail } from '../services/email.js'

import { sendSMS } from '../services/phone.js'

export const registerUser = async (req, res) => {
  try {
    const userData = req.userData

    const user = await User.create(userData)

    /*
      EMAIL VERIFICATION LINK
    */

    const emailVerificationLink =
      `http://localhost:5200/verify/email` +
      `?user=${user._id}` +
      `&token=${user.tokens.email}`

    /*
      PHONE VERIFICATION TOKEN
    */

    const phoneVerificationMessage =
      `Ecom Verification Code: ${user.tokens.phone}`

    /*
      SEND EMAIL
    */

    await sendEmail({
      to: user.email,

      subject: 'Verify Your Email',

      html: `
        <h2>Hello ${user.fullname}</h2>

        <p>
          Click the link below to verify your email:
        </p>

        <a href="${emailVerificationLink}">
          Verify Email
        </a>
      `,
    })

    /*
      SEND SMS
    */

    await sendSMS(
      user.phone,
      phoneVerificationMessage
    )

    return res.status(201).json({
      success: true,

      message:
        'User registered. Verification email and SMS sent.',

      data: {
        _id: user._id,

        fullname: user.fullname,

        email: user.email,

        phone: user.phone,
      },
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,

      message: 'Internal Server Error',
    })
  }
}