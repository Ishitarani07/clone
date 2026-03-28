import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  fileId: { type: String },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    specifications: { type: Map, of: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [imageSchema],
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ categoryId: 1, finalPrice: 1 });
productSchema.index({ title: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
