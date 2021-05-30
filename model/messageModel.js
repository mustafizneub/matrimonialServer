const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const message = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    userID:ObjectID
}, {
    timestamps: true
}
)

const conversation = new mongoose.Schema({
    messages: [message],
    roomID:{
        type:String,
        required:true
    },
    from: {
        type: ObjectID,
        required: true
    },
    to: {
        type: ObjectID,
        required: true
    },
    blocked: {
        type: Number,
        required: true,
        default: 0
    }
},
    {
        timestamps: true
    })
    
module.exports = mongoose.model('conversation', conversation)
// module.exports = mongoose.model('message', message)