import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            required: true,
            enum: ['user', 'admin'],
            default: 'user'
        },

        status: {
            type: String,
            required: true,
            enum: ['active', 'disabled', 'banned'],
            default: 'active'
        },
        tokens: {
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
        },
        verified: {
            email: {
                type: Boolean,
                default: false
            },
            phone: {
                type: Boolean,
                default: false
            },
        },
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)

export default User