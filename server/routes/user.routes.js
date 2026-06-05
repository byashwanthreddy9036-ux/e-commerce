import express from 'express'
import { registerUserMiddleware, updateUserMiddleware, userAuthMiddleware, userLoginMiddleware } from '../middlewares/user.middleware.js'
import { deleteUserDetails, getUserDetails, registerUser, updateUserDetails, userLogin } from '../controllers/user.controllers.js'
import { deleteAllProductsWish } from '../controllers/wishlist.controllers.js'
import { deleteAllProducts } from '../controllers/cart.controller.js'
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
userRoutes.delete('/details/', deleteAllProductsWish, deleteAllProducts ,deleteUserDetails)


userRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'User route not found'
    })
})

export default userRoutes