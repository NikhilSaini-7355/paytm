
const express = require('express');
const userRouter = require('./user');
const app = express();
const router = express.Router();

router.use("/user",userRouter); // this is seeming like a router chaining 
// now all the requests for /api/v1/user will be handled by userRouter

router.use("/account",userRouter); // now all the requests for /api/v1/account/ will be handled by userRouter


module.exports =  router