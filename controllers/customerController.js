const customers = require('../models/userModel');
const mongoose = require('mongoose');

let customersDetails;
let Block;

module.exports = {
    customersGet: async (req,res) => {
        customersDetails = await customers.find({}).lean();
        res.render('admin/customers',{ data:customersDetails,admin: true });
    },

    blockCustomer: async (req,res) => {
        const { id } = req.params;
        const customerId = mongoose.Types.ObjectId(id);
        const customer = await customers.findById(customerId);
        const blockStatus = customer.Block;
        if(blockStatus){
            await customers.findByIdAndUpdate(id,{$set:{Block:false}});
        }else{
            await customers.findByIdAndUpdate(id,{$set:{Block:true}})
        }
        res.redirect('/admin/customers');
    }
}