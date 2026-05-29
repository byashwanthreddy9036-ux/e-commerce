import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import './dbConnect.js'
import './seeding/admin.seeding.js'

import adminRoutes from './routes/admin.routes.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const server = express()

server.get('/', (req, res) => {
    res.send({
        success: true,
        message: 'Routes are working fine'
    })
})

server.use(cors())
server.use(express.json())

server.use('/api/admin/', adminRoutes)

server.use((req, res) => {
    res.send({
        success: false,
        message: 'Route does not exist'
    })
})

server.listen(PORT, () => {
    console.log('Live at @' + PORT);
})