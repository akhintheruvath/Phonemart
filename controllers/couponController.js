const coupons = require('../models/couponModel');

module.exports = {
    couponPage: async (req,res) => {
        let couponDetails = await coupons.find({}).lean()
        res.render('admin/couponManagement',{ admin:true,data:couponDetails });
    },

    addCouponPost: async (req,res) => {
        try {
            let c = new coupons({
                couponCode: req.body.couponCode,
                discountPercentage: req.body.discount,
            })
            await c.save();
            res.redirect('/admin/coupons');
        } catch (error) {
            console.log(error.message);
        }
    },

    couponEditPage: async (req,res) => {
        const { id } = req.params;
        const datas = await coupons.findById(id).lean();
        res.render('admin/editCoupon',{ datas });
    },

    couponEditPost: async (req,res) => {
        try {
            const { id } = req.params;
            const { couponCode,discountPercentage } = req.body;
            await coupons.findByIdAndUpdate(id, { $set: { couponCode,discountPercentage }});
            couponDetails = await coupons.find({}).lean();
            res.redirect('/admin/coupons');
        } catch (error) {
            res.send(error.message);
        }
    },

    disableOrEnable: async (req,res) => {
        const { couponId } = req.body;
        const coupon = await coupons.findById(couponId);
        console.log(coupon);
        const couponStatus = coupon.Disable;
        console.log(couponStatus);
        if(couponStatus){
            await coupons.findByIdAndUpdate(couponId,{$set:{Disable:false}}).then(response => {
                res.json({ status:false });
            });
        }else{
            await coupons.findByIdAndUpdate(couponId,{$set:{Disable:true}}).then(response => {
                res.json({ status:true });
            });
        }
    },
}