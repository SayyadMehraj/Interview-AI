import {React,useState} from 'react'
import {useNavigate,Link} from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth.js'

const Login = () => {
    //Bringing the hook layer -> Here we need to set the loading & login a user
    const {loading,handleLogin} = useAuth()
    //To go to different urls
    const navigate = useNavigate()

    //Setting two way binding such that when user types email or password 
    //The user state gets saved
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({email,password})
        navigate("/")
    }

    if(loading){
        return (<main><h1>Loading....</h1></main>)
    }

    return (
    //As now we create different kinds of reusable components those all will be in the main tag
    <main>
        <div className="form-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e) => {setEmail(e.target.value)}}
                    type="email" id="email" name="email" placeholder="Enter email address" />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    onChange={(e) => {setPassword(e.target.value)}}
                    type="password" id="password" name="password" placeholder="Enter password" />
                </div>

                <button className="button primary-button">Login</button>

            </form>

            <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
        </div>
    </main>
  )
}

export default Login