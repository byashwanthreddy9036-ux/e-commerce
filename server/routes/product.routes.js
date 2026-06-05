import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductByID, updateProduct } from '../controllers/product.controllers.js'
import { createProductMiddleware, updateProductMiddleware } from '../middlewares/product.middlewares.js'
import { adminAuthMiddleware } from '../middlewares/admin.middlewares.js'

const productRoutes = express.Router()

productRoutes.get('/product', (req, res) => {
    return res.json({
        success: true,
        message: 'Product routes are working just fine'
    })
})

productRoutes.get('/', getAllProducts)
productRoutes.get('/:id', getProductByID)

productRoutes.use(adminAuthMiddleware)
productRoutes.post('/', createProductMiddleware, createProduct)
productRoutes.put('/', updateProductMiddleware, updateProduct)
productRoutes.delete('/:id', deleteProduct)


productRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Product route not found'
    })
})

export default productRoutes