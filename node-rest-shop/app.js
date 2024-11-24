const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//1st way of accepting request
// app.use((req,res,next)=>{
//     res.status(200).json({
//         message:'It works!'
//     });
// });

//2nd way of accepting request (/productRoutes)
const productRoutes =  require('./api/routes/products');
const orderRoutes =  require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use('/products',productRoutes);  //app.use((req,res,next))
app.use('/orders',orderRoutes);  //app.use((req,res,next))

app.use((req,res,next) => {   // throw an error when route not found
    const error = new Error('Not found');
        error.status(404);
        next(error);

})

app.use((error,req,res,next) => {    //this will handle all kind of errors , errors thrown from anywhere else of the application
        res.status( 500);
        res.json({
            error:{
                message: 'Not working'
            }
        });
    });


module.exports = app;

