//This file contains all the authentication api routes 
import express from "express"
import {registerUserController,loginUserController,logoutUserController,getMeController} from "../controllers/auth.controller.js"
import authUser from "../middlewares/auth.middleware.js"

const authRouter = express.Router()

/**
 * Here we will be writing only the route all the registering user will be in the controller part
 * "When /register is requested, hand the request to registerUserController."
 */

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register",registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login a user with email & password
 * @access Public
 */
authRouter.post("/login",loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
authRouter.get("/logout",logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description Get the current logged in user details
 * @access Private
 */

authRouter.get("/get-me",authUser,getMeController)


export default authRouter