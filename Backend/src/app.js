// Bring the Express library into this file so I can use it.
import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import interviewRouter from "./routes/interview.routes.js";

//To handle cors error
import cors from "cors"

// creates your Express application.
const app = express();

// "Whenever a request contains JSON data, parse that JSON so that I can easily access it in req.body."
app.use(express.json())

// Lets your server read cookies from incoming HTTP requests.  
app.use(cookieParser())

//Handle cors error
//Origin is the frontend url, credentials:true means we are allowing cookies to be sent from frontend to backend
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

//All the auth related api's will be directed to authRouter file
app.use("/api/auth", authRouter)

//Importing the interview routes section
app.use("/api/interview", interviewRouter)

export default app
