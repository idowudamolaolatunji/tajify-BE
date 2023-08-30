const mongoose = require('mongoose');

const stakeSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    stake: {
        type: Number,
        default: 0
    },
    reward: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});


stakeSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: '-__v'
    })
    next();
});



const Stake = mongoose.model('Stake', stakeSchema);
module.exports = Stake;