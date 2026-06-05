import express from 'express'
import { addProductWish, deleteAllProductsWish, deleteProductWish, getAllWishlist } from '../controllers/wishlist.controllers'

const wishlistRoutes = express.Router()

wishlistRoutes.get('/wish', (req, res) => {
    return res.json({
        success: true,
        message: 'WishList routes are working just fine'
    })
})

wishlistRoutes.get('/', getAllWishlist)
wishlistRoutes.post('/:id', addProductWish)
wishlistRoutes.delete('/delete-all', deleteAllProductsWish)
wishlistRoutes.delete('/:productId', deleteProductWish)
// wishlistRoutes.post('/wishlist/move-to-cart', orderPlaced)

wishlistRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Wishlist route not found'
    })
})

export default wishlistRoutes