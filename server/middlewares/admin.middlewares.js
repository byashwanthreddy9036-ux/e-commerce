import { comparePassword } from '../services/bcrypt.js'
import { decodeJWT } from '../services/jwt.js'
import Admin from '../models/Admin.js'

export const adminLoginMiddleware = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.send({
                sucess: false,
                message: 'Body is required'
            })
        }
        const { email, password } = req.body
        if (!email || !password) {
            return res.send({
                sucess: false,
                message: 'Invalid body'
            })
        }
        const exisitingAdmin = await Admin.findOne(email)

        if (!exisitingAdmin) {
            return res.send({
                sucess: false,
                message: 'Invalid credentials'
            })
        }

        if ((email !== exisitingAdmin.email)) {
            return res.send({
                sucess: false,
                message: 'Admin does not match'
            })
        }
        if (!await comparePassword(password, exisitingAdmin.password)) {
            return res.send({
                sucess: false,
                message: 'Invalid credentials'
            })
        }
        if (exisitingAdmin.role !== 'admin') {
            return res.send({
                sucess: false,
                message: 'Permission denied'
            })
        }
        req.loginData = exisitingAdmin
        next()
    } catch (error) {
        return res.send({
            sucess: false,
            message: error
        })
    }

}

export const adminAuthMiddleware = async (req, res, next) => {
    try {
        const jwtToken = req.headers['auth-token']
        if (!jwtToken) {
            return res.send({
                success: false,
                message: 'Jwt must be provided'
            })
        }
        const adminData = await decodeJWT(jwtToken)
        if (!adminData) {
            return res.status(401).send({
                success: false,
                message: 'Invalid or expired token'
            })
        }
        const admin = await Admin.findById(adminData.id)

        if (!admin || admin.role !== adminData.role) {
            return res.status(401).send({
                success: false,
                message: 'Auth failure'
            })
        }
        req.admin = admin
        next()
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: error.message
        })

    }
}