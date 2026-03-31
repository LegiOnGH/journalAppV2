import { useState } from "react";
import API from "../services/api";

function SignupPage(){
    const[userName, setUserName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");


    const handleSignup = async () => {
        try{
            await API.post("/auth/signup", {
                userName,
                email,
                password,
            }); 

            alert("Signup Succesful! Please login.");
            window.location.href = "/";
        } catch (err) {
            alert("Signup failed");
        }
    }; 

    return(
        <div>
            <h2> Signup</h2>
            <input
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
            />  
            <br />
            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />  
            <br />
            <input
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
             />
             <br />
             <button onClick={handleSignup}>Signup</button>
             <br />
             <p>Already have and account?
                <a href="/"> Login here</a>
             </p>
        </div>
    )
}

export default SignupPage;