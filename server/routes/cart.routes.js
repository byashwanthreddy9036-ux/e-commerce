import express from 'express'
import { addProduct, decreaseProduct, deleteAllProducts, deleteProduct, getAllCart, orderPlaced } from '../controllers/cart.controller.js'

const cartRoutes = express.Router()

cartRoutes.get('/cart', (req, res) => {
    return res.json({
        success: true,
        message: 'Cart routes are working just fine'
    })
})

cartRoutes.get('/', getAllCart)
cartRoutes.post('/inc/:productId', addProduct)
cartRoutes.put('/dec/:productId', decreaseProduct)
cartRoutes.delete('/all', deleteAllProducts)
cartRoutes.delete('/:productId', deleteProduct)
cartRoutes.post('/order', orderPlaced)

cartRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Cart route not found'
    })
})

export default cartRoutes