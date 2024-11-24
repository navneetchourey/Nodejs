const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Product = require('../models/product');
// router.get('/');

router.get('/',(req,res,next)=>{
     Product.find().exec().then(docs=>{
          console.log(docs);
          res.status(200).json(docs);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json({
               error:err
          })
     })
});                         

router.post('/',(req,res,next)=>{
     console.log('Inside products')
     const product = new Product({
          _id:new mongoose.Types.ObjectId(),
          name: req.body.name,
          price:req.body.price
     });
   //  product.save().exec();   //exec will turn it into a promise
   // product.save((err,result));   //or we have to use a callback here
   product.save().then(result =>{        // we can use promise without exec()
     console.log(result);
     res.status(201).json({
          message: 'Handling POST requests to /products',
          createdProduct:product          // passed created product in response
     });
   } )
   .catch(err => {console.log(err);
  res.status(500).json({
     error:err
  });
  });
   
});

router.get('/:productId',(req,res,next) => {
     const id = req.params.productId;
     Product.findById(id)
                    .exec()
                    .then(doc=>{                      // mongodb document
                         console.log("from database",doc);
                         if(doc){
                              res.status(200).json(doc);
                         }
                         else{
                              res.status(404).json({message:'No valid entry found for provided id'});
                         }
                    }).catch(err=>{
                         console.log(err);
                    res.status(500).json({error:err});
                    });
});


router.patch('/:productId',(req,res,next) => {
          const id = req.params.productId;
          const updateOps = {};
          for(const ops of req.body){
               updateOps[ops.propName] = ops.value;
          }
          // Product.update({_id:id},{$set:{name:req.body.newName,price:req.body.newPrice}})
          Product.findOneAndUpdate({_id:id},{$set:updateOps})  //more dynamic approach
          .exec()
          .then(result=>{
               console.log(result);
               res.status(200).json(result);
          })
          .catch(err => {
               console.log(err);
               res.status(500).json({
                    error:err
               });
          });
        
});

router.delete('/:productId',(req,res,next) => {
   const id = req.params.productId;
     Product.deleteOne({_id:id})
     .exec()
     .then(result => {
          res.status(200).json(result);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json({
               error:err
          });
     });
});
module.exports = router;