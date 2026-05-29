import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()
const saltRounds = Number(process.env.SALT_ROUNDS)

export const hashPassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password, saltRounds)
        return hashPassword
    } catch (error) {
        console.log(error)
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword)
        return match
    } catch (error) {
        console.log(error);
    }
}

