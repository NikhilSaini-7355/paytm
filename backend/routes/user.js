const z = require('zod');
const express = require('express');
const app = express();
const port = 3000;
const User = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');

const userRouter = express.Router();

// declaring zod schemas for input validation
// one by one 
const userNameSchema = z.string().min(8,{message:"string should be minimumm of 8 length"}).email();
const firstnameSchema = z.string().min(2);
const lastnameSchema = z.string().min(2);
const passwordSchema = z.string().and(z.number()).min(8);

// or inside an object
const signupSchema = z.object({
    username : z.string().min(8,{message:"string should be minimumm of 8 length"}).email(),
    firstname : z.string().min(2),
    lastname : z.string().min(2),
    password : z.string().min(8).and(z.number())
});

const signinSchema = z.object({
    username : z.string().email(),
    password : z.string().min(8).and(z.number())
})


userRouter.post("/signin", async (req,res)=>{
    const body = req.body;
    const { success } = signinSchema.safeParse(body);
    if(!success)
    {
        return res.status(411).json({
            message : "Incorrect information"
        })
    }

    const user = await User.findOne({ username : body.username , password : body.password });
    if(!(user._id))
    {
        return res.status(411).json({
            message : "Error while logging in"
        })
    }
    else
    {
        const token = jwt.sign({ userId : user._id },JWT_SECRET);
        res.status(200).json({
            token: token
        })
    }

});



userRouter.post("/signup",async (req,res)=>{
    const body = req.body;
    const parsedbody = signupSchema.safeParse(body);
    const parsedbodydata = null;
    if(parsedbody.success==false)
    {
        return res.status(411).json("Incorret Input" + "     " + parsedbody.error);
    }
    else
    {
        parsedbodydata = parsedbody.data;
    }
    
    const user = User.findOne({ username : parsedbodydata.username }).then((val)=>{
        console.log("found:"+val);
    }).catch((err)=>{
        console.log(err);
    });
    if(user._id)   // or we can use --->>> (user)
    {
       return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    else
    {
        const user2 = new User(parsedbodydata);
        await user2.save().then((val)=>{
            console.log("saved object id:"+ val._id);
        });
        // we can also do
        // this is one line shorter
        // const user2 = await User.create(parsedbodydata);


  const token = jwt.sign({
    userId : user2._id
  },JWT_SECRET);
  // we can also do
  //  const token = jwt.sign(parsdbodydata,JWT_SECRET);
        res.status(200).json({
            message: "User created successfully",
            token: token  
        })
    }
});




userRouter.get("/transactions",(req,res)=>{
    res.send("transactions")
});

module.exports = userRouter;