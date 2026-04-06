import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LoginPage(){
    const[userName, setUserName] = useState("");
    const[password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try{
            const res = await API.post("/auth/login", {
                userName,
                password,
            });

            localStorage.setItem("token", res.data.token);
            const decoded = jwtDecode(res.data.token);
            console.log("Decoded JWT:", decoded);
            const role = decoded.role;
            localStorage.setItem("role", JSON.stringify(role));
            alert("Login Succesful");
            if(role === "ROLE_ADMIN"){
                navigate("/admin");
            }else{
                navigate("/dashboard");
            }
        } catch (err) {
            alert("Login failed");
            console.error(err);
        }
    };

    return(
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded-xl shadow-md w-80">
            <h2 className="text-2xl font-bold mb-6 text-center"> Login</h2>
            <input
                className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
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
                onClick={handleLogin}>Login</button>
             <br />
             <p
                className="text-sm text-center mt-4"
             >Don't have an account?
                <Link to="/signup" className="text-blue-500 hover:underline"> Signup here</Link>
             </p>
             </div>
        </div>
    )
}

export default LoginPage;