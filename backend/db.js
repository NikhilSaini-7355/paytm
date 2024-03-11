const mongoose = require('mongoose');
const { number, string } = require ('zod');
// or
// const mongoose = require('mongoose');

const { Schema } = mongoose;

async function EstablishConnection(){
    console.log("connection started")
    await mongoose.connect("mongodb+srv://nikhilsaini735510:Nikhil123@cluster0.tm5ngc9.mongodb.net/"); 
    console.log("connection made")
}

EstablishConnection();
// const UserSchema = new Schema({
//     UserName : String ,
//     Password : String,
//     FirstName : String,
//     LastName : String, 
//    // AccountNo : String ,
//    // Balance : Number  ,
//    // Transactions : [{ Date : Date ,
//    //   TransactionId : String
//    // }]
// });


const UserSchema = new Schema({
    'username': { 
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    'password': {
        type: String,
        required: true,
        minLength: 6
    },
    'firstname': {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    'lastname': {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});
const AccountSchema = new Schema({
    userId : { type : Schema.Types.ObjectId, ref: "User" , required : true } ,
    balance :{ type : Number , required : true }
})

const User = mongoose.model('User', UserSchema);
const Accounts = mongoose.model('Accounts',AccountSchema);


module.exports = {
    User , 
    Accounts
};
// or
// export default User


// Elegant solution of sir
// const mongoose = require('mongoose');
// UserSchema like above (bigger one )
// const User = mongoose.model('User', userSchema);

// module.exports = {
// 	User
// };
 
 
 