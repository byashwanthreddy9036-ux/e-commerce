import Product from '../models/Products.js'

export const createProductMiddleware = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.json({
                success: false,
                message: 'Body is required(!name || !description || !price || !category || !stock)'
            })
        }


        const { name, description, price, category, stock } = req.body

        if (!name || !description || !price || !category || stock == null || stock < 0) {
            return res.json({
                success: false,
                message: 'Description, price, category, stock are required'
            })
        }

        const exisitingProduct = await Product.findOne({ name })

        if (exisitingProduct) {
            return res.json({
                success: false,
                message: 'Product with name already exists'
            })
        }
        const newProd = { name, description, price, category, stock }
        if (req.body.image) newProd.image = req.body.image
        if (req.body.brand) newProd.brand = req.body.brand
        req.prodData = newProd
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}