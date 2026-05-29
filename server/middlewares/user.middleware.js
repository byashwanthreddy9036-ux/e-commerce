import User from "../models/Users.js";
import { registerUserSchema, userLoginSchema } from "../validators/validators.user.js"
import { hashPassword, comparePassword } from '../utils/bcrypt.js'
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

export const userLoginMiddleware = async (req, res, next) => {
    try {
        const parsed = userLoginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const { email, password } = parsed.data

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        console.log(user);
        console.log(password);
        console.log(user.password);
        console.log("USER PASSWORD FIELD:", user.password);
        console.log("COMPARE INPUTS:", {
            password,
            dbPassword: user.password
        });

        const match = await comparePassword(password, user.password);
        const isMatch = await comparePassword(password, user.password)
        console.log(isMatch);

        if (!(isMatch)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        if (user.role !== 'user') {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            })
        }
        req.loginData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
        };
        next()
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }

}
