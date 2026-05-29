import Product from '../models/Products.js'

export const createProduct = async (req, res) => {
    try {
        const prodData = req.prodData
        await Product.create(prodData)
        return res.json({
            success: true,
            message: 'Product added to DB',
            data: prodData
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}