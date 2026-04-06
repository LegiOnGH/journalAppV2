import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function SignupPage(){
    const[userName, setUserName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    const navigate = useNavigate();


    const handleSignup = async () => {
        try{
            await API.post("/auth/signup", {
                userName,
                email,
                password,
            }); 

            alert("Signup Succesful! Please login.");
            navigate("/");
        } catch (err) {
            alert("Signup failed");
            console.error(err);
        }
    }; 

    return(
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-80">
            <h2 className="text-2xl font-bold mb-6 text-center"> Signup</h2>
            <input
                className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
            />  
            <br />
            <input
                className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />  
            <br />
            <input
                className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
             />
             <br />
             <button
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                onClick={handleSignup}>Signup</button>
             <br />
             <p
                className="text-sm text-center mt-4"
             >Already have an account?
                <Link to="/" className="text-blue-500 hover:underline"> Login here</Link>
             </p>
        </div>
        </div>
    )
}

export default SignupPage;