import { generateJWT } from '../utils/jwt.js'

export const adminLogin = async (req, res) => {
    try {        
        const loginData = req.loginData
        const token = await generateJWT({
            id : loginData._id,
            email : loginData.email,
            role : loginData.role
        })
        return res.json({
            success: true,
            message: 'Login successful',
            data: {
                admin: {
                    id: loginData._id,
                    fullname: loginData.fullname,
                    email: loginData.email,
                    role: loginData.role
                },
                token
            },
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error
        })
    }
}