const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  shippingAddress1: {
    type: String,
    required: true,
  },
  shippingAddress2: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtual: true,
});

module.exports = mongoose.model("Order", orderSchema);

// {
//   "orderItems" : [
//       {
//           "quantity": 3,
//           "product" : "5fcfc406ae79b0a6a90d2585"
//       },
//       {
//           "quantity": 2,
//           "product" : "5fd293c7d3abe7295b1403c4"
//       }
//   ],
//   "shippingAddress1" : "Flowers Street , 45",
//   "shippingAddress2" : "1-B",
//   "status":"Allowed",
//   "user": "5fd51bc7e39ba856244a3b44"

// }
