import { useState } from "react";
import API from "../services/api";

function LoginPage(){
    const[userName, setUserName] = useState("");
    const[password, setPassword] = useState("");

    const handleLogin = async () => {
        try{
            const res = await API.post("/auth/login", {
                userName,
                password,
            });

            localStorage.setItem("token", res.data.token);
            alert("Login Succesful");
            window.location.href = "/dashboard";
        } catch (err) {
            alert("Login failed");
        }
    };

    return(
        <div>
            <h2> Login</h2>
            <input
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
            />
            <br />
            <input
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
             />
             <br />
             <button onClick={handleLogin}>Login</button>
             <br />
             <p>Don't have an account?
                <a href="/signup"> Signup here</a>
             </p>
        </div>
    )
}

export default LoginPage;