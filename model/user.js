const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    fname:{
        type:String,
    },
    lname:{
        type:String,
    },
    gender:{
        type:String,
    },
    interest:{
        type:String,
    },
    location:{
        type:String,
    },
    mobile:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    }
},{
    timestamps:true
})
module.exports = mongoose.model("User",userSchema);