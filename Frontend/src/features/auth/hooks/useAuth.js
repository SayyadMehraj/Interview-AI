import { useContext,useEffect } from "react";
//This is from State Layer
import { AuthContext } from "../auth.context.jsx"; 
//This is API Layer
import { login, logout, register,getMe } from "../services/auth.api.js";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context

    /**
     * Already talking with backend api is done by login function in services folder
     * The storing of user data in frontend is done by auth.context
     * This function handles the data from api and set to the storing data
     * also handles the loading when api is being called
     */
    const handleLogin = async ({email,password}) => {
        setLoading(true)
        try{
            const data = await login({email,password})
            setUser(data.user)
        }catch(err){

        }finally{
            setLoading(false)
        }
    }

    const handleRegister = async ({username,email,password}) => {
        setLoading(true)
        try{
            const data = await register({username,email,password})
            setUser(data.user)
        }catch(err){

        }finally{
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try{
            const data = await logout()
            setUser(null)
        }catch(err){

        }finally{
            setLoading(false)
        }
    }

    //There is small problem if the user is logged in and the user reloads the page
    //Then again it asks for login because by default the user state is being again set to null
    //So we can use getMe to know user is logged in or not then we can return that state
    //If we get any error also we set the loading to false state
    useEffect(() => {

        const getAndSetUser = async() => {
            try{
                const data = await getMe()
                setUser(data.user)
            }catch(err){

            }finally{
                setLoading(false)
            }
        }

        getAndSetUser()

    },[])

    return {user,loading,handleRegister,handleLogin,handleLogout}

}