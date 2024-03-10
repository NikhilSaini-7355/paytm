// this file has middlewares
const JWT_SECRET = require('./config');
const jwt = require('jsonwebtoken');


function authMiddleware(req,res,next)
{   console.log("inside authmiddleware");
    const header = req.body;
    var token = header.Authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(403).json({
            message : "error , please sign in again"
        });
    }
    token = token.substring(7); // we can also do 
    // much better --->>> sir logic
    //  token = token.split(' ')[1]


    try {
    const verify = jwt.verify(token,JWT_SECRET);  // since during signing we signed the userId with the JWT_secret key , so on verifying , if verified , gives the same object containing userId , which we can further use
       if(verify.userId)
       {
       req.userId = verify.userId;

       next();
       }
       else
       {
        return res.status(403).json({
            message : "token not verified"
        })
       }
}
    catch(e)
    {
        return res.status(403).json({
            message : "token not verified"
        })
    }

  // console.log(req)
}


module.exports = { authMiddleware };