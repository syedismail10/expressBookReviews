const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return false;
      } else {
        return true;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    let validuser = authenticatedUser(username,password)
   if (validuser) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewContent = req.query.review;
  let username = req.session.authorization.username
  console.log(isbn)
  console.log(username)
  if (!username){
    return res.status(401).send("User not logged in")
  }

  if (!books[isbn]){
    return res.send("Book not found");
  }
  if (!books[isbn].reviews){
    books[isbn].reviews = {}
  }
  books[isbn].reviews [username] = reviewContent

  return res.send("Review submitted successfully")
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Decode the JWT to extract the username
    let username = req.session.authorization.username
    if (!username) {
        return res.status(401).send("User not logged in");
    }

    if (!books[isbn]) {
        return res.status(404).send("Book not found");
    }

    // Check if the user has a review for the book
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        // Delete the review
        delete books[isbn].reviews[username];
        return res.send("Review deleted successfully");
    } else {
        return res.status(404).send("Review not found");
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
