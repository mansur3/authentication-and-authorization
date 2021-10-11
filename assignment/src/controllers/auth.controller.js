const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

const User = require("../models/user.model");

const {body, validationResult} = require("express-validator");


const newToken = (user) => {
    return jwt.sign({user}, process.env.JWT_SECRET_KEY);
}

router.post("/register",body("name").isLength({min:2, max : 30}).withMessage("The name length must be length from 3 to 30"),
body("email").isEmail().withMessage("Please enter the proper email"),
body("password").isLength({min : 6, max : 20}).withMessage("The password must be length 6"), async (req, res) => {
    let user;
   
   const  errors = validationResult(req);
        let finalErrors = null;

        if(!errors.isEmpty()) {
            finalErrors = errors.array().map(error => {
                return  { param : error.param,
                         msg : error.msg
                        }
            })
            return res.status(400).send({errors: finalErrors})
        
        }

    try {

        
        user = await User.findOne({ email : req.body.email});
        if(user) return res.status(400).send({message : "The email is existing"});

        user = await User.create(req.body);


        let token = newToken(user);

        return res.status(200).send({user, token});

    } catch (e) {
        return res.status(500).send({message : "Sorry for that .. Try again later"})
    }
})

router.post("/login",
body("email").isEmail().withMessage("Please enter the proper email"),
body("password").isLength({min : 6, max : 20}).withMessage("The password must be length 6"), async (req, res) => {


    const  errors = validationResult(req);
    let finalErrors = null;

    if(!errors.isEmpty()) {
        finalErrors = errors.array().map(error => {
            return  { param : error.param,
                     msg : error.msg
                    }
        })
        return res.status(400).send({errors: finalErrors})
    
    }



   try {
       let user = await User.findOne({email : req.body.email});
       
       if(!user) return res.status(400).send({message : "Please check your email and password"});
       let match = user.checkPassword(req.body.password);
       if(! match) return res.status(400).send({message : "please check your email and password"});

       const token = newToken(user);

       return res.status(200).send({user, token});
   } catch (e) {
    return res.status(500).send({message : "Sorry for that .. Try again later"})

   }
})


module.exports = router;