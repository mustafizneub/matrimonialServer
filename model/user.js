const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    interest: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    religion: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    age:{
        type:Number,
        default:0
    },
    email: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true
    },
    userID:ObjectID
}, {
    timestamps: true,
})
module.exports = mongoose.model("users", userSchema);