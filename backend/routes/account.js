const express = require('express');
const { authMiddleware } = require('../middleware');
const { User, Accounts } = require('../db');
const { default: mongoose } = require('mongoose');
const z= require('zod');
const accountRouter = express.Router();

accountRouter.get("/balance",authMiddleware, async (req,res)=>{
  const userId = req.userId;
  const account = await Accounts.findOne({ userId : userId });
  const balance = account.balance;
  res.json({
    balance : balance 
  });
});


accountRouter.post("/transfer",authMiddleware, async (req,res)=>{
    const transferSchema = z.object({
      to : z.string(),    // add .optional() if the field may or may not have the value or if the field may or may not exist
      amount : z.number()
    })

    const { success } = transferSchema.safeParse(req.body);
    if(!success)
    {
       return res.json({
        message : "wrong inputs"
       })
    }

    const topersonId = req.body.to;
    const amount = req.body.amount;
   // const db = await mongoose.createConnection("mongodburi").asPromise();


   const session = await mongoose.startSession();  // earlier I did User.startSession() but rectified it after seeing the sir's code
   session.startTransaction();
   try {

      const account =  await Accounts.findOne({ userId : req.userId}).session(session);
        if( !account || account.balance < amount)
        {
          return res.json({
           message : "insufficient balance / some problem occurred with your account"
          })
        }
       
    const toAccount = await Accounts.findOne({ userId: topersonId }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

     await Accounts.findOneAndUpdate({ userId : req.userId },{ $inc : { balance : -1*amount }}, { session : session });
     await Accounts.findOneAndUpdate({ userId : topersonId }, { $inc : { balance : amount }}, { session : session });
     await session.commitTransaction();
     session.endSession();
     return res.json({
      message : "money successfully transferred"
     });
   }
   catch(e)
   {
     session.abortTransaction();
     session.endSession();
     return res.json({
      message : "money not sent due to some issues"
     })
   }

})


// sir's bad solution without transactions
// accountRouter.post("/transfer", authMiddleware, async (req, res) => {
//   const { amount, to } = req.body;

//   const account = await Account.findOne({
//       userId: req.userId
//   });

//   if (account.balance < amount) {
//       return res.status(400).json({
//           message: "Insufficient balance"
//       })
//   }

//   const toAccount = await Account.findOne({
//       userId: to
//   });

//   if (!toAccount) {
//       return res.status(400).json({
//           message: "Invalid account"
//       })
//   }

//   await Account.updateOne({
//       userId: req.userId
//   }, {
//       $inc: {
//           balance: -amount
//       }
//   })

//   await Account.updateOne({
//       userId: to
//   }, {
//       $inc: {
//           balance: amount
//       }
//   })

//   res.json({
//       message: "Transfer successful"
//   })
// });

// sir's solution using transactions
// accountRouter.post("/transfer", authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();

//   session.startTransaction();
//   const { amount, to } = req.body;

//   // Fetch the accounts within the transaction
//   const account = await Account.findOne({ userId: req.userId }).session(session);

//   if (!account || account.balance < amount) {
//       await session.abortTransaction();
//       return res.status(400).json({
//           message: "Insufficient balance"
//       });
//   }

//   const toAccount = await Account.findOne({ userId: to }).session(session);

//   if (!toAccount) {
//       await session.abortTransaction();
//       return res.status(400).json({
//           message: "Invalid account"
//       });
//   }

//   // Perform the transfer
//   await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
//   await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

//   // Commit the transaction
//   await session.commitTransaction();
//   res.json({
//       message: "Transfer successful"
//   });
// });



module.exports = {
    accountRouter ,
}