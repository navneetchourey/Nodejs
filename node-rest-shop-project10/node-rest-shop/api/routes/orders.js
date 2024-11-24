const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Order = require('../models/order')
const Product = require('../models/product')
const checkAuth = require('../middleware/check-auth')

// router.get('/');

router.get('/',checkAuth,(req,res,next)=>{
     Order.find().select("product quantity _id")
     .populate('product','name')      //comment this and check response
     .exec().then(docs=>{
          res.status(200).json({
               count:docs.length,
               orders:docs.map(doc=>{
                    return{
                         _id:doc._id,
                         product:doc.product,
                         request:{
                              type:'GET',
                              url:'http://localhost:3000/orders/'+doc._id
                         }
                    }
               }),
              
          });
     }).catch(err=>{
          res.status(500).json({
               error: 'err'
          });
     });
         
});


router.post('/',checkAuth,(req,res,next)=>{
     Product.findById(req.body.productId).then(product=>{
          if(!product){
               return res.status(404).json({
                        message:'Prduct Not Found'   // so If I return the subsequent code will not be executed
               });
          }
          const order = new Order({
               _id:new mongoose.Types.ObjectId(),
               quantity: req.body.quantity,
               product:req.body.productId
          });
        return order.save();
     }).
     then(result=>{   //exec() gives you real promise but for save() you get a real promise by default also so no need of save.exec
          console.log(result);
          res.status(201).json({
               message:'Order Stored',
               createdOrder:{
                    _id:result._id,
                    product:result.product,
                    quantity:result.quantity
               },
               request:{
                    type:'GET',
                    url:'http://localhost:3000/orders/'+result._id
               }
          });
     }).
     catch(err=>{
          res.status(500).json({
               message:'product not found',
               error:err
          })
     });
});


router.get('/:orderId',checkAuth,(req,res,next)=>{

     Order.findById(req.params.orderId)
     .populate('product')   //comment this and check the response
     .exec()
     .then(order=>{
          if(!order){
               return res.status(404).json({
                    message:'Order Not Found'
               })
          }
          res.status(200).json({
          order:order,
          request:{
               type:'GET',
               url:'http://localhost:3000/orders'
          }
     });
     }).catch(err=>{
          res.status(500).json({
               error:err
          });
     });
   
});

router.delete('/:orderId',checkAuth,(req,res,next)=>{

     Order.deleteOne({_id:req.params.orderId})
     .exec()
     .then(result=>{
          res.status(200).json({
          message:'Order deleted',
          request:{
               type:'POST',
               url:'http://localhost:3000/orders',
               bosy:{productId:'ID',quantity:'Number'}
          }
     });
     })
     .catch(err=>{
          res.status(500).json({
               error:err
          });
     });
});

module.exports = router;