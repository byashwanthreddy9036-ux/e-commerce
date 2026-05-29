import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(7, "Description must be at least 7 characters"),
    price: z.number().min(1, "Price must be at least 1"),
    category: z.string().min(3, "Category is required"),
    stock: z.number().min(0, "Stock cannot be negative"),
    image: z.string().url("Invalid image URL").optional(),
    brand: z.string().optional(),
    // image: z
    //     .object({
    //         mimetype: z.string(),
    //         size: z.number(),
    //         originalname: z.string(),
    //     })
    //     .optional(),
});