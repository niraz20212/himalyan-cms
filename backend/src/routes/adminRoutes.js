const express = require('express');
const controller = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));
router.get('/:resource', controller.list);
router.get('/:resource/:id', controller.getOne);
router.post('/:resource', controller.create);
router.put('/:resource/:id', controller.update);
router.delete('/:resource/:id', controller.remove);

module.exports = router;
