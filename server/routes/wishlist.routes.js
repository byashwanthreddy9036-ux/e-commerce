import express from 'express'
import { addProductWish, deleteAllProductsWish, deleteProductWish, getAllWishlist } from '../controllers/wishlist.controllers'

const wishlistRoutes = express.Router()

wishlistRoutes.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Admin routes are working just fine'
    })
})

wishlistRoutes.get('/', getAllWishlist)
wishlistRoutes.post('/:id', addProductWish)
wishlistRoutes.delete('/:productId', deleteProductWish)
wishlistRoutes.delete('/delete-all', deleteAllProductsWish)
// wishlistRoutes.post('/wishlist/move-to-cart', orderPlaced)

wishlistRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Admin route not found'
    })
})

export default wishlistRoutes