const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

exports.orderList = async (req, res) => {
  try {
    const listOrder = await Order.find()
      .populate("user", "name")
      .sort({dateOrdered: -1});
    res.status(200).json({success: false, order: listOrder});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};

exports.orderListById = async (req, res) => {
  const _id = req.params.id;
  try {
    const order = await Order.findById(_id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      });
    res.status(200).json({success: true, data: order});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};

exports.orderCreate = async (req, res) => {
  const orderItemIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemIdsResolved = await orderItemIds;
  const totalPrices = await Promise.all(
    orderItemIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "poduct",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    totalPrice: totalPrice,
    status: req.body.status,
    user: req.body.user,
  });

  order = await order.save();
  if (!order) return res.status(400).send("the order cannot be created!");

  res.status(200).json({success: true, order});
};

exports.orderDelete = async (req, res) => {
  const _id = req.params.id;
  try {
    const order = await Order.findById(_id);
    if (!order) {
      res.json("no order");
    }
    order.orderItems.forEach(async (e) => {
      console.log(await OrderItem.findByIdAndDelete(e));
    });
    await Order.findByIdAndDelete(_id);
    res.json("okkkkk");
  } catch (error) {
    res.status(500).json({success: false, error});
    console.log(error);
  }
};

exports.orderUpdate = async (req, res) => {
  const _id = req.params.id;
  try {
    const order = await Order.findByIdAndUpdate(
      _id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );
    res.status(200).json({success: true, order});
  } catch (error) {
    res.status(500).json({success: false, error});
    console.log(error);
  }
};

exports.orderCount = async (req, res) => {
  try {
    const countOrder = await Order.countDocuments((count) => count);
    res.status(200).json({success: true, countOrder});
  } catch (error) {
    res.status(500).json({success: false, error});
  }
};

exports.totalSales = async (req, res) => {
  try {
    const totalSale = await Order.aggregate([
      {$group: {_id: nill, totalSale: {$sum: "$totalPrice"}}},
    ]);
    res.status(200).json({success: true, totalSale});
  } catch (error) {
    res.status(500).json({success: false, error});
  }
};
