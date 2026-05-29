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

export const updateProduct = async (req, res) => {
    try {
        const { id, prodData } = req;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            prodData,
            {
                returnDocument: "after", runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};