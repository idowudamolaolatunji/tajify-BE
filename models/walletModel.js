const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    USDTBEP20Address: {
        type: String,
        unique: true,
        trim: true
    },
    TAJIBEP20Address: {
        type: String,
        unique: true,
        trim: true
    },
    paypalAddress: {
        type: String,
        unique: true,
        trim: true
    },
    nairaBankAccount: {
        bankName: {
            type: String,
        },
        bankAccountNumber: {
            type: Number,
            trim: true,
            unique: true
        },
        bankHolderName: {
            type: String,
            trim: true,
        }
    }
});

const Wallet = mongoose.model('Wallet', walletSchema)
module.exports = Wallet;