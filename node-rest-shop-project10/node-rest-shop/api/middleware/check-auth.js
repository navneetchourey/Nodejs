const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
   try{
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token,process.env.JWT_KEY) //It verifies and return the decoded value
    // const decoded = jwt.verify(req.body.token,process.env.JWT_KEY) //It verifies and return the decoded value
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