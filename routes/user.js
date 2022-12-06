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
router.get('/profile',userController.userProfile);
router.post('/editName',userController.editName);
router.get('/deleteAddress/:id',userController.deleteAddress);
router.get('/shop',userController.shopGet);
router.get('/singleProduct/:id',userController.singleProduct);
router.get('/cart',userController.cartPage);
router.post('/addToCart',userController.addToCart);
router.get('/wishlist',userController.wishlistPage);
router.post('/addToWishlist',userController.addToWishlist);
// router.use(auth);
router.post('/changeQuantity',userController.changeQuantity);
router.post('/removeFromCart',userController.removeFromCart);
router.post('/applyCoupon',userController.applyCoupon);
router.post('/proceedtoCheckout',userController.proceedtoCheckout);
router.get('/checkout',userController.checkoutPage);
router.post('/newAddress',userController.newAddress);
router.post('/placeOrder',userController.placeOrder);
router.post('/verifyPayment',userController.verifyPayment);
router.get('/orderConfirmationPage',userController.orderConfirmationPage);
router.get('/orders',userController.orderPage);
router.get('/viewProducts/:id',userController.viewProducts);
router.get('/logout',userController.userLogout);

module.exports = router;