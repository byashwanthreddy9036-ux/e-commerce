import express from 'express'
import { createProduct, getAllProducts, getProductByID, updateProduct } from '../controllers/product.controllers'
import { createProductMiddleware, updateProductMiddleware } from '../middlewares/product.middlewares'
import { deleteProduct } from '../controllers/cart.controller'
import { adminAuthMiddleware } from '../middlewares/admin.middlewares'

const productRoutes = express.Router()

productRoutes.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Admin routes are working just fine'
    })
})

productRoutes.get('/', getAllProducts)
productRoutes.get('/:id', getAllProductByID)

productRoutes.use(adminAuthMiddleware)
productRoutes.post('/', createProductMiddleware, createProduct)
productRoutes.put('/', updateProductMiddleware, updateProduct)
productRoutes.delete('/:id', deleteProduct)


productRoutes.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Admin route not found'
    })
})

export default productRoutes