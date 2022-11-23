const express = require('express');
const router = express.Router();
const auth = require('../middlewares/customerAuth');
const userController = require('../controllers/userController');

router.get('/',userController.homeGet);
router.get('/login',userController.loginGet);
router.post('/login',userController.loginPost);
router.get('/signup',userController.signupGet);
router.post('/signup',userController.signupPost);
router.get('/otpPage',userController.otpPageGet);
router.post('/otpPage',userController.otpPost);
router.get('/shop',userController.shopGet);
router.get('/singleProduct/:id',userController.singleProduct);

router.get('/cart',userController.cartPage);
router.get('/addToCart/:id',userController.addToCart);
router.get('/wishlist',userController.wishlistPage);
router.post('/addToWishlist',userController.addToWishlist);
router.get('/checkout',userController.checkoutPage);

router.get('/logout',userController.userLogout);

module.exports = router;