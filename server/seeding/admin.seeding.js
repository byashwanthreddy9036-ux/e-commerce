import Admin from '../models/Admin.js'
import { hashPassword } from '../utils/bcrypt.js'
import token from '../utils/token.js'
import dotenv from 'dotenv'
dotenv.config()

function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing env variable: ${name}`);
    }
    return value;
}

const seedAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne()

        if (existingAdmin) {
            return console.log('Admin Already exists');
        }

        const adminData = {
            fullname: requireEnv("ADMIN_FULLNAME"),
            email: requireEnv("ADMIN_EMAIL"),
            password: requireEnv("ADMIN_PASSWORD"),
            role: "admin",
            tokens: {
                email: token(),
            },
        };

        adminData.password = await hashPassword(adminData.password)

        await Admin.create(adminData)
        console.log('Admin seed successful!');

    } catch (error) {
        console.log('Failed to seed admin');
        console.error(error.message);
    }
}

seedAdmin()

