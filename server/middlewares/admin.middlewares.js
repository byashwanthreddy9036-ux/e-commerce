import { comparePassword } from '../utils/bcrypt.js'
import { decodeJWT } from '../utils/jwt.js'
import Admin from '../models/Admin.js'
import { adminLoginSchema } from "../validators/validators.admin.js";


export const adminLoginMiddleware = async (req, res, next) => {
    try {
        const parsed = adminLoginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const { email, password } = parsed.data

        const existingAdmin = await Admin.findOne({ email })

        if (!existingAdmin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        if (!await comparePassword(password, existingAdmin.password)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        if (existingAdmin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            })
        }
        req.loginData = existingAdmin
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }

}

export const adminAuthMiddleware = async (req, res, next) => {
    try {
        const jwtToken = req.headers['auth-token']
        if (!jwtToken) {
            return res.status(401).json({
                success: false,
                message: 'Jwt must be provided'
            })
        }
        const adminData = decodeJWT(jwtToken)
        if (!adminData) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            })
        }
        const admin = await Admin.findById(adminData.id)

        if (!admin || admin.role !== adminData.role) {
            return res.status(401).json({
                success: false,
                message: 'Auth failure'
            })
        }
        req.admin = admin
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}