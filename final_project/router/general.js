const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

async function fetchallbooks(){
    try{
        const data = JSON.stringify(books)
        return data
    }
    catch(error){
        console.error('Error fetching data: ',error)
        throw error;
    }
}

async function fetchsinglebook(isbn){
    try{
        const data = books[isbn]
        return data
    }
    catch(error){
        console.error('Error fetching data', error)
    }
}

async function fetchbyauthor(author){
    try {
        let allbooks = Object.values(books)
        let authorbooks = allbooks.filter((book) => book.author === author)
        return authorbooks
    } catch (error) {
        console.error('error fetching data', error)   
    }
}

async function fetchbytitle(title){
    try {
        let allbooks = Object.values(books)
        let titlebooks = allbooks.filter((book) => book.title === title)
        return titlebooks
    } catch (error) {
        console.error('error fetching data', error)   
    }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookdata = await(fetchallbooks())
    res.send(bookdata)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookdata = await(fetchsinglebook(isbn))
  res.send(bookdata)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const authorbooks = await(fetchbyauthor(author))
  //let authorbooks = allBooks.filter((book) => book.author === author);
  res.send(authorbooks)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titlebooks = await(fetchbytitle(title))
  //let allBooks = Object.values(books)
  //let titlebooks = allBooks.filter((book) => book.title === title);
  res.send(titlebooks)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
