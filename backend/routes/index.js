
const express = require('express');
const userRouter = require('./user');
const { accountRouter } = require('./account');

const router = express.Router();

router.use("/user",userRouter); // this is seeming like a router chaining 
// now all the requests for /api/v1/user will be handled by userRouter

router.use("/account",accountRouter); // now all the requests for /api/v1/account/ will be handled by accountRouter


module.exports =  router