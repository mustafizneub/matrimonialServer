const mongoose = require('mongoose');

const transaction = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    customer_name:{
        type:String,
        required:true
    },
    contact_number:{
        type:String,
        required:true
    },
    transaction_id:{
        type:String,
        required:true
    },
    voucher_code:{
        type:String,
        required:true
    },
    userID:{
        type:String,
        required:true
    }
},{
    timestamps:true
}
)

module.exports = mongoose.model('transactions', transaction)