import express from 'express'
import { registerUserMiddleware, updateUserMiddleware, userAuthMiddleware, userLoginMiddleware } from '../middlewares/user.middleware.js'
import { deleteUserDetails, getUserDetails, registerUser, updateUserDetails, userLogin } from '../controllers/user.controllers.js'
import { addProduct, decreaseProduct, deleteAllProduct, deleteProduct } from '../controllers/cart.controller.js'
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

// userRoutes.get('/wishlist', getAllWishList)
// userRoutes.get('/wishlist/:id', getProductByID)
// userRoutes.post('/wishlist', addProduct)
// userRoutes.delete('/wishlist/:id', deleteProduct)
// POST /wishlist/:id/move-to-cart
// userRoutes.get('/cart', getAllCart)
// userRoutes.get('/cart/:id', getProductByID)
userRoutes.post('/cart/inc/:id',  addProduct)
userRoutes.put('/cart/dec/:productId',  decreaseProduct)
userRoutes.delete('/cart/:productId', deleteProduct)
userRoutes.delete('/cart/all', deleteAllProduct)
// userRoutes.post('/cart/order', orderPlaced)

userRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'User route not found'
    })
})

export default userRoutes