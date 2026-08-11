import mongoose from "mongoose";

//"I want to create a structure for storing blacklisted tokens."
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be added in Blacklist"]
    }
}, {
    //Because you know when the token was blacklisted.
    timestamps: true
})

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)

export default tokenBlacklistModel