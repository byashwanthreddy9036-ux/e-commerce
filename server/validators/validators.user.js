import { z } from "zod";

export const registerUserSchema = z.object({
    fullname: z.string().min(3, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().regex(/^\+[1-9]\d{7,14}$/, "Phone must include country code e.g. +919876543210"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    fullname: z.string().min(3, "Name is required"),
})