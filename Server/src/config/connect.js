import mongoose from "mongoose";

export const connectDb = async(uri) => {
    try {
        mongoose.connect(uri)
        console.log(`Connection to Databse Successfull`);

    } catch (error) {
        console.log(`Error while connecting database : ${error}`);
    }
}