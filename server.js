'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(cors());

app.use(express.json());

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
app.get('/books',getUserdata);
// http://localhost:3001/book?userEmail=sereen.aldaqamsih@gmail.com
app.post('/book',addBookHandler);
app.delete('/deleteBook/:bookId',deleteBookHandler);

function getUserdata(req,res){
  let userEmail = req.query.userEmail;
  myUserModel.find({email:userEmail},function(error,userDAta){
    console.log(userDAta);
    if (error){res.send(error);}
    else {res.send(userDAta[0].book);}
  
  })}

  function addBookHandler (req,res) {

  let {addTitle,addDescription,addLink,addStatus,email}=req.body;

  myUserModel.find({email:email},(error,bookData) => {
    if (error)  { res.send('no data',error) }
    else {
      console.log('before',bookData);
    bookData[0].book.push({
      name:addTitle,
      status:addStatus,
      description:addDescription,
      img:addLink,

    })
  console.log('after',bookData[0]);
  bookData[0].save();
  res.send(bookData[0].book)
 } 
})
}

function deleteBookHandler (req,res) {
  // console.log(req.params)
  // console.log(req.query)
  let index = Number(req.params.bookId);
  // console.log(index)
  let email = req.query.email;
  myUserModel.find({email:email},(error,bookData)=>{
      if(error) {res.send('cant find user')}
      else{
        //  console.log('before deleting',bookData[0].book)

         let newBookData = bookData[0].book.filter((book,idx)=>{
             if(idx !== index) {return book}
          // return idx!==index
         })
         bookData[0].book=newBookData
         console.log('after deleting',bookData[0].book)
         bookData[0].save();
         res.send(bookData[0].book)
      }

  })
}
app.put('/updateBook/:bookId',updateBookHandler);

function updateBookHandler (req,res) {
  console.log(req.body);

  let {updateTitle,updateDescription,updateLink,updateStatus,email} = req.body;
  let index = Number(req.params.bookId);
  myUserModel.findOne({email:email},(error,updatedBook)=>{
      if(error){ res.send('error in finding the data')}
      else {
          updatedBook.book.splice( index,1,{
              name:updateTitle,
              description:updateDescription,
              status:updateStatus,
              img:updateLink,
          })
          updatedBook.save();
          res.send(updatedBook.book)
          
      }
  })

}
app.listen(PORT, () => console.log(`listening on ${PORT}`));
