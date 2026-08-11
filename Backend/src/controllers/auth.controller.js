import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js"

/**
 * @name registerUserController
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */

async function registerUserController(req,res) {

    //Destructure the username,email,password from the request body -> Object Destructuring
    const {username,email,password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide username,email and password"
        })
    }

    // Need to check if the user already exists or not
    //findOne() means: MongoDB, find me one document that matches this condition.
    const isUserAlreadyExists = await userModel.findOne({
        //'or' asks for array of conditions, in this we can define our required conditions
        //we define our conditions in the '{}' if anyone of them is satisfied then return true
        $or:[{username},{email}]
    })

    if(isUserAlreadyExists){
        if(isUserAlreadyExists.username === username){
            return res.status(400).json({
                message:"Account already exists with this username. Try another username"
            })
        }else if(isUserAlreadyExists.email === email){
            return res.status(400).json({
                message:"Account already exists with this email id."
            })
        }
    }

    //We dont the password directly into the db we hash it then store it.
    const hash = await bcrypt.hash(password,10)

    //Store user details into database
    const user = await userModel.create({
        username,
        email,
        password:hash
    })
    
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token",token)

    res.status(201).json({
        message:"User registered successfully.",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 * @name loginUserController
 * @description Login a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req,res) {
    
    const {email,password} = req.body

    //Check whether user exists or not
    const user = await userModel.findOne({email})

    //User doesn't exist
    if(!user){
        return res.status(400).json({
            message:"No user account exists with this email"
        })
    }

    //Verifying the password
    const isPasswordValid = await bcrypt.compare(password,user.password)

    //Wrong password
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Wrong password"
        })
    }

    const token = jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)

    res.status(200).json({
        message:"User loggedIn successfully.",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description Logout a user, get the token from cookie, add it to the blacklist & remove the cookies
 * @access Public
 */

async function logoutUserController(req,res) {

    const token = req.cookies.token

    //If token exists add it to the blacklist
    if(token){
        await tokenBlacklistModel.create({token})
    }
    
    //Clear the cookie from user side
    res.clearCookie("token")

    res.status(200).json({
        message:"User logged out successfully."
    })
}


/**
 * @name getMeController
 * @description Get the current logged in user details
 * @access Private
 */

async function getMeController(req,res){

    //Already we have written authUser middleware so that the middleware sends the cookie forward through request
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"User details fetched successfully.",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}


export {registerUserController,loginUserController,logoutUserController,getMeController}