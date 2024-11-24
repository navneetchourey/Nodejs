const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const session = require('express-session');
const proxy = require("express-http-proxy");
const app = require("express")();
const Keycloak = require("keycloak-connect");

var memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: "notSoSecret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

var keycloak = new Keycloak({
  store: memoryStore,
});

app.use(keycloak.middleware());

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


router.post('/login',keycloak.protect(),(req,res,next)=>{
    User.find({email: req.body.email}).exec().then(user=>{
        if(user.length<1){
            return res.status(401).json({  //401 Unauthorized
                message:'Auth Failed'
            });
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:'Auth failed'
                });
            }
            if(result){
            const token = jwt.sign({
                    email:user[0].email,
                    userId: user[0]._id
                },process.env.JWT_KEY,
                {
                    expiresIn:"1h"
                }
                );
                return res.status(200).json({
                    message:'Auth successful',
                    token:token
                })
            }
            res.status(401).json({
                message:'Auth failed'
            })
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

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

module.exports = router;