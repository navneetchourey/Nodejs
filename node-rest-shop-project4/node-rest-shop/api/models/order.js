const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({    // How my order should look like
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref:'Product',required:true},  //id of the product
    quantity: {type: Number, default:1}
});

module.exports = mongoose.model('Order',orderSchema);  //schema gives a constructor based on which the objects looks like