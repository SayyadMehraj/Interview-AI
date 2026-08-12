import { createContext,useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    //Intially there will be no user
    const [user, setUser] = useState(null)

    //Intially there will be no loading but in the production level
    //we will make it to true - (User Hydration)
    const [loading, setLoading] = useState(false)

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}