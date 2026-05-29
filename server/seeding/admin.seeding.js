import Admin from '../models/Admin.js'
import { hashPassword } from '../utils/bcrypt.js'
import token from '../utils/token.js'
import dotenv from 'dotenv'
dotenv.config()

const seedAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne()

        if (existingAdmin) {
            return console.log('Admin Already exists');
        }

        const adminData = {
            fullname: process.env.ADMIN_FULLNAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin',
            tokens: {
                email: token()
            }
        }

        adminData.password = await hashPassword(adminData.password)

        await Admin.create(adminData)
        console.log('Admin seed successfull!');

    } catch (error) {
        console.log('Failed to seed admin');
        console.log(error.message);
    }
}

seedAdmin()

export default { seedAdmin }