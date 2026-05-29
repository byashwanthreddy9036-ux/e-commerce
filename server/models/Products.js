import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min:1
    },

    category: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
      min:0
    },

    image: {
      type: String,
    },

    brand: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model('Product', productSchema)

export default Product