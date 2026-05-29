import jwt from 'jsonwebtoken'

const secret = process.env.SECRET || 'vhsdbvjn'

export const generateJWT = (payload) => {
    try {
        const jwtToken = jwt.sign({ data: payload }, secret, { expiresIn: '1d' })
        return jwtToken
    } catch (error) {
        console.error(error);
    }
}

export const decodeJWT = (token) => {
    try {
        const decoded = jwt.verify(token, secret)
        return decoded.data
    } catch (error) {
        console.error(error);
    }
}

