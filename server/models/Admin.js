import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            required: true,
            enum: ['user', 'admin'],
            default: 'admin'
        },

        tokens: {
            email: {
                type: String
            },
        },

        verified: {
            email: {
                type: Boolean,
                default: true
            },
        },
    },
    {
        timestamps: true
    }
)

const Admin = mongoose.model('Admin', adminSchema)

export default Admin