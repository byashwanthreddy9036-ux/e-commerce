import express from 'express'
import { registerUserMiddleware, updateUserMiddleware, userAuthMiddleware, userLoginMiddleware } from '../middlewares/user.middleware.js'
import { deleteUserDetails, getUserDetails, registerUser, updateUserDetails, userLogin } from '../controllers/user.controllers.js'
import { addProduct, decreaseProduct, deleteAllProducts, deleteProduct, getAllCart, orderPlaced } from '../controllers/cart.controller.js'
import { addProductWish, decreaseProductWish, deleteAllProductsWish, deleteProductWish, getAllWishlist } from '../controllers/wishlist.controllers.js'
const userRoutes = express.Router()

userRoutes.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'User routes are working just fine'
    })
})

userRoutes.post('/user/register', registerUserMiddleware, registerUser)
userRoutes.post('/user/login', userLoginMiddleware, userLogin)

userRoutes.use(userAuthMiddleware)

userRoutes.get('/user/details', getUserDetails)
userRoutes.put('/user/details', updateUserMiddleware, updateUserDetails)
userRoutes.delete('/user/details/', deleteUserDetails)

userRoutes.get('/wishlist', getAllWishlist)
userRoutes.post('/wishlist/inc/:id', addProductWish)
userRoutes.put('/wishlist/dec/:productId', decreaseProductWish)
userRoutes.delete('/wishlit/:productId', deleteProductWish)
userRoutes.delete('/wishlist/all', deleteAllProductsWish)
// userRoutes.post('/wishlist/move-to-cart', orderPlaced)

userRoutes.get('/cart', getAllCart)
userRoutes.post('/cart/inc/:id', addProduct)
userRoutes.put('/cart/dec/:productId', decreaseProduct)
userRoutes.delete('/cart/:productId', deleteProduct)
userRoutes.delete('/cart/all', deleteAllProducts)
userRoutes.post('/cart/order', orderPlaced)

userRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'User route not found'
    })
})

export default userRoutes