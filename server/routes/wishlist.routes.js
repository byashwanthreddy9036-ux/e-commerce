import express from 'express'
import { addProduct } from '../controllers/cart.controller.js'
import { addProductWish, deleteAllProductsWish, deleteProductWish, getAllWishlist } from '../controllers/wishlist.controllers.js'
import { userAuthMiddleware } from '../middlewares/user.middleware.js'
import { mtcMiddleware } from '../middlewares/mtc.middleware.js'

const wishlistRoutes = express.Router()

wishlistRoutes.get('/health', (req, res) => {
    return res.json({
        success: true,
        message: 'WishList routes are working just fine'
    })
})

wishlistRoutes.use(userAuthMiddleware)
wishlistRoutes.get('/', getAllWishlist)
wishlistRoutes.post('/:id', addProductWish)
wishlistRoutes.delete('/delete-all', deleteAllProductsWish)
wishlistRoutes.delete('/:productId', deleteProductWish)
wishlistRoutes.post('/move-to-cart/:productId', mtcMiddleware, addProduct)

wishlistRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Wishlist route not found'
    })
})

export default wishlistRoutes