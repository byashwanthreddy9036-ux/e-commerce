import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config() // here cause fails as loading from server.js

const db = process.env.MONGO_URL

if (!db) {
    console.error("MONGO_URL is not defined in environment variables");
    process.exit(1); // Exit the application with an error code
}

const dbConnect = async () => {
    try {
        await mongoose.connect(db)
        console.log('DB connected successfully✅');
    } catch (error) {
        console.log('Error connecting to database❌');
        console.error(error.message);
        process.exit(1)
    }
}
dbConnect()

export default dbConnect