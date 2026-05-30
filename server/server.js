import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'

import './dbConnect.js'
import './seeding/admin.seeding.js'

import adminRoutes from './routes/admin.routes.js'
import userRoutes from './routes/user.routes.js'


const PORT = process.env.PORT || 3000
const server = express()

server.use(cors({
    origin: 'http://localhost:5200'
}));

server.use(express.json())

server.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Routes are working fine'
    })
})


server.use('/api/admin/', adminRoutes)
server.use('/api/', userRoutes)

server.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Route does not exist'
    })
})

server.listen(PORT, () => {
    console.log('Live at @' + PORT);
})