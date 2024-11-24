const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({dest:'uploads/'});   // ad a configuration to multer, a folder where multer stores incoming files

const Product = require('../models/product');
// router.get('/');

router.get('/',(req,res,next)=>{
     Product.find()
     .select('name price id')    //select specific fields and project them
     .exec().then(docs=>{
          const response ={
               count: docs.length,
               products:docs.map(doc => {
                    return {
                         name: doc.name,
                         price:doc.price,
                         _id: doc._id,
                         request: {    //passed extra information
                              type: 'GET',
                              url: 'http://localhost:3000/products/'+doc._id
                         }
                    }
               })
          }
          // console.log(docs);
          res.status(200).json(response);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json({
               error:err
          })
     })
});                         

router.post('/',upload.single('productImage'),(req,res,next)=>{ //pass an argument/handler and each handler is a middleware that executed before the next one runs
    console.log(req.file);
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
          message: 'Created product successfully',
          createdProduct:{
               name: result.name,
               price:result.price,
               _id:result._id,
               request:{
                    type:'GET',
                    url: 'http://localhost:3000/products/'+ result._id
               }
          }          // passed created product in response  //passed result in the response
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
     .select('name price _id')
                    .exec()
                    .then(doc=>{                      // mongodb document
                         console.log("from database",doc);
                         if(doc){
                              res.status(200).json({
                                   product: doc,
                                   request: {
                                        type:'GET',
                                        url:'http://localhost/products'
                                   }
                              });
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
               res.status(200).json({
                    message: 'Product updated',
                    request:{
                         type:'PATCH',
                         url:'http://localhost:3000/products/'+id
                        
                    }
               });
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
          res.status(200).json({
               message: 'Product Deleted',
               request:{
                    type:'POSt',
                    url:'http://localhost:3000/products/'+id,
                    data: {name: 'String', price: 'Number'}
               }
          });
     })
     .catch(err => {
          console.log(err);
          res.status(500).json({
               error:err
          });
     });
});
module.exports = router;