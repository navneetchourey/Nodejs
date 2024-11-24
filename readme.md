/users
/orders     /Get, /post
/orders /{id} /Get, /delete
/products   /Get, /post
/products/{id} /Get, /patch, /delete

some end points  will be protected so only logged in users can access it
protected end points 
/orders     /Get, /Post  
/orders /{id} /Get, /delete
/products  /post
/products/{id}  /patch, /delete

Let's create project

 >mkdir node-rest-shop 
 >cd node-rest-shop  
 >npm init
                                                                                                        
package name: (rest-shop)
version: (1.0.0)
description: A Node.js Restful API
entry point: (index.js)
test command:
git repository:
keywords: node restful api
author: Navneet
license: (ISC)                                                  


we will use express as a framework of nodejs to building our apis easier
 >npm install --save express


create server.js file  : we will write all the code to spinup our server
const http = require('http');    
const port = process.env.PORT    // inject your code from environment variable
const server = http.createServer();//we need to handle incoming request so create server with arguments
server.listen(port)  // to start the sevrer


Create a simple file app.js : it will spin up express application and help us in handling requests
app.js
const express = require('express');
const app = express();  // This will spin express application,  we can execute express() like a function, we can use all kind of utility methods
app.use()  //use is a middleware, incoming request has to go through app.use and whatever we pass through it
// the thing we pass through it can have different format, it can be an arrow function where you get request , response and the next middleware where you want to send request
app.use((req,res,next)=>{    
    res.status(200).json({           // set json response
        message:'It works!'
    });
});




then open server.js and add below import
const app = require('./app'); 

and pass app to create server in server.js
const server = http.createServer(app);  //  express application qualifies as a req handler

start the server
>node .\server.js

try sending request
http://localhost:3000


Create more routes
create api/routes/products.js
Inside products.js
const express = require('express');
const router = express.Router();   // sub package of express to register routes
router.get('/products')   //but we should not use /products here since we will go through app.js and app.use will have /products and a middleware to redirect the request i.e. productRoute
so remove products from  router.get('/')

open app.js
const productRoutes =  require('./api/routes/produts')
app.use('/products',productRoutes)    //app.use((req,res,next))
// so any request that comes to app.js having /product will redirect to productroutes


products.js (seperate handling for get and post methods)
router.get('/',(req,res,next)=>{
         res.status(200).json({
              message: 'Handling GET requests to /products'
         });
});

router.post('/',(req,res,next)=>{
    res.status(200).json({
         message: 'Handling POST requests to /products'
    });
});

module.exports = router;


postman
post request
http://localhost:3000/products
get request 
http://localhost:3000/products

try put method , it's not present

Client-server Architecture : real seperation of backend and frontend
stateless: we don't store any client-context e.g. session, it's stored on the server
Cacheability: you can setup caching
Layered System: server could be in between server and the client don't care about it
uniform interface: /users/getData   very clear
code on demand(optional): executable code could be transferred
                                                                                                      accept a variable in the request - use :
router.get('/:productId')

create a new function that could accept a variable in product.js
router.get('/:productId',(req,res,next)=>{
     const id = req.params.productId;
     if(id==='special'){
          res.status(200).json({
               message: 'you discovered the special ID',
               id:id
          });
     } else{
          res.status(200).json({
               message: 'you passed an ID'
          })
     }
});


postman Get request
http://localhost:3000/products/123

create a patch and delete product
router.patch('/:productId',(req,res,next) => {

          res.status(200).json({
               message: 'updated product'
          });
});

router.delete('/:productId',(req,res,next) => {

     res.status(200).json({
          message: 'Deleted product'
     });
});


Test patch and delete methods from postman


Create orders.js file
const express = require('express');
const router = express.Router();

// router.get('/');

router.get('/',(req,res,next)=>{
         res.status(200).json({
              message: 'Orders were fetched'
         });
});


