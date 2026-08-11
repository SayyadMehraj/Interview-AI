// Bring the Express library into this file so I can use it.
import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

// creates your Express application.
const app = express();

// "Whenever a request contains JSON data, parse that JSON so that I can easily access it in req.body."
app.use(express.json())

// Lets your server read cookies from incoming HTTP requests.  
app.use(cookieParser())

//All the auth related api's will be directed to authRouter file
app.use("/api/auth",authRouter)


export default app
