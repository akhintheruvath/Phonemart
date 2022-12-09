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
router.post('')
router.get('/singleProduct/:id',userController.singleProduct);
router.get('/profile',auth,userController.userProfile);
router.post('/editName',auth,userController.editName);
router.get('/deleteAddress/:id',auth,userController.deleteAddress);
router.get('/cart',auth,userController.cartPage);
router.post('/addToCart',userController.addToCart);
router.get('/wishlist',auth,userController.wishlistPage);
router.post('/addToWishlist',auth,userController.addToWishlist);
router.post('/changeQuantity',auth,userController.changeQuantity);
router.post('/removeFromCart',auth,userController.removeFromCart);
router.post('/applyCoupon',auth,userController.applyCoupon);
router.post('/proceedtoCheckout',auth,userController.proceedtoCheckout);
router.get('/checkout',auth,userController.checkoutPage);
router.post('/newAddress',auth,userController.newAddress);
router.post('/placeOrder',auth,userController.placeOrder);
router.post('/verifyPayment',auth,userController.verifyPayment);
router.get('/orderConfirmationPage',auth,userController.orderConfirmationPage);
router.get('/orders',auth,userController.orderPage);
router.get('/viewProducts/:id',auth,userController.viewProducts);
router.get('/logout',userController.userLogout);

module.exports = router;