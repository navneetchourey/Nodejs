const mongoose = require('mongoose');

const productSchema = mongoose.Schema({    // How my product should look like
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required:true},
    price: {type: Number, required:true},
    productImage:{type:String,required:true}
});

module.exports = mongoose.model('Product',productSchema);  //schema gives a constructor based on which the objects looks like