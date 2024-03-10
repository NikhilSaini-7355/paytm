const z = require('zod');
const express = require('express');
const app = express();
const port = 3000;
const { User,Accounts } = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const { authMiddleware } = require('../middleware');

const userRouter = express.Router();

// declaring zod schemas for input validation
// one by one 
const userNameSchema = z.string().min(8,{message:"string should be minimumm of 8 length"}).email();
const firstnameSchema = z.string();
const lastnameSchema = z.string();
const passwordSchema = z.string().min(8)

// or inside an object
const signupSchema = z.object({
    'username' : z.string().email(),
    'password' : z.string().min(8) ,
    'firstname' : z.string().min(2),
    'lastname' : z.string().min(2),
    
});

const signinSchema = z.object({
    username : z.string().email(),
    password : z.string().min(8)
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
    if(!(user))
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
    console.log("inside signup");
    const body = req.body;
    const parsedbody = signupSchema.safeParse(body);
    var parsedbodydata = null;
    if(parsedbody.success==false)
    {
        return res.status(411).json("Incorret Input");
    }
    else
    {
        parsedbodydata = parsedbody.data;
    }
    
    const user = await User.findOne({ username : parsedbodydata.username })
    if(user)   // or we can use --->>> (user)
    {
       return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
  

        const user2 = new User(parsedbodydata);
        await user2.save().then((val)=>{
            console.log("saved object id:"+ val._id);
        });
        // we can also do
        // this is one line shorter
        // const user2 = await User.create(parsedbodydata);
        const bal = 1 + Math.random()*(10000);
        const account = await Accounts.create(
            { userId : user2._id ,
              balance : bal  });  // makes new account and saves it automatically

  const token = jwt.sign({
    userId : user2._id
  },JWT_SECRET);
  // we can also do
  //  const token = jwt.sign(parsdbodydata,JWT_SECRET);
        res.status(200).json({
            message: "User created successfully",
            token: token  
        })
    
});

// userRouter.use(); // this middleware will now be used in all of the routes that are below it and this middleware will be executed before any other handler functions of the below mentioned routs execute

userRouter.put("/",authMiddleware, async (req,res)=>{
    console.log("inside /");
    const body = req.body;
    const user = await User.findOne({ _id : req.userId });
    
    console.log(req);
    // for(const i in body)
    // {   if(i!='userId')
    //    {  user[i] = body[i]; }
    // }
    
    if(body.password)
    {
        const { success } = passwordSchema.safeParse(body.password);
        if(success)
        {
            user.password = body.password;
        }
        else
        {
            return res.status(411).json({
                message : "weak password"
            })
        }
    }
  
    if(body.firstname)
    {
        const { success } = firstnameSchema.safeParse(body.firstname);
        if(success)
        {
            user.firstname = body.firstname;
        }
        else
        {
            return res.status(411).json({
                message : "wrong firstname"
            })
        }
    }
    
    if(body.lastname)
    {
        const { success } = lastnameSchema.safeParse(body.lastname);
        if(success)
        {
            user.lastname = body.lastname;
        }
        else
        {
            return res.status(411).json({
                message : "wrong lastname"
            })
        }
    }

    await user.save()
    res.status(200).json({
        message :  "Updated successfully"
    })
})

// Sir's solution ---much better ----->>>>>

// const updateBody = zod.object({
// 	password: zod.string().optional(),
//     firstName: zod.string().optional(),
//     lastName: zod.string().optional(),
// })
// router.put("/", authMiddleware, async (req, res) => {
//     const { success } = updateBody.safeParse(req.body)
//     if (!success) {
//         res.status(411).json({
//             message: "Error while updating information"
//         })
//     }

// 		await User.updateOne({ _id: req.userId }, req.body);
	
//     res.json({
//         message: "Updated successfully"
//     })
// })
 
userRouter.get("/bulk",authMiddleware, async (req,res)=>{
    console.log("inside bulk")
    const filter = req.query.filter || ""; // this one is important , if req.query.filter is null or undefined then the filter variable becomes ""
    const users = await User.find({
                          $or: [
                            { firstname :{
                                "$regex": filter  // by this syntax , we can check if filter is present in the firstname even as a substring
                                // using this syntax we an actually make LIKE Queries which we do in SQl , this is the mongodb version of it 
                                // firstname : filter , will only check if firstname is equal to filter , but the above yntax will additionally check if the filter is substring or complete string of the firstname 
                             }
                            },
                            { lastname :{ 
                                "$regex" : filter 
                            }
                        } ]
                        })
       if(users.length==0)
       {
         return res.status(411).json({
            message : "No matches found"
         })
       }
       else
       {
         const users2 = users.map((user)=>{
              return {
                username : user.username,
                firstname : user.firstname,
                lastname : user.lastname,
                _id : user._id
              }
         })

         res.status(200).json({
            users : users2
         })
       }
})

userRouter.get("/test",(req,res)=>{
    console.log("hello");
    res.json({
        message : "hello" 
    })
})


module.exports = userRouter;