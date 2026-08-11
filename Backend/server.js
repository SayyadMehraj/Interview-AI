import app from "./src/app.js";
import dotenv from "dotenv";
import connectToDB from "./src/config/database.js";

// Read the .env file and load its variables into process.env
dotenv.config()

// Call the database function 
connectToDB()

app.listen(3000, () => {
    console.log("Server is running on Port 3000");
})

