import { comparePassword } from '../utils/bcrypt.js'
import { decodeJWT } from '../utils/jwt.js'
import Admin from '../models/Admin.js'

export const adminLoginMiddleware = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.json({
                success: false,
                message: 'Body is required'
            })
        }
        const { email, password } = req.body
        if (!email || !password) {
            return res.json({
                success: false,
                message: 'Invalid body'
            })
        }
        const exisitingAdmin = await Admin.findOne({email})

        if (!exisitingAdmin) {
            return res.json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        if (!await comparePassword(password, exisitingAdmin.password)) {
            return res.json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        if (exisitingAdmin.role !== 'admin') {
            return res.json({
                success: false,
                message: 'Permission denied'
            })
        }
        req.loginData = exisitingAdmin
        next()
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal Server Error'
        })
    }

}

export const adminAuthMiddleware = async (req, res, next) => {
    try {
        const jwtToken = req.headers['auth-token']
        if (!jwtToken) {
            return res.json({
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
        return res.status(401).json({
            success: false,
            message: 'Internal Server Error'
        })

    }
}