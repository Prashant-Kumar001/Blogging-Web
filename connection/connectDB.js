import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const URL = process.env.REMOTE_DATA_BASE_CONNECTING_STRING;
// const URL = process.env.lOCAL_CONNECTING_STRING

const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
};

const Db = mongoose.connection;

Db.on('connected', () => {
    console.log("Successfully connected to MongoDB server");
});

Db.on('disconnected', () => {
    console.log("Disconnected from MongoDB server");
});

Db.on('error', (err) => {
    console.error("Error with MongoDB connection:", err);
});

connectDB();

export default Db;
