//There is a flaw that if user is not logged in and the user can directly access to homepage in our case
//So to make sure that if a user is not logged in and the user is not allowed to certain pages
//Those certain would depend on application to application

import React from 'react'
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

//Here children is used to wrap the this around the homepage
//Its work is to just check if user is logged in or not
const Protected = ({children}) => {

    //Access user component
    const {loading,user} = useAuth()

    //Loading screen
    if(loading){
        return (<main><h1>Loading....</h1></main>)
    }

    //There is no user that means no user is logged in
    if(!user){
        //Simply return the user to login page
        return <Navigate to={"/login"}/>
    }


  return children
}

export default Protected