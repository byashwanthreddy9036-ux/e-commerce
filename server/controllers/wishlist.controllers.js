import mongoose from "mongoose";
import Product from '../models/Products.js'
import Wishlist from '../models/Wishlist.js'

export const addProductWish = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

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
        if (product.stock < 1)
            return res.status(400).json({
                success: false,
                message: "Product out of stock"
            });

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: userId,
                items: [{ product: productId, quantity: 1 }]
            });
        } else {
            const item = wishlist.items.find(i => i.product.toString() === productId);
            if (item) {
                if (item.quantity >= 10)
                    return res.status(400).json({
                        success: false,
                        message: "Max 10 items allowed"
                    });
                if (item.quantity >= product.stock)
                    return res.status(400).json({
                        success: false,
                        message: `Only ${product.stock} items available`
                    });

                item.quantity += 1;
            } else {
                wishlist.items.push({ product: productId, quantity: 1 });
            }
        }

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Wishlist updated", data: wishlist
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const decreaseProductWish = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
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

        const itemIndex = wishlist.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });
        }

        if (wishlist.items[itemIndex].quantity > 1) {
            const product = await Product.findById(productId);
            if (!product) {
                wishlist.items.splice(itemIndex, 1);

                return res.json({
                    success: true,
                    message: 'Product not found, removed from wishlist'
                })
            }
            const stock = product.stock;
            if (stock < wishlist.items[itemIndex].quantity)
                wishlist.items[itemIndex].quantity = stock;
            else
                wishlist.items[itemIndex].quantity -= 1;
        } else {
            wishlist.items.splice(itemIndex, 1);
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

        const { id } = req.params

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

        wishlist.items = wishlist.items.filter(
            item => item.product.toString() !== id
        );

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}

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

        wishlist.items = [];

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
                message: "Wishlist not found"
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
            data
        });

    }
}
