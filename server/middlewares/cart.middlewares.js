import { addProductSchema } from "../validators/validators.cart.js";

export const validateAddProduct = (req, res, next) => {
  const parsed = addProductSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  req.body = parsed.data;
  next();
};