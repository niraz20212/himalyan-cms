const prisma = require('../config/db');
const AppError = require('../utils/appError');

const orderInclude = {
  user: true,
  product: {
    include: {
      category: true,
      images: { include: { media: true } },
    },
  },
};

const createOrder = async (userId, payload) => {
  const product = await prisma.product.findUnique({
    where: { id: payload.productId },
    select: { id: true, published: true, deletedAt: true },
  });

  if (!product || product.deletedAt || !product.published) {
    throw new AppError('Selected product is not available', 404);
  }

  return prisma.order.create({
    data: {
      userId,
      productId: payload.productId,
      orderType: payload.orderType || 'RETAIL',
      quantity: payload.quantity || null,
      shippingAddress: payload.shippingAddress,
      country: payload.country || null,
      phone: payload.phone || null,
      notes: payload.notes || null,
    },
    include: orderInclude,
  });
};

const listMyOrders = async (userId) =>
  prisma.order.findMany({
    where: { userId, deletedAt: null },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });

const getMyOrder = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId, deletedAt: null },
    include: orderInclude,
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return order;
};

module.exports = { createOrder, listMyOrders, getMyOrder };
