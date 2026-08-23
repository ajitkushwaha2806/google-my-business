import mongoose, { Schema, Types, models, model } from "mongoose";

const ORDER_STATUS = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PLACED: "PLACED",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  PICKED_UP: "PICKED_UP",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED"
};

const ORDER_TYPES = ["dine-in", "takeaway", "online"];
const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"];
const PAYMENT_METHODS = ["cash", "card", "upi", "online"];

const OrderItemSchema = new Schema({
  menuItem: {
    type: Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true }, 
  
  variant: {
    name: { type: String },
    price: { type: Number, default: 0 }, 
  },
  
  addons: [{
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }
  }],
  
  specialInstructions: { type: String, default: "" },
  totalPrice: { type: Number, required: true }
});

const OrderSchema = new Schema({
  restaurant: {
    type: Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true,
  },
  orderNumber: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  orderType: {
    type: String,
    enum: ORDER_TYPES,
    required: true,
    index: true,
  },
  table: {
    type: Types.ObjectId,
    ref: "Table",
    required: function() { return this.orderType === "dine-in"; },
  },
  customer: {
    type: Types.ObjectId,
    ref: "User",
    index: true,
  },
  
  items: [OrderItemSchema],
  
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING_PAYMENT,
    index: true,
  },
  
  statusHistory: [{
    status: { type: String, enum: Object.values(ORDER_STATUS), required: true },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: Types.ObjectId, ref: "Staff", default: null }
  }],
  
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  
  paymentStatus: {
    type: String,
    enum: PAYMENT_STATUSES,
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: PAYMENT_METHODS,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

OrderSchema.pre('save', function(next) {
  if (this.isModified('subtotal') || this.isModified('tax') || this.isModified('discount')) {
    this.totalAmount = this.subtotal + this.tax - this.discount;
  }
  next();
});

export const OrderStatus = ORDER_STATUS;
export default models.Order || model("Order", OrderSchema);
