import User from '../models/Users.js'
import { generateJWT } from '../utils/jwt.js'
import { sendEmail } from '../services/email.js'

import { sendSMS } from '../services/phone.js'
import token from '../utils/token.js'
import mongoose from 'mongoose'

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

export const userLogin = async (req, res) => {
  try {
    const loginData = req.loginData
    const token = generateJWT({
      id: loginData._id,
      email: loginData.email,
      role: loginData.role
    })
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: loginData._id,
          fullname: loginData.fullname,
          email: loginData.email,
          role: loginData.role
        },
        token
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-tokens -verified');
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })

  }
}

export const updateUserDetails = async (req, res) => {
  try {
    const { id, userData } = req;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: userData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })

  }
}

export const deleteUserDetails = async (req, res) => {
  try {
    const id = req.user._id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Provide valid ID",
      });
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user associate with id'
      })
    }

    return res.json({
      success: true,
      message: 'User deleted successfully',
      data: user
    })
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}