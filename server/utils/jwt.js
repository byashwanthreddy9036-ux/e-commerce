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
    return jwt.sign({ data: payload }, getSecret(), { expiresIn: '1d' });
  } catch (error) {
    console.error("JWT error:", error);
    throw error;
  }
};

export const decodeJWT = (token) => {
  const decoded = jwt.verify(token, getSecret())
  return decoded.data
}

