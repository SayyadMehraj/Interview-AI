//This file purpose is that it is used to connect to the database

import mongoose from "mongoose";

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to Database")
    }catch(err){
        console.log(err)
    }
}

export default connectToDB