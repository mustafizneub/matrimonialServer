const mongoose = require('mongoose');

// set your database string below empty string
var url = 'mongodb+srv://mustafiz:Pbv8X9gN8HJXr2eG@cluster0.hs2w0.mongodb.net/test'
const connectDB = async ()=>{
    await mongoose.connect(url,{useUnifiedTopology:true, useNewUrlParser:true}).then(value=>{
        console.log('connected')
    })
}

module.exports = connectDB;