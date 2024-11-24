const mongoose = require('mongoose');

const productSchema = mongoose.Schema({    // How my product should look like
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
});

module.exports = mongoose.model('Product',productSchema);  //schema gives a constructor based on which the objects looks like