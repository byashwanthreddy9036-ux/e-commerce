import User from "../models/Users.js";
import { registerUserSchema, updateUserSchema, userLoginSchema } from "../validators/validators.user.js"
import { hashPassword, comparePassword } from '../utils/bcrypt.js'
import token from '../utils/token.js'
import { decodeJWT } from "../utils/jwt.js";

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
        // console.log('error');
        // console.error(error.message);

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

        const isMatch = await comparePassword(password, user.password)

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

import jwt from "jsonwebtoken";
import { decodeJWT } from "./jwt.js";
import User from "./models/User.js";

export const userAuthMiddleware = async (req, res, next) => {
    try {
        const jwtToken = req.headers["auth-token"];

        if (!jwtToken) {
            return res.status(401).json({
                success: false,
                message: "Jwt must be provided",
            });
        }

        let userData;

        // ✅ Handle JWT errors locally instead of going to 500
        try {
            userData = decodeJWT(jwtToken);
        } catch (error) {
            if (
                error instanceof jwt.JsonWebTokenError ||
                error instanceof jwt.TokenExpiredError ||
                error instanceof jwt.NotBeforeError
            ) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired token",
                });
            }

            // unknown error = real server issue
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        const user = await User.findById(userData.id);

        if (!user || user.role !== userData.role) {
            return res.status(401).json({
                success: false,
                message: "Auth failure",
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Account is not active",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const updateUserMiddleware = async (req, res, next) => {
    try {
        const parsed = updateUserSchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const { id, ...updateUser } = parsed.data;

        req.id = parsed.data.id;
        req.userData = updateUser;

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}