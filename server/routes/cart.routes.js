import express from 'express'
import { addProduct, decreaseProduct, deleteAllProducts, deleteProduct, getAllCart, orderPlaced } from '../controllers/cart.controller'

const cartRoutes = express.Router()

cartRoutes.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Admin routes are working just fine'
    })
})

cartRoutes.get('/cart', getAllCart)
cartRoutes.post('/cart/inc/:id', addProduct)
cartRoutes.delete('/cart/all', deleteAllProducts)
cartRoutes.put('/cart/dec/:productId', decreaseProduct)
cartRoutes.delete('/cart/:productId', deleteProduct)
cartRoutes.post('/cart/order', orderPlaced)

cartRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Admin route not found'
    })
})

export default cartRoutes