const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const bookRoute = require("./routes/booksRoutes");
dotenv.config();
const cors = require("cors");

//initialize app
const app = express();

const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//connect to database
connectDB();

//define routes
app.use("/api/auth", authRouter);
app.use("/api/books", bookRoute);
//start the server
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
