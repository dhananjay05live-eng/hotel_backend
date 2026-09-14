import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const connectionInstance = mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eupq2kb.mongodb.net/`,
        );
        console.log(`MONGODB CONNECTED SUCCESSFULLY!!`);
    } catch (error) {
        console.log(`MONGO DB CONNECTION FAILED error:`, error);
        throw error;
    }
};

export { connectDB };