router.post('/',(req,res,next)=>{
    res.status(200).json({
         message: 'Orders was created'
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


Now test http://localhost:3000/orders  but it will not work since we have not changed app.js for orders
below 2 changes are required in app.js
const orderRoutes =  require('./api/routes/orders');
app.use('/orders',orderRoutes);  //app.use((req,res,next))


Test get and post requests 
http://localhost:3000/orders
test delete request
http://localhost:3000/orders/123
test get request
http://localhost:3000/orders/123


Handling & Improving setup
install nodemon - to monitor the server when ever you changed something
npm install --save-dev nodemon
nodemon server.js   //not working go to package.json and add script
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon server.js"
  },
  >npm start


  logging: 200 how much time took for api to respond
   npm install --save morgan // logging package for node.js
   

   add below lines in app.js
   const morgan = require('morgan');
   app.use(morgan('dev))

http://localhost:3000/orders
send postman request and you will get additional logs like below
POST /orders 200 4.441 ms - 32

Error  Handling in app.js for the application 
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


try get request http://localhost:3000/
It will throw error in json format


Parsing the post request Body & Handling CORS
npm install --save body-parser     // to parse body of incoming request

please add below lines in api.js
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

******project2
Now open node-rest-shop-project2

product.js
receiving a json in request 
router.post('/',(req,res,next)=>{
     const product = {                     //accepting json request
          name: req.body.name,
          price: req.body.price
     };
    res.status(201).json({
         message: 'Handling POST requests to /products',
         createdProduct:product          // passed created product in response
    });
});


order.js
router.post('/',(req,res,next)=>{
     const order = {                        //accepting json request
          productId: req.body.productId,
          quantity: req.body.quantity
     }
    res.status(200).json({
         message: 'Orders was created',
         order:order                       // passed created order in response
    });
});

send post request 
http://localhost:3000/products
{
    "name": "xyz",
    "price": "12.5"
}

http://localhost:3000/orders
{
    "productId": "xyz",
    "quantity": "10"
}


Handling CORS request
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


https://www.mongodb.com/atlas/database  ->try free


mongoDB
mongodb+srv://node-shop:node-shop@node-rest-shop.reffj8d.mongodb.net/?retryWrites=true&w=majority


>npm install --save mongoose@7.6.3

open app.js and add below lines
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://node-shop:node-shop@node-rest-shop.reffj8d.mongodb.net/?retryWrites=true&w=majority')


Please create a file nodemon.json
{
    "env":{
        "MONGO_ATLAS_PW":"node-shop"
    }
    
}


inside spp.js
mongoose.connect("mongodb+srv://node-shop:"+process.env.MONGO_ATLAS_PW+"@node-rest-shop.reffj8d.mongodb.net/?retryWrites=true&w=majority",
{
    useMongoClient: true
}
);



We need mongoose model. mongoose works with model to convert objects to store in the database

create a new file api/models/product.js
const mongoose = require('mongoose');
const productSchema = mongoose.Schema({    // How my product should look like
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
});
module.exports = mongoose.model('Product',productSchema);  //schema gives a constructor based on which the objects looks like


routes/product.js changes  to create product object in mongodb database
const mongoose = require('mongoose');
router.post('/',(req,res,next)=>{
     
     const product = new Product({
          _id:new mongoose.Types.ObjectId(),
          name: req.body.name,
          price:req.body.price
     });
   //  product.save().exec();   //exec will turn it into a promise
   // product.save((err,result));   //or we have to use a callback here
   product.save().then(result =>{        // we can use promise without exec()
     console.log(result);
   } )
   .catch(err => console.log(err));
    res.status(201).json({
         message: 'Handling POST requests to /products',
         createdProduct:product          // passed created product in response
    });
});



I removed mongoClient :true from app.js due to errors , In latest mongoose  modules it's not required
mongoose.connect("mongodb+srv://node-shop:"+process.env.MONGO_ATLAS_PW+"@node-rest-shop.reffj8d.mongodb.net/?retryWrites=true&w=majority");

test post request to save object in mongoDB
http://localhost:3000/products
{
    "name": "xyz",
    "price": "10.5"
}


modifying code of /routes/products.js
router.get('/:productId',(req,res,next) => {
     const id = req.params.productId;
     Product.findById(id)
                    .exec()
                    .then(doc=>{                      // mongodb document
                         console.log("from database",doc);
                         res.status(200).json(doc);
                    }).catch(err=>{
                         console.log(err);
                    res.status(500).json({error:err});
                    });
});

get products using mongoDBId
http://localhost:3000/products/659e3da45d84020535eec5d9

Now modifying the method to tet error message router.post('/',(req,res,next)=>{
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
   } )
   .catch(err => console.log(err));
    res.status(201).json({
         message: 'Handling POST requests to /products',
         createdProduct:product          // passed created product in response
    });
});

to 

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

Get Method request
http://localhost:3000/products/659e3da45d84020535eec
http://localhost:3000/products/659e3da45d84020535eec5d8  //message:  No valid entry found
product.js Inside get method
   if(doc){
                              res.status(200).json(doc);
                         }
                         else{
                              res.status(404).json({message:'No valid entry found for provided id'})
                         }


--------**************** project3 node-rest-shop-project3
modified get method in products.js
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


Get request  // We get back an array from the database
http://localhost:3000/products


product.js delte method
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

delete Request
http://localhost:3000/products/659e3da45d84020535eec5d9

patch Request

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

patch request update
[{
    "propName":"name", "value":"ABCDE"
}]

-------------------*********project4 node-rest-shop-project4 validations 
while sending request price is required & should work with given and no other field should get inserted other than specified in the model

Inside model price: Number should be changed to below code and name: String should also to be changed
    name: {type: String, required:true},
    price: {type: Number, required:true}

passing extra field in the route doesn't do anything even if passed in post body


response after changing below code : {
            "name": "John Corner",
            "price": 25.5,
            "_id": "659f8aba9f14075b32cb50ca",
            "request": {
                "type": "GET",
                "url": "http://localhost:3000/products/659e86d5ec429cb5407cd4bf"
            }
        }

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





modified products.js /post
    message: 'Created product successfully',
          createdProduct:{
               name: result.name,
               price:result.price,
               _id:result._id,
               request:{
                    type:'GET',
                    url: 'http://localhost:3000/products/'+ result._id
               }

modified get method for an ID
     .select('name price _id')
   if(doc){
                              res.status(200).json({
                                   product: doc,
                                   request: {
                                        type:'GET',
                                        url:'http://localhost/products'
                                   }
                              });


modified patch request for an ID
   request:{
                         type:'PATCH',
                         url:'http://localhost:3000/products/'+id
                    }                              

modify app.js
                    mongoose.Promise =global.Promise;   //to remove deprecation warning,  to use the default node.js promise implementation injstead of mongoose promise 


Modyfying Order and safety of database

create a model for order
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({    // How my product should look like
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref:'Product',required:true},  //id of the product
    quantity: {type: Number, default:1}
});

module.exports = mongoose.model('Order',orderSchema);  //schema gives a constructor based on which the objects looks like



modify routes/order.js
const mongoose = require('mongoose');
const Order = require('../models/order')

modify order.js post method
router.post('/',(req,res,next)=>{
     const order = new Order({
          _id:new mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product:req.body.productId
     });
     order.save().then(result=>{   //exec() gives you real promise but for save() you get a real promise by default also so no need of save.exec
          console.log(result);
          res.status(201).json(result);
     }).catch(err=>{
          console.log(err);
          res.status(500).json({
               error:err
          });
     });
});

create order  post request 
http://localhost:3000/orders

{
"productId":"659e86d5ec429cb5407cd4bf",
"quantity":2
}


Get Orders
http://localhost:3000/orders



modify order save response
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


modify order Get response

 return{
                         _id:doc._id,
                         product:doc.product,
                         request:{
                              type:'GET',
                              url:'http://localhost:3000/orders/'+doc._id
                         }
                    }
               }),



-----------------******************** project 5
Now we should ensure that while creating an order only existing productIds should gets saved
For wrong product ID order should return No product found


router.post('/',(req,res,next)=>{
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


.populate
We can control the things populated in response using populate
inside product object of orders api response i just want name but not the price
.populate('product','name')

--------------------------********************project6 save an image

store image and put its entry in database and get the image in response
Binary body will not be parsed by our body-parser pakage since it's url encoded or json bodies

npm install --save multer  //parse incoming bodies but here form data 
const multer = require('multer');
const upload = multer({dest:'uploads/});   // ad a configuration to multer, a folder where multer stores incoming files
router.post('/',upload.single('productImage').....)
http://localhost:3000/products
post request:
formData
price 12.99
name  Harry Potter5
productImage file


----------------***********project7 file storage strategy


const storage = multer.diskStorage({                  
     destination: function(req, file, cb) {
         cb(null, './uploads/');
     },
     filename: function(req, file, cb) {
         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
         cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
     }
 });
 
const upload = multer({storage: storage});



Verifications: file should not be bigger than this size
const upload = multer({storage: storage, limits:{
     fileSize:1024*5
}});

File Too Large

FileFilters jpeg/png
 const fileFilter =(req,file,cb)=>{
// reject a file
     if(file.mimetype=== 'image/jpeg'|| file.mimetype=== 'image/png'){
     cb(null,true);
     }
     else{
     cb(null,false); // null will not throw an error will just not save the file
     }

 };

const upload = multer({storage: storage, limits:{
     fileSize:1024*1024*5
},
fileFilter:fileFilter  //3rd agrument file should be jpeg/png
});


File stored successfully now we want to get the files

model/product.js
const productSchema = mongoose.Schema({    // How my product should look like
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required:true},
    price: {type: Number, required:true},
    productImage:{type:String,required:true}
});


get productImage path 
.select('name price id productImage')
 return {
                         name: doc.name,
                         price:doc.price,
                         _id: doc._id,
                         productImage:doc.productImage,
                         request: {    //passed extra information
                              type: 'GET',
                              url: 'http://localhost:3000/products/'+doc._id
                         }
                    }


Get Reuest 
http://localhost:3000/products/



Method is not defined
http://localhost:3000/uploads/productImage-1705070241110-112821885.png
http://localhost:3000/productImage-1705070241110-112821885.png
{"error":{"message":"method is not defined"}}
Open app.js, and add below line of code
app.use('/uploads',express.static('uploads')); // THis will make uploads folder available to everyone



-------------------******************** Project 8 User sign UP
client ----sends auth data ---> Server
client <------normally it returns session ------------server
But restful service is stateless it means it don't save any information about connected clients . Therefore we don't need session
and someexamples like mobile app don't save session
Instead we will actually return a token (some piece of data) through which we can check if its a valid token or not

storage <-----stored token------ client ------->server
But in a way we will be able to veru=ify if it's valid or not


JSON Web Token : Since it stores some json data e.g. address/id of user who signed in and some signature
JSON Data + Signature = JSON Web Token 
and It will be return to the client
We will use private public key combination and only the server will know the private key
The token will not be encrypted so we can see that but we cannot change or modify that


create a new model/user.js file 
we are going to create 2 routes signup and sign in, since we are not storing any information about loggedin loggedout , we are not storing loggedout information

model/user.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({    
    _id: mongoose.Schema.Types.ObjectId,
    email:{type: String,required:true},
    password:{type:String,required:true}
});

module.exports = mongoose.model('Usser',userSchema);  //schema gives a constructor based on which the objects looks like


routes/user.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/signup',(req,res,next)=>{



encrypt the password : node.bcrypt.js
npm install bcrypt --save
const bcrypt = require('bcrypt);
password:bcrypt:bcrypt.hash(req.body.password,10) // 10 is the no. of words in the salt  
salt: If we hash a password if can't reverse it but if you get this hash in the end and you google this hash chances are high that you will get its text because every plain text string has a clear unique hash, so we add random strings in the password before hashing it

add below lines in app.js
const userRoutes = require('./api/routes/user');
app.use("/user",userRoutes);

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => { // <-- Added closing parenthesis for hash parameter
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User Created'
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        }
    });
});

post request to create an User :
http://localhost:3000/user/signup
{
"email":"test@test.com",
"password":"tester"
}

ow let's apply some validation that the emailid should be unique

Mail already exists 
router.post('/signup', (req, res, next) => {
    
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user){
            return res.status(409).json({
                message:'Mail exists'
            });
        }
        //response codes 409=conflict, 422=unprocessable entity
    })
    bcrypt.hash(req.body.password, 10, (err, hash) => { // <-- Added closing parenthesis for hash parameter
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User Created'
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        }
    });
});

