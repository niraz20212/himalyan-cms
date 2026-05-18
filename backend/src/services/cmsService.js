const prisma = require('../config/db');
const resources = require('../constants/resources');
const AppError = require('../utils/appError');
const { normalizeMediaStorageValue, serializeProduct } = require('../utils/media');

const getResourceConfig = (resourceName) => {
  const resource = resources[resourceName];
  if (!resource) {
    throw new AppError(`Unsupported resource: ${resourceName}`, 404);
  }
  return resource;
};

const hydrateResponse = (resourceName, item) => {
  if (resourceName !== 'products') {
    return item;
  }

  if (Array.isArray(item)) {
    return item.map(serializeProduct);
  }

  return serializeProduct(item);
};

const upsertProductPrimaryImage = async (productId, imageUrl) => {
  if (!imageUrl) {
    return;
  }
  const normalizedImageUrl = normalizeMediaStorageValue(imageUrl);

  const existingPrimary = await prisma.productImage.findFirst({
    where: { productId, isPrimary: true },
    include: { media: true },
  });

  if (existingPrimary?.media) {
    await prisma.media.update({
      where: { id: existingPrimary.media.id },
      data: {
        url: normalizedImageUrl,
        name: existingPrimary.media.name || 'Product image',
        altText: existingPrimary.media.altText || 'Product image',
      },
    });
    return;
  }

  const media = await prisma.media.create({
    data: {
      name: 'Product image',
      url: normalizedImageUrl,
      altText: 'Product image',
    },
  });

  await prisma.productImage.create({
    data: {
      productId,
      mediaId: media.id,
      isPrimary: true,
      sortOrder: 0,
    },
  });
};

const listResources = async (resourceName) => {
  const resource = getResourceConfig(resourceName);
  const items = await prisma[resource.model].findMany({
    where: { deletedAt: null },
    include: resource.include,
    orderBy: resource.orderBy,
  });
  return hydrateResponse(resourceName, items);
};

const getResource = async (resourceName, id) => {
  const resource = getResourceConfig(resourceName);
  const item = await prisma[resource.model].findUnique({
    where: { id },
    include: resource.include,
  });
  if (!item || item.deletedAt) {
    throw new AppError('Resource not found', 404);
  }
  return hydrateResponse(resourceName, item);
};

const createResource = async (resourceName, payload) => {
  const resource = getResourceConfig(resourceName);
  if (resourceName === 'products') {
    const { imageUrl, ...productPayload } = payload;
    const item = await prisma[resource.model].create({ data: productPayload, include: resource.include });
    await upsertProductPrimaryImage(item.id, imageUrl);
    const freshItem = await prisma[resource.model].findUnique({
      where: { id: item.id },
      include: resource.include,
    });
    return hydrateResponse(resourceName, freshItem);
  }

  return prisma[resource.model].create({ data: payload, include: resource.include });
};

const updateResource = async (resourceName, id, payload) => {
  const resource = getResourceConfig(resourceName);
  if (resourceName === 'products') {
    const { imageUrl, ...productPayload } = payload;
    const item = await prisma[resource.model].update({
      where: { id },
      data: productPayload,
      include: resource.include,
    });
    await upsertProductPrimaryImage(id, imageUrl);
    const freshItem = await prisma[resource.model].findUnique({
      where: { id: item.id },
      include: resource.include,
    });
    return hydrateResponse(resourceName, freshItem);
  }

  return prisma[resource.model].update({
    where: { id },
    data: payload,
    include: resource.include,
  });
};

const softDeleteResource = async (resourceName, id) => {
  const resource = getResourceConfig(resourceName);
  return prisma[resource.model].update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

module.exports = {
  listResources,
  getResource,
  createResource,
  updateResource,
  softDeleteResource,
};
