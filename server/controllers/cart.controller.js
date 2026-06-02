import mongoose from "mongoose";
import Product from '../models/Products.js'
import Cart from '../models/Cart.js'

export const addProduct = async (req, res) => {
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

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity: 1 }]
            });
        } else {
            const item = cart.items.find(i => i.product.toString() === productId);
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
                cart.items.push({ product: productId, quantity: 1 });
            }
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated", data: cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const decreaseProduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        if (cart.items[itemIndex].quantity > 1) {
            const product = await Product.findById(productId);
            if (!product) {
                cart.items.splice(itemIndex, 1);

                return res.json({
                    success: true,
                    message: 'Product not found, removed from cart'
                })
            }
            const stock = product.stock;
            if (stock < cart.items[itemIndex].quantity)
                cart.items[itemIndex].quantity = stock;
            else
                cart.items[itemIndex].quantity -= 1;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            data: cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const userId = req.user._id;

        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const cart = await Cart.findOne({ user: userId });


        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== id
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}

export const deleteAllProducts = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Products removed from cart",
            data: cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}

export const orderPlaced = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }
        const data = cart
        cart.items = [];
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Order PLaced Successfully",
            data
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

export const getAllCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched Successfully",
            data: cart
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
