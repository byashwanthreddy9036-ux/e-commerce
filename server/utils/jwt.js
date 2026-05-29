import jwt from 'jsonwebtoken'
import "dotenv/config";

const getSecret = () => {
  if (!process.env.SECRET) {
    throw new Error("SECRET is not defined in environment variables");
  }
  return process.env.SECRET;
};


export const generateJWT = (payload) => {
    try {
        const jwtToken = jwt.sign({ data: payload }, getSecret(), { expiresIn: '1d' })
        return jwtToken
    } catch (error) {
        console.error(error);
    }
}

export const decodeJWT = (token) => {
    try {
        const decoded = jwt.verify(token, getSecret())
        return decoded.data
    } catch (error) {
        console.error(error);
    }
}

