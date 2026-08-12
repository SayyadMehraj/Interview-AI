//In this file we write logic that how to communicate with the server and also handle the data from the server
import axios from "axios";

//As we need username,email,password to register a user in the database and also
//we will be sending these parameters as object
// export async function register({username,email,password}){
//     //There may be chances of server down, bad internet connection so to handle those errors
//     try{
//         const response = await axios.post("http://localhost:3000/api/auth/register",{
//             username,email,password
//         },{
//             withCredentials:true
//         })

//         return response.data
//     }catch(err){
//         console.log(err);
//     }
// }

/**
 * Basically we can see that always we need to give the url and withCredentials
 * so when can configure axios to avoid repetation
 * Instead of axios.post we will be using api.post
 */

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export async function register({username,email,password}) {
    
    try{
        const response = await api.post("/api/auth/login",{
            username,email,password
        })
        
        return response.data
    }catch(err){
        console.log(err)
    }
}

export async function login({email,password}) {
    
    try{
        const response = await api.post("/api/auth/login",{
            email,password
        })
        
        return response.data
    }catch(err){
        console.log(err)
    }
}

export async function logout() {
    try{
        const response = await api.get("/api/auth/logout")

        return response.data
    }catch(err){
        console.log(err)
    }
}

export async function getMe() {
    try{
        const response = await api.get("/api/auth/get-me")

        return response.data
    }catch(err){
        console.log(err)
    }
}