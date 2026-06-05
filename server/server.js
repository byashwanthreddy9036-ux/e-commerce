import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'

import './dbConnect.js'
import './seeding/admin.seeding.js'

import adminRoutes from './routes/admin.routes.js'
import userRoutes from './routes/user.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import cartRoutes from './routes/cart.routes.js'
import productRoutes from './routes/product.routes.js'


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
server.use('/api/wishlist', wishlistRoutes)
server.use('/api/cart', cartRoutes)
server.use('/api/user/', userRoutes)
server.use('/api/product/', productRoutes)


server.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Route does not exist'
    })
})

server.listen(PORT, () => {
    console.log('Live at @' + PORT);
})