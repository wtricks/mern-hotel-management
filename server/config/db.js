import mongoose from "mongoose";

/**
 * Connects to the MongoDB database using the connection string stored in the
 * MONGO_URI environment variable. If the connection is successful, logs a
 * message to the console indicating that the connection was established. If the
 * connection is unsuccessful, logs an error message to the console and
 * terminates the process with a non-zero exit code.
 */
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};