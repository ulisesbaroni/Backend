import mongoose from "mongoose";

const collection = "products";

const schema = new mongoose.Schema(
  {
    title: String,
    description: String,
    thumbnail: Array,
    code: String,
    price: Number,
    status: Boolean,
    category: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const productModel = mongoose.model(collection, schema);

export default productModel;