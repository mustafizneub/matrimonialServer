const mongoose = require('mongoose');

const contact = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contact_number:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    city:{
        type:String
    },
    message:{
        type:String,
        required:true
    }

},{
    timestamps:true
})

module.exports = mongoose.model('enquiry', contact)