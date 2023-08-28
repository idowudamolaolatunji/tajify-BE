const {Schema, model} = require('mongoose');


module.exports.Otp = model('Otp', Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    email: {
        type: String,    
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 600 }
    }
// Expires after 10 minutes and deleted automatically from the database
}, { timestamps: true }))
