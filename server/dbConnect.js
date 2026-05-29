import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const db = process.env.MONGO_URL

const dbConnect = async () => {
    try {
        await mongoose.connect(db)
        console.log('DB connected successfully✅');
    } catch (error) {
        console.log('Error connecting to database❌');
        console.log(error);
    }
}
dbConnect()

export default dbConnect