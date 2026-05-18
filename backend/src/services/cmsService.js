const prisma = require('../config/db');
const resources = require('../constants/resources');
const AppError = require('../utils/appError');

const getResourceConfig = (resourceName) => {
  const resource = resources[resourceName];
  if (!resource) {
    throw new AppError(`Unsupported resource: ${resourceName}`, 404);
  }
  return resource;
};

const listResources = async (resourceName) => {
  const resource = getResourceConfig(resourceName);
  return prisma[resource.model].findMany({
    where: { deletedAt: null },
    include: resource.include,
    orderBy: resource.orderBy,
  });
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
  return item;
};

const createResource = async (resourceName, payload) => {
  const resource = getResourceConfig(resourceName);
  return prisma[resource.model].create({ data: payload, include: resource.include });
};

const updateResource = async (resourceName, id, payload) => {
  const resource = getResourceConfig(resourceName);
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
