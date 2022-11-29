const express = require('express');
const router = express.Router();
const auth = require('../middlewares/adminAuth');
const adminController = require('../controllers/adminController');
const customerController = require('../controllers/customerController');
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const couponController = require('../controllers/couponController');
const upload = require('../middlewares/multer');

router.get('/',adminController.loginGet);
router.post('/adminLogin',adminController.loginPost);

router.use(auth);

router.get('/customers',customerController.customersGet);
router.get('/blockCustomer/:id',customerController.blockCustomer);

router.get('/products',productController.productsGet);
router.post('/products',upload.single('image'),productController.addProductPost);
router.get('/productEdit/:id',productController.productEditGet);
router.post('/productEdit/:id',productController.productEditPost);
router.get('/productDisable/:id',productController.disableProduct);
router.get('/productEnable/:id',productController.enableProduct);

router.get('/categories',categoryController.categoryGet);
router.post('/categories',categoryController.addCategoryPost);
router.get('/categoryEdit/:id',categoryController.categoryEditGet);
router.post('/categoryEdit/:id',categoryController.categoryEditPost);
router.get('/categoryDisable/:id',categoryController.disableCategory);
router.get('/categoryEnable/:id',categoryController.enableCategory);

router.get('/coupons',couponController.couponPage);
router.post('/coupons',couponController.addCouponPost);
router.get('/couponEdit/:id',couponController.couponEditPage);
router.post('/couponEdit/:id',couponController.couponEditPost);
router.post('/disableOrEnable',couponController.disableOrEnable);

router.get('/adminLogout',adminController.adminLogout);

module.exports = router;