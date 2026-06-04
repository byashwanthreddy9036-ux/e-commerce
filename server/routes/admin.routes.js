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
adminRoutes.use(adminAuthMiddleware)
adminRoutes.get('/prod', getAllProducts)
adminRoutes.get('/prod/:id', getAllProductByID)
adminRoutes.get('/prod/:id', getProductByID)
adminRoutes.post('/create-prod', createProductMiddleware, createProduct)
adminRoutes.put('/update-prod', updateProductMiddleware, updateProduct)
adminRoutes.delete('/delete-prod/:id', deleteProduct)

adminRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Admin route not found'
    })
})

export default adminRoutes