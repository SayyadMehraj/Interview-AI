import express from "express"
import authUser from "../middlewares/auth.middleware.js"
import { generateInterviewReportController } from "../controllers/interview.controller.js"
import upload from "../middlewares/file.middleware.js"

const interviewRouter = express.Router()

//We will redirecting the request when an user is logged in
//When the user is authenticated then the user can upload the pdf-file
/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self description, resume pdf & job description
 * @access private 
 */
interviewRouter.post("/", authUser, upload.single("resume"), generateInterviewReportController)


export default interviewRouter