import bcrypt from 'bcryptjs'

const saltRounds = Number(process.env.SALT_ROUNDS) || 10

export const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    } catch (error) {
        console.error(error)
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword)
        return match
    } catch (error) {
        console.error(error);
    }
}

