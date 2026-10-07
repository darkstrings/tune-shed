import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { calcPrices } from "../utils/calcPrices.js";
import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";

const canSee = (user, order) => user.isAdmin || String(order.user?._id ?? order.user) === String(user._id);

// @desc    Create new order (prices and stock come from the database, never the client)
// @route   POST /api/orders
// @access  Private
export async function addOrderItems(req, res) {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const ids = orderItems.map((x) => x._id);
  const itemsFromDB = await Product.find({ _id: { $in: ids } });

  const dbOrderItems = orderItems.map((item) => {
    const product = itemsFromDB.find((p) => p._id.toString() === String(item._id));
    const qty = Math.floor(Number(item.qty));
    if (!product) {
      res.status(400);
      throw new Error("A product in your cart is no longer available");
    }
    if (!(qty >= 1) || qty > product.countInStock) {
      res.status(400);
      throw new Error(`Only ${product.countInStock} of "${product.name}" left in stock`);
    }
    return { name: product.name, image: product.image, price: product.price, qty, product: product._id };
  });

  const prices = calcPrices(dbOrderItems);
  const order = await Order.create({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod: paymentMethod || "PayPal",
    ...prices,
  });
  res.status(201).json(order);
}

// @desc    Logged-in user's orders
// @route   GET /api/orders/mine
// @access  Private
export async function getMyOrders(req, res) {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
}

// @desc    Get order by id (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
export async function getOrderById(req, res) {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  // 404 rather than 403 so order ids can't be probed.
  if (!order || !canSee(req.user, order)) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json(order);
}

// @desc    Mark order paid after verifying the payment with PayPal
// @route   PUT /api/orders/:id/pay
// @access  Private
export async function updateOrderToPaid(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order || !canSee(req.user, order)) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  if (!req.body?.id) {
    res.status(400);
    throw new Error("Missing PayPal transaction id");
  }
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) {
    res.status(400);
    throw new Error("Payment not verified");
  }
  if (!(await checkIfNewTransaction(Order, req.body.id))) {
    res.status(400);
    throw new Error("Transaction has been used before");
  }
  // Compare as cents: "1150.00" from PayPal must equal 1150 stored in the database.
  if (Math.round(Number(value) * 100) !== Math.round(order.totalPrice * 100)) {
    res.status(400);
    throw new Error("Incorrect amount paid");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address,
  };
  const updated = await order.save();

  // Take the sold items out of stock.
  await Product.bulkWrite(
    order.orderItems.map((item) => ({
      updateOne: { filter: { _id: item.product }, update: { $inc: { countInStock: -item.qty } } },
    })),
  );
  await Product.updateMany({ countInStock: { $lt: 0 } }, { $set: { countInStock: 0 } });

  res.json(updated);
}

// @desc    Mark order delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export async function updateOrderToDelivered(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (!order.isPaid) {
    res.status(400);
    throw new Error("Only paid orders can be marked as delivered");
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  res.json(await order.save());
}

// @desc    All orders
// @route   GET /api/orders
// @access  Private/Admin
export async function getOrders(req, res) {
  res.json(await Order.find({}).populate("user", "id name").sort({ createdAt: -1 }));
}

// @desc    Store overview for the admin dashboard
// @route   GET /api/orders/summary
// @access  Private/Admin
export async function getSummary(req, res) {
  const [orders, products, users] = await Promise.all([
    Order.find({}).select("totalPrice isPaid isDelivered createdAt"),
    Product.find({}).select("name countInStock image price"),
    User.countDocuments(),
  ]);
  const paid = orders.filter((o) => o.isPaid);
  res.json({
    revenue: paid.reduce((sum, o) => sum + o.totalPrice, 0),
    orders: orders.length,
    paidOrders: paid.length,
    toShip: paid.filter((o) => !o.isDelivered).length,
    products: products.length,
    users,
    lowStock: products
      .filter((p) => p.countInStock <= 1)
      .map((p) => ({ _id: p._id, name: p.name, image: p.image, countInStock: p.countInStock })),
  });
}
