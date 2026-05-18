const express = require('express');
const controller = require('../controllers/mediaController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), upload.single('file'), controller.upload);

module.exports = router;
