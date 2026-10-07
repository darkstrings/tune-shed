import Product, { CONDITIONS } from "../models/productModel.js";
import { escapeRegex } from "../utils/escapeRegex.js";

const PAGE_SIZE = Number(process.env.PAGINATION_LIMIT) || 8;

const SORTS = {
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1, numReviews: -1 },
};

// @desc    Fetch products (search, filter, sort, paginate)
// @route   GET /api/products?keyword=&category=&condition=&sort=&pageNumber=
// @access  Public
export async function getProducts(req, res) {
  const { keyword, category, condition, sort } = req.query;
  const page = Math.max(1, Number(req.query.pageNumber) || 1);
  const pageSize = Math.min(48, Number(req.query.pageSize) || PAGE_SIZE);

  const filter = {};
  if (keyword?.trim()) {
    const rx = new RegExp(escapeRegex(keyword.trim().slice(0, 80)), "i");
    filter.$or = [{ name: rx }, { brand: rx }, { category: rx }];
  }
  if (category) filter.category = String(category);
  if (condition) filter.condition = new RegExp(`^${escapeRegex(condition)}$`, "i");

  const [count, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .select("-reviews")
      .sort({ ...(SORTS[sort] ?? SORTS.newest), _id: 1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1)),
  ]);

  res.json({ products, page, pages: Math.max(1, Math.ceil(count / pageSize)), count });
}

// @desc    Categories, brands and conditions in the catalog (for filters)
// @route   GET /api/products/filters
// @access  Public
export async function getFilters(req, res) {
  const products = await Product.find({}).select("category brand condition");
  const tally = (key) =>
    Object.entries(
      products.reduce((acc, p) => {
        const value = p[key];
        if (value) acc[value] = (acc[value] ?? 0) + 1;
        return acc;
      }, {}),
    )
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

  res.json({ categories: tally("category"), brands: tally("brand"), conditions: CONDITIONS });
}

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
}

// @desc    Create a product (draft the admin then edits)
// @route   POST /api/products
// @access  Private/Admin
export async function createProduct(req, res) {
  const product = await Product.create({
    name: "New guitar",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Brand",
    category: "Electric Guitars",
    countInStock: 1,
    numReviews: 0,
    condition: "New",
    description: "Describe this instrument…",
  });
  res.status(201).json(product);
}

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const fields = ["name", "price", "description", "image", "brand", "category", "countInStock", "condition"];
  for (const field of fields) {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  }
  res.json(await product.save());
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export async function deleteProduct(req, res) {
  const result = await Product.deleteOne({ _id: req.params.id });
  if (!result.deletedCount) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ message: "Product removed" });
}

// @desc    Create a review
// @route   POST /api/products/:id/reviews
// @access  Private
export async function createProductReview(req, res) {
  const rating = Number(req.body.rating);
  const comment = String(req.body.comment ?? "").trim();
  if (!(rating >= 1 && rating <= 5) || !comment) {
    res.status(400);
    throw new Error("Please give a rating from 1 to 5 and a comment");
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.reviews.some((r) => r.user.toString() === req.user._id.toString())) {
    res.status(400);
    throw new Error("You've already reviewed this product");
  }

  product.reviews.push({ name: req.user.name, rating, comment, user: req.user._id });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: "Review added" });
}

// @desc    Top rated products
// @route   GET /api/products/top
// @access  Public
export async function getTopProducts(req, res) {
  const products = await Product.find({}).select("-reviews").sort({ rating: -1, numReviews: -1 }).limit(3);
  res.json(products);
}
