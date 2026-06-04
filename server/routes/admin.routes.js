import express from 'express'
import { adminAuthMiddleware, adminLoginMiddleware } from '../middlewares/admin.middlewares.js'
import { adminLogin } from '../controllers/admin.controllers.js'
import { createProductMiddleware, updateProductMiddleware } from '../middlewares/product.middlewares.js'
import { createProduct, deleteProduct, getProductByID, getAllProducts, updateProduct, getAllProductByID } from '../controllers/product.controllers.js'

const adminRoutes = express.Router()

adminRoutes.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Admin routes are working just fine'
    })
})

adminRoutes.post('/login', adminLoginMiddleware, adminLogin)

adminRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Admin route not found'
    })
})

export default adminRoutes