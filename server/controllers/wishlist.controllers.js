import mongoose from "mongoose";
import Product from '../models/Products.js'
import Wishlist from '../models/Wishlist.js'

export const addProductWish = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });

        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: userId,
                product: [productId]
            });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            }
        }

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Wishlist updated",
            data: wishlist
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const deleteProductWish = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        const initialLength = wishlist.products.length;

        wishlist.products = wishlist.products.filter(
            productId => productId.toString() !== id
        );

        if (wishlist.products.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });
        }

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            data: wishlist
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const deleteAllProductsWish = async (req, res) => {
    try {
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        wishlist.products = [];

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Products removed from wishlist",
            data: wishlist
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}

export const getAllWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found or empty",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Wishlist fetched Successfully",
            data: wishlist
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
}
