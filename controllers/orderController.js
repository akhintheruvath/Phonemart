const orders = require('../models/orderModel');

module.exports = {
    orderManagementPage: async (req,res) => {
        const allOrders = await orders.aggregate([{
            $project:{
                orderDetails:{
                    $filter:{
                        input: '$orderDetails',
                        as: 'orderDetails',
                        cond: {}
                    }
                },
                _id:0
            }
        }]);
        res.render('admin/orderManagement',{ admin:true,allOrders });
    },

    orderedProductDetails: async (req,res) => {
        const orderId = req.params.id;
        let productDetails = (await orders.findOne({'orderDetails._id':orderId},{orderDetails:{$elemMatch:{_id:orderId}}}).populate('orderDetails.orderItems.productId').lean()).orderDetails[0];
        let data = productDetails;
        productDetails = productDetails.orderItems;
        res.render('admin/orderedProducts',{ admin:true,productDetails,data });
    },

    changeOrderStatus:async(req,res) => {
        let status = req.body.orderStatus;
        let orderId = req.body.orderId;
        try {
            await orders.updateOne({orderDetails:{$elemMatch:{_id:orderId}}},{'orderDetails.$.status':status})
        } catch (error) {
            console.log(error.message);
        }
    }
}