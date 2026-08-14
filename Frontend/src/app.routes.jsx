import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/Login.jsx"
import Register from "./features/auth/pages/Register.jsx"
import Protected from "./features/auth/components/Protected.jsx"


export const router = createBrowserRouter([
    {
        //What is the route
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        //Here we first checking is user logged in then we allow them to the home-page
        element:<Protected><h1>Home Pagee</h1></Protected>
    }
])