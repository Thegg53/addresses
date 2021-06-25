const express = require('express');
const routes = require('./routes/routes');

const port = 8080;

const app = express();


//this can be public, no need for middleware to check here
app.get('/', (req, res) => {
  console.log('someone is visiting the home page :) ')
  res.send('Hello World!')
}); //default route to make sure that the server is up

//this requires a specific bearer token. This is not proper authentication
//but it serves the purpose for this simple test.
app.get("*", (req,res, next)=>{
//   if (req.headers.authorization == "bearer dGhlc2VjcmV0dG9rZW4=" ||
//   req.headers.authorization == "Bearer dGhlc2VjcmV0dG9rZW4="){
// //NOTE:  added the Bearer with uppercase to ease testing with Postman
// note2: found new settings in Postman that allow easier testing :D

    if (req.headers.authorization == "bearer dGhlc2VjcmV0dG9rZW4="){
      next()
  } else {
    
    return res.sendStatus(401)
  }
})

//connect to routes file, not needed on smaller projects, 
// but nice to set it up to avoid the main server file getting too big 
app.use('/', routes); 


app.listen(port, () => { 
  console.log(`API listening at http://localhost:${port}`)
})

module.exports = app;