import { z } from 'zod'

export const addProductSchema = z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/),

});