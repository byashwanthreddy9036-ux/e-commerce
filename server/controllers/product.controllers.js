import Product from '../models/Products.js'
import mongoose from 'mongoose'

export const createProduct = async (req, res) => {
    try {
        const prodData = req.prodData
        const prod = await Product.create(prodData)
        return res.status(201).json({
            success: true,
            message: 'Product added to DB',
            data: prod
        })
    } catch (error) {
        return res.status(500).json({
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
            { $set: prodData },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

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

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Provide valid ID",
            });
        }

        const existingProduct = await Product.findByIdAndDelete(id)

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'No product associated with the ID'
            })
        }
        return res.json({
            success: true,
            message: 'Product deleted successfully',
            data: existingProduct
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments();

        return res.json({
            success: true,
            message: 'Products fetched successfully',
            data: products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getProductByID = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Provide valid ID",
            });
        }

        const existingProduct = await Product.findById(id)

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'No product associated with the ID'
            })
        }
        return res.json({
            success: true,
            message: 'Product fetched successfully',
            data: existingProduct
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}