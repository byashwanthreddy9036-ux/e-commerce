import User from "../models/Users.js";
import { registerUserSchema } from "../validators/validators.user.js"
import { hashPassword } from '../utils/bcrypt.js'
import token from '../utils/token.js'

export const registerUserMiddleware = async (req, res, next) => {
    try {

        const parsed = registerUserSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: parsed.data.email },
                { phone: parsed.data.phone }
            ]
        })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with email or phone already exists'
            })
        }
        const newUser = {
            email: parsed.data.email,
            phone: parsed.data.phone,
            fullname: parsed.data.fullname,
            password: parsed.data.password,
        }

        newUser.password = await hashPassword(parsed.data.password)
        const emailToken = token()
        const phoneToken = token()

        newUser.tokens = {
            email: emailToken,
            phone: phoneToken
        }

        req.userData = newUser
        next()
        // console.log("i was here");
    } catch (error) {
        console.error(error);
        console.log('error');
        console.error(error.message);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}