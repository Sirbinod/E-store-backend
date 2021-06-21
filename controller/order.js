const Order = require("../models/order");
const orderItem = require("../models/orderItem");

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
    req.body.OrderItem.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orserItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemIdsResolved = await orderItemIds;
  const totalPrices = await Promise.all(
    orderItemIdsResolved.map(async (orderItemId) => {
      const orderItem = await orderItem
        .findById(orderItemId)
        .populate("poduct", "price");
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    totalPrice: totalPrice,
    status: req.body.status,
    user: req.body.user,
  });

  order = await order.save();
  if (!order) return res.status(400).send("the order cannot be created!");

  res.send(order);
};

exports.orderDelete = async (req, res) => {
  const _id = req.params.id;

  try {
    const orderDel = await Order.findByIdAndDelete(_id)(async (order) => {
      if (order) {
        await order.orderItem.map(async (OrderItem) => {
          await OrderItem.findByIdAndDelete(orderItem);
        });
        return res
          .status(200)
          .json({succes: true, message: "oreder delete sucess full"});
      } else {
        return res
          .status(404)
          .json({success: false, message: "order not found!"});
      }
    });
  } catch (error) {
    return res.status(500).json({success: false, error});
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
      },
      res.status(200).json({success: true, order})
    );
  } catch (error) {
    res.status(500).json({success: false, error});
  }
};
