import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin, isDemo: Boolean(u.isDemo) });

// @desc    Sign in & set auth cookie
// @route   POST /api/users/auth
// @access  Public
export async function authUser(req, res) {
  const email = String(req.body.email ?? "").toLowerCase().trim();
  const password = String(req.body.password ?? "");
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  generateToken(res, user._id);
  res.json(publicUser(user));
}

// @desc    Register
// @route   POST /api/users
// @access  Public
export async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (await User.exists({ email: String(email ?? "").toLowerCase().trim() })) {
    res.status(400);
    throw new Error("An account with that email already exists");
  }
  const user = await User.create({ name, email, password });
  generateToken(res, user._id);
  res.status(201).json(publicUser(user));
}

// @desc    Sign out / clear cookie
// @route   POST /api/users/logout
// @access  Public
export function logoutUser(req, res) {
  res.clearCookie("jwt", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV !== "development" });
  res.json({ message: "Logged out successfully" });
}

// @desc    Current user's profile
// @route   GET /api/users/profile
// @access  Private
export function getUserProfile(req, res) {
  res.json(publicUser(req.user));
}

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private (not demo)
export async function updateUserProfile(req, res) {
  const user = await User.findById(req.user._id);
  const email = req.body.email?.toLowerCase().trim();

  if (email && email !== user.email && (await User.exists({ email }))) {
    res.status(400);
    throw new Error("That email is already in use");
  }
  user.name = req.body.name || user.name;
  user.email = email || user.email;
  if (req.body.password) user.password = req.body.password;

  res.json(publicUser(await user.save()));
}

// @desc    All users
// @route   GET /api/users
// @access  Private/Admin
export async function getUsers(req, res) {
  res.json(await User.find({}).select("-password").sort({ createdAt: -1 }));
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export async function deleteUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error("Admin users can't be deleted");
  }
  await user.deleteOne();
  res.json({ message: "User removed" });
}

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
export async function getUserById(req, res) {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export async function updateUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const email = req.body.email?.toLowerCase().trim();
  if (email && email !== user.email && (await User.exists({ email }))) {
    res.status(400);
    throw new Error("That email is already in use");
  }
  if (String(user._id) === String(req.user._id) && req.body.isAdmin === false) {
    res.status(400);
    throw new Error("You can't remove your own admin access");
  }
  user.name = req.body.name || user.name;
  user.email = email || user.email;
  if (req.body.isAdmin !== undefined) user.isAdmin = Boolean(req.body.isAdmin);
  res.json(publicUser(await user.save()));
}
