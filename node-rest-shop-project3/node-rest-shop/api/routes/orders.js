const express = require('express');
const router = express.Router();

// router.get('/');

router.get('/',(req,res,next)=>{
         res.status(200).json({
              message: 'Orders were fetched'
         });
});


router.post('/',(req,res,next)=>{
     const order = {                              //accepting json request
          productId: req.body.productId,
          quantity: req.body.quantity
     }
    res.status(200).json({
         message: 'Orders was created',
         order:order                           // passed created product in response
    });
});


router.get('/:orderId',(req,res,next)=>{
    res.status(200).json({
         message: 'Order details',
         orderId: req.params.orderId
    });
});

router.delete('/:orderId',(req,res,next)=>{
    res.status(200).json({
         message: 'Order deleted',
         orderId: req.params.orderId
    });
});

module.exports = router;