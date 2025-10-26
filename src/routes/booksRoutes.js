const express = require("express");
const Book = require("../models/Book");
const booksController = require("../controllers/booksController");
const isAuthenticatedUser = require("../middlewares/isAuth");
const { upload } = require("../service/cloudinary");

const bookRoute = express.Router();

//create a new book
bookRoute.post(
  "/create",
  isAuthenticatedUser,
  upload.single("image"),
  booksController.createBook
);

bookRoute.get("/all/books", isAuthenticatedUser, booksController.getAllBooks);

bookRoute.get(
  "/books/user",
  isAuthenticatedUser,
  booksController.getBooksForUser
);

bookRoute.delete(
  "/delete/:id",
  isAuthenticatedUser,
  booksController.deleteBook
);

module.exports = bookRoute;
