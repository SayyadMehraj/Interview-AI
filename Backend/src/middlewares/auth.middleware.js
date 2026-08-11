import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

// Middleware requires 3 parameters
async function authUser(req,res,next){

    //Get token from the browser cookies
    const token = req.cookies.token

    //If there is no token then we cannot tell the user
    if(!token){
        return res.status(401).json({
            message:"Token not provided."
        })
    }

    //We also need to check whether the token is blacklisted or not
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"Token is invalid."
        })
    }

    //We need to verify the token
    try{
        //"Is this token genuinely created by my server, has nobody tampered with it, and has it not expired
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        //Here we are creating a new element in the request
        req.user = decoded

        //"The token has been successfully verified. I'm going to attach the user's information to the request so the next function can use it."
        next()
    }catch(err){
        return res.status(401).json({
            message:"Invalid Token."
        })
    }
}

export default authUser 