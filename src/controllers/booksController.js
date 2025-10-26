const Book = require("../models/Book");
const { cloudinary } = require("../service/cloudinary");

const booksController = {
  createBook: async (req, res) => {
    try {
      const { title, caption, rating } = req.body;

      if (!title || !caption || !rating) {
        return res.status(400).json({ message: "Please provide all fields" });
      }

      const image = req.files ? req.files.map((file) => file.path) : [];

      if (image.length === 0) {
        return res.status(400).json({ message: "Provide an image of book" });
      }

      const newBook = new Book({
        title,
        caption,
        rating,
        image,
        user: req.user._id,
      });

      await newBook.save();
      return res
        .status(201)
        .json({ message: "Book created successfully", book: newBook });
    } catch (error) {
      console.error("Error creating book:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllBooks: async (req, res) => {
    try {
      const userId = req.user ? req.user._id : null;

      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit || 5;
      const skip = (page - 1) * limit;

      const books = await Book.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email");

      const count = await Book.countDocuments();

      if (!books) {
        return res.status(404).json({
          message: "No books found stay hand on books will coming soon...",
        });
      }

      return res.status(200).json({
        count,
        totalPages: Math.ceil(count / limit),
        books,
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getBooksForUser: async (req, res) => {
    try {
      const userId = req.user ? req.user._id : null;

      const books = await Book.find({ user: userId }).sort({ createdAt: -1 });

      const count = await Book.countDocuments({ user: userId });
      if (!books) {
        return res.status(404).json({
          message: "No books found for this user.",
        });
      }
      return res.status(200).json({ count, books });
    } catch (error) {
      console.error("Error fetching books for user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteBook: async (req, res) => {
    try {
      const bookId = req.params.id;
      const userId = req.user ? req.user._id : null;

      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      //check the user is the owner of this book
      if (userId.toString() !== book.user.toString()) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this book" });
      }

      if (book.image && book.image.length > 0) {
        for (const imageUrl of book.image) {
          const publicId = getPublicIdFromUrl(imageUrl);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      }

      await Book.findByIdAndDelete(bookId);
      return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error("Error deleting book:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = booksController;
