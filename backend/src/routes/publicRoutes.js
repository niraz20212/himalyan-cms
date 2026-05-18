const express = require('express');
const controller = require('../controllers/publicController');
const inquiryController = require('../controllers/inquiryController');
const validate = require('../middlewares/validateMiddleware');
const { inquiryValidator } = require('../validators/inquiryValidator');

const router = express.Router();

router.get('/home', controller.home);
router.get('/products', controller.products);
router.get('/products/:slug', controller.productBySlug);
router.get('/blogs', controller.blogs);
router.get('/blogs/:slug', controller.blogBySlug);
router.get('/pages/:slug', controller.pageBySlug);
router.get('/sitemap.xml', controller.sitemap);
router.post('/inquiries', inquiryValidator, validate, inquiryController.createInquiry);

module.exports = router;
