import Product from "../models/Products.js";
import { createProductSchema } from "../validators/validators.product.js";

export const createProductMiddleware = async (req, res, next) => {
    try {
        const parsed = createProductSchema.safeParse({
            ...req.body,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
        });

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const { name, description, price, category, stock, image, brand } =
            parsed.data;

        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: "Product with name already exists",
            });
        }

        const newProd = {
            name,
            description,
            price,
            category,
            stock,
        };

        if (image) newProd.image = image;
        if (brand) newProd.brand = brand;

        req.prodData = newProd;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};