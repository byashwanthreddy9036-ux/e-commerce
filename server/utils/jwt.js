import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const secret = process.env.SECRET

export const generateJWT = async (payload) => {
    try {
        const jwtToken = await jwt.sign({ data: payload }, secret, { expiresIn: 12000000000000 })
        return jwtToken
    } catch (error) {
        console.log(error);
    }
}

export const decodeJWT = async (token) => {
    try {
        const decoded = await jwt.verify(token, secret)
        return decoded.data
    } catch (error) {
        console.log(error);
    }
}

