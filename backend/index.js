const express = require("express");
const router = require( "./routes");
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require("body-parser");
app.use("/api/v1",router); // by this statement all the url calls for /api/v1/<ANYTING> will be handled 
// so this is a good way of handling routes if a lot of routes start using same words

// /api/v1 or /api/v1/ are both almost same
// we can see this same in real life as well
// app.use("/api/v2",router) // by this statement all the url calls for /api/v2/<ANYTING> will be handled 
// so this is a good way of handling routes if a lot of routes start using same words

// app.use(middleware) // single argument will act as middleware
// app.use("path", router) // this will help in the effective routing using the routers



// Since our frontend and backend will be hosted on separate routes, add the cors middleware to backend/index.js
// this is because for frontend to communicate with backend , frontend needs to send requests to the backend , but backend cannot entertain any requests so it mostly cancels the requests. CORS enables the backend to communicate with very specific frontend requests and not any other random requests made to it.
app.use(cors);



// Since we have to support the JSON body in post requests, add the express body parser middleware to backend/index.js
// You can use the body-parser npm library, or use express.json 
// Many of us that have been using the Node/Express Framework have been used to installing another piece of middleware in order for us to be able to read the “body” of an incoming JSON object. This piece of middleware was called body-parser and used to not be part of the Express framework

app.use(bodyParser.json());

// we can also use app.use(express.json()), this is an alternative to bodyParser , as it does te same work as bodyParser


app.listen(port,()=>{
    console.log(`server listening on port ${port} `);
})