or 


router.post('/signup', (req, res, next) => {
    
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length>=1){
            return res.status(409).json({
                message:'Mail exists'
            });
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) => { // <-- Added closing parenthesis for hash parameter
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                        .then(result => {
                            res.status(201).json({
                                message: 'User Created'
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
        //response codes 409=conflict, 422=unprocessable entity
    });

});


router.delete('/:userId),(req,res,next)=>{
     User.remove({_id:req.params.id})
     .exec()
     .then(res=>{
          res.status(200).json({
               message:'User deleted'
          });
     })
      .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
}


User delete

router.delete('/:userId',(req,res,next)=>{
    User.deleteOne({_id:req.params.userId})
    .exec()
    .then(result=>{
         res.status(200).json({
              message:'User deleted'
         });
    })
     .catch(err => {
                           console.log(err);
                           res.status(500).json({
                               error: err
                           });
                       });
                    });



email:{type: String,required:true,unique:true},
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},



JWT token creation
//user login


---------************Project 9 
login route
router.post('/login',(req,res,next)=>{


to check a password 
bcrypt.compare(myplaintextpassword,hash,finction(err,res)){
     //res==true
}


add library node json web token
npm install jsonwebtoken --save
jwt sign(payload),secretorprivatekey   //to create token
It has several options like algorith , expiresIn, not Before



After Installing jsonwebtoken
jwt sign(payload),secretorprivatekey   //to create token
It has several options like algorith , expiresIn, not Before

Test Login 
http://localhost:3000/user/login
{
"email":"test@test.com",
"password":"tester"
}

token generated :
eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ1c2VySWQiOiI2NWExNjk1M2UzZjk4NGQwYzU2OTM1NDUiLCJpYXQiOjE3MDUxMzI4NzQsImV4cCI6MTcwNTEzNjQ3NH0.6xXF17icbwTY399Uvfi0cftNzrvX0QD5RaL_AoXMGGs

Now go to jwt.io

Now we need to send this token in request to protect the resource
specially post,delete,patch

create api/middleware/check-auth.js
we want a middleware that runs before a route to verify the token

check-auth.js
module.exports = (req,res,next)=>{
 next(); //we have to call next() if we do successfully autheticate

}  // i am exporting this middleware so that we can import it in product and order file

jwt has a verify method to verify the incoming token

const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
   try{
    const decoded = jwt.verify(req.body.token,process.env.JWT_KEY) //It verifies and return the decoded value
    req.userData = decoded; //adding a new field to my req
    //so in future requests we can use userdata   
}
catch(error){
    return res.status(401).json({
        message:'Auth failed'
    });
}
    next(); //we have to call next() if we do successfully autheticate
}  // i am exporting this middleware so that we can import it in product and order file

product.js adding check-auth middleware in post request
//checkauth will run first
router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>{ //pass an argument/handler and each handler is a middleware that executed before the next one runs

testing 
http://localhost:3000/products
price :100.10
name xyz
productImage: file

token is missing Auth failed
So first perform login

post request
http://localhost:3000/user/login
{
"email":"test@test.com",
"password":"tester"
}
copy the token key and add token: token in the product post request 
and also we need to  parse token  we need to swith the place of upload and check-auth
product created successfully

But we should put the token in the header using authorization bearer 
bearer is an indication that this token sends is for the http authentication


Post Request Product Creation
http://localhost:3000/products
price:12.25
name: Harry potter 7
productImage: file uploaded
token: token


We need to change Post request body and header 

Very Important
Add below header
Authorization Bearer token
and remove token from Body from post request
Auth failed, Now add below code in check-auth.js
const token = req.headers.authorization.split(" ")[1];
console.log(token);
and change below line
    // const decoded = jwt.verify(req.body.token,process.env.JWT_KEY) //It verifies and return the decoded value
    const token = req.headers.authorization.split(" ")[1];

    Inside routes Product.js, removed check-Auth from the method prototype and added it before body parser, 
    router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>{ //removed check-auth

Post Request Product Creation
http://localhost:3000/products
price:12.25
name: Harry potter 7
productImage: file uploaded

Header
Authorization Bearer token

Object created successfully

Now try to send invalid token


Now add it infront of patch and delete route and in orders as well


whereever we will add this checkAuth the api will become protected otherwise it will be public
lets keep get products api public and all the other apis protected
product.js
router.get('/:productId',checkAuth, (req,res,next) => {


------------******project10 keycloack integration
Keycloak is an open-source Identity and Access Management (IAM) solution developed by Red Hat.
Capabilities:
Single Sign-On (SSO), 
multi-factor authentication, 
user federation, 
and centralized user management. 

Keycloak supports various protocols, including OpenID Connect, OAuth 2.0, and SAML.

First we need to download and configure keycloack
1. Please download the zip file
https://www.keycloak.org/downloads

2. Extract the zip file

3. start keycloack by executing below script 
  bin\kc.bat start-dev
  // standalone.bat
  https://www.keycloak.org/getting-started/getting-started-zip

4.  Keycloack application url
http://localhost:8080/

Create user
http://localhost:8080/

Login to admin console
http://localhost:8080/admin
test:test

click Users in the Left hand menu -> Add User -> select All Actions -> Create user
-> Click credentials -> set password, keep on removing Actions

Click Client-> Create Client -> Next -> confirm that standard flow is enabled -> Next
-> Set Valid redirect URIs to https://www.keycloak.org/app/*
-> Set Web origins to https://www.keycloak.org
Save


Create realm
Click on master and Create realm

5. Setup admin account
There are 3 things in keycloack to setup
 a) Realm: A realm is a container for your clients and users.
 b) Client
 c) Users

6. Configure the node.js application 
npm install keycloak-connect express-session

7. Create a middleware keycloak-connect.js
const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express();

const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}));

const keycloak = new Keycloak({
  store: memoryStore,
});

app.use(keycloak.middleware());

8. Protect routes with keycloack:
app.get('/secured/resource', keycloak.protect(), (req, res) => {
  res.send('This is a secured resource');
});

app.get('/login', keycloak.protect(), (req, res) => {
  // Handle successful login
  res.send('Successfully authenticated');
});

9. start the server and access your protected routes


Key cloack features
1. Identity and access management: authentication/authorization
keyCloack is an open source IAM 
Single sign on
standard protocol support (openid connect, oauth 2.0, saml)
client adapters: integration with other servers like tomcat
