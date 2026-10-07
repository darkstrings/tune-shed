import mongoose from "mongoose";

export const CONDITIONS = ["New", "Like New", "Good", "Fair", "As Is"];

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    condition: { type: String, required: true, enum: CONDITIONS },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0, min: 0 },
    countInStock: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true },
);

productSchema.index({ category: 1 });
// Older records used lowercase conditions ("like new"); normalize to the canonical labels.
productSchema.pre("validate", function () {
  const match = CONDITIONS.find((c) => c.toLowerCase() === String(this.condition ?? "").toLowerCase());
  if (match) this.condition = match;
});

const Product = mongoose.model("Product", productSchema);
export default Product;
