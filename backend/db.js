import mongoose from 'mongoose'
// or
// const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    UserName : String ,
    Password : String,
    FirstName : String,
    LastName : String, 
   // AccountNo : String ,
   // Balance : Number ,
   // Transactions : [{ Date : Date ,
   //   TransactionId : String
   // }]
});

const User = mongoose.model('User', UserSchema);

mongoose.connect("mongodb+srv://nikhilsaini735510:Nikhil123@cluster0.tm5ngc9.mongodb.net/Paytm");

module.exports = {
    User
}
// or
// export default User


// Elegant solution of sir
// const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema({
      // Adding consraints to each of the fields
//     username: { 
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         lowercase: true,
//         minLength: 3,
//         maxLength: 30
//     },
//     password: {
//         type: String,
//         required: true,
//         minLength: 6
//     },
//     firstName: {
//         type: String,
//         required: true,
//         trim: true,
//         maxLength: 50
//     },
//     lastName: {
//         type: String,
//         required: true,
//         trim: true,
//         maxLength: 50
//     }
// });
// const User = mongoose.model('User', userSchema);

// module.exports = {
// 	User
// };
 
 
 