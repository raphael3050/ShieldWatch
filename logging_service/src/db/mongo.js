import mongoose from 'mongoose';

// fonction pour se connecter à MongoDB
export const connect = async (uri) => {
    console.log("Connecting to MongoDB...");
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}