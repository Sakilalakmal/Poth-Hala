const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("MongoDB Connected Succesfully...");
            
        });
    } catch (error) {
        console.log("error connect to mongoDB",error.message);
        
    }

}

module.exports = connectDB;