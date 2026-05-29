import jwt from 'jsonwebtoken'

export const getSecret = () => {
  if (!process.env.SECRET) {
    throw new Error("SECRET is not defined in environment variables");
  }
  return process.env.SECRET;
};

const secret = getSecret() 

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

