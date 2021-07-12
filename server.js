'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(cors());
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});
const {myUserModel} =require ('./modules/userModel');
const PORT = process.env.PORT;

app.get('/test', (request, response) => {
  response.send('done')
})
app.get('/book',getUserdata);
// http://localhost:3001/book?userEmail=sereen.aldaqamsih@gmail.com

function getUserdata(req,res){
  let userEmail = req.query.userEmail;

  myUserModel.find({email:userEmail},function(error,userDAta){
    console.log(userDAta);
    if (error){res.send(error);}
    else {res.send(userDAta[0].book);}
  
  })
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
