import express from 'express'
import { registerUserMiddleware, updateUserMiddleware, userAuthMiddleware, userLoginMiddleware } from '../middlewares/user.middleware.js'
import { deleteUserDetails, getUserDetails, registerUser, updateUserDetails, userLogin } from '../controllers/user.controllers.js'
import { addProduct } from '../controllers/cart.controller.js'
import { validateAddProduct } from '../middlewares/cart.middlewares.js'
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
userRoutes.post('/cart', validateAddProduct, addProduct)
// userRoutes.put('/cart/:id', updateCartQuantity)
// userRoutes.delete('/cart/:id', deleteProduct)
// userRoutes.delete('/cart/all', deleteAllProducts)
// userRoutes.post('/cart/order', orderPlaced)

userRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'User route not found'
    })
})

export default userRoutes