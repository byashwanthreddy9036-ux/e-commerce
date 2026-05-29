import Admin from '../models/Admin.js'
import { hashPassword } from '../utils/bcrypt.js'
import token from '../utils/token.js'

const seedAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne()

        if (existingAdmin) {
            return console.log('Admin Already exists');
        }

        const adminData = {
            fullname: 'Admin',
            email: 'admin@tasky.com',
            password: 'Admin@tasky123',
            role: 'admin',
            tokens: {
                email: token()
            }
        }

        adminData.password = await hashPassword(adminData.password)

        const admin = await Admin.create(adminData)
        console.log('Admin seed successfull!');

    } catch (error) {
        console.log('Failed to seed admin');
        console.log(error);
    }
}

seedAdmin()

export default { seedAdmin }