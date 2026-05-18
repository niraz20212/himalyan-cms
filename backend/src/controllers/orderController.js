const catchAsync = require('../utils/catchAsync');
const orderService = require('../services/orderService');

const createOrder = catchAsync(async (req, res) => {
  const data = await orderService.createOrder(req.user.id, req.body);
  res.status(201).json({ success: true, data });
});

const listMyOrders = catchAsync(async (req, res) => {
  const data = await orderService.listMyOrders(req.user.id);
  res.json({ success: true, data });
});

const getMyOrder = catchAsync(async (req, res) => {
  const data = await orderService.getMyOrder(req.user.id, req.params.id);
  res.json({ success: true, data });
});

module.exports = { createOrder, listMyOrders, getMyOrder };
