const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({

});

const Wallet = mongoose.model('Wallet', walletSchema)
module.exports = Wallet;