const catchAsync = require('../utils/catchAsync');
const cmsService = require('../services/cmsService');

const list = catchAsync(async (req, res) => {
  const data = await cmsService.listResources(req.params.resource);
  res.json({ success: true, data });
});

const getOne = catchAsync(async (req, res) => {
  const data = await cmsService.getResource(req.params.resource, req.params.id);
  res.json({ success: true, data });
});

const create = catchAsync(async (req, res) => {
  const data = await cmsService.createResource(req.params.resource, req.body);
  res.status(201).json({ success: true, data });
});

const update = catchAsync(async (req, res) => {
  const data = await cmsService.updateResource(req.params.resource, req.params.id, req.body);
  res.json({ success: true, data });
});

const remove = catchAsync(async (req, res) => {
  await cmsService.softDeleteResource(req.params.resource, req.params.id);
  res.json({ success: true, message: 'Deleted successfully' });
});

module.exports = { list, getOne, create, update, remove };
