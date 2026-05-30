import express from 'express'
import { registerUserMiddleware, updateUserMiddleware, userAuthMiddleware, userLoginMiddleware} from '../middlewares/user.middleware.js'
import { deleteUserDetails, getUserDetails, registerUser, updateUserDetails, userLogin } from '../controllers/user.controllers.js'
const userRoutes = express.Router()

userRoutes.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'User routes are working just fine'
    })
})

userRoutes.post('/register', registerUserMiddleware, registerUser)
userRoutes.post('/login', userLoginMiddleware, userLogin)

userRoutes.use(userAuthMiddleware)

userRoutes.get('/details', getUserDetails)
userRoutes.put('/details', updateUserMiddleware, updateUserDetails)
userRoutes.delete('/details/:id', deleteUserDetails)

// userRoutes.get('/wishlist', getAllWishList)
// userRoutes.get('/wishlist/:id', getProductByID)
// userRoutes.post('/wishlist', addProduct)
// userRoutes.delete('/wishlist/:id', deleteProduct)
// POST /wishlist/:id/move-to-cart
// userRoutes.get('/cart', getAllCart)
// userRoutes.get('/cart/:id', getProductByID)
// userRoutes.post('/cart', addProduct)
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