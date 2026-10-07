import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: { type: String, required: true, minlength: [8, "Password must be at least 8 characters"] },
    isAdmin: { type: Boolean, required: true, default: false },
    // Demo accounts are shared by visitors, so they can't modify data.
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Hash the password only when it changed. (The old version called next() and then
// hashed anyway, which re-hashed the hash and locked users out after a profile edit.)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;
