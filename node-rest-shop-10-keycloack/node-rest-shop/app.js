const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//1st way of accepting request
// app.use((req,res,next)=>{
//     res.status(200).json({
//         message:'It works!'
//     });
// });

//2nd way of accepting request (/productRoutes)
const productRoutes =  require('./api/routes/products');
const orderRoutes =  require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// mongoose.connect('mongodb+srv://node-shop:node-shop@node-rest-shop.reffj8d.mongodb.net/?retryWrites=true&w=majority')
mongoose.connect("mongodb+srv://node-shop:"+process.env.MONGO_ATLAS_PW+"@node-rest-shop.reffj8d.mongodb.net/?retryWrites=true&w=majority");

mongoose.Promise =global.Promise;   //to remove deprecation warning,  to use the default node.js promise implementation injstead of mongoose promise 
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads')); // THis will make uploads folder available to everyone
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
app.use(keycloak.middleware());

app.use('/products',productRoutes);  //app.use((req,res,next))
app.use('/orders',orderRoutes);  //app.use((req,res,next))
app.use("/user",userRoutes);

//It will not send the response but whereever i do send the response it has these headers
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*"), //access to any origin
    // res.header("Access-Contrl-Allow-Origin","http://somesite.com")
    res.header("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );  //which kind of headers  you want to accept, which  headers you want to send along with request
    if(req,method==='OPTIONS'){  //if the incoming request method is options, browser always first send an option request when you send a put request /post request
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
   next();

})



app.use((req,res,next) => {   // throw an error when route not found
    const error = new Error('Not found');
        error.status(404);
        next(error);

})

app.use((error,req,res,next) => {    //this will handle all kind of errors , errors thrown from anywhere else of the application
        res.status(error.status|| 500);
        res.json({
            error:{
                message: error.message
            }
        });
    });


module.exports = app;

