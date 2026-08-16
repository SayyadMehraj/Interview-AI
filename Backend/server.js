// Read the .env file and load its variables into process.env
//This syntax is used to avoid env file reading later 
//Before Importing anything we should configure dotenv to avoid env failures
import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";


// Call the database function 
connectToDB()

app.listen(3000, () => {
    console.log("Server is running on Port 3000");
})

