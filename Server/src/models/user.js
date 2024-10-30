import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Customer", "Admin", "DeliveryPartner"],
    required: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
});

const CustomerSchema = new mongoose.Schema({
  ...UserSchema.obj,
  phone: { type: Number, required: true, unique: true },
  role: {
    type: String,
    enum: ["Customer"],
    default: "Customer",
  },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: { type: String },
});

const DeliveryPartnerSchema = new mongoose.Schema({
  ...UserSchema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  role: {
    type: String,
    enum: ["DeliveryPartner"],
    default: "DeliveryPartner",
  },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: { type: String },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
});

DeliveryPartnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});
DeliveryPartnerSchema.methods.comparePassword = async function (enteredPass) {
  const res = await bcryptjs.compare(enteredPass, this.password);
  return res;
};

const AdminSchema = new mongoose.Schema({
  ...UserSchema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin"],
    default: "Admin",
  },
});
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});
//Compare Password -->
AdminSchema.methods.comparePassword = async function (enteredPass) {
  const res = await bcryptjs.compare(enteredPass, this.password);
  return res;
};

export const Customer = mongoose.model("Customer", CustomerSchema);
export const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  DeliveryPartnerSchema
);
export const Admin = mongoose.model("Admin", AdminSchema);
