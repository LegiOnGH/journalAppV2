import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LoginPage(){
    const[userName, setUserName] = useState("");
    const[password, setPassword] = useState("");
    const[loading, setLoading] = useState(false);
    const[errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!userName.trim() || !password) {
            return alert("Username and password are required");
        }
        try{
            setLoading(true);
            const res = await API.post("/auth/login", {
                userName,
                password,
            });

            localStorage.setItem("token", res.data.token);
            const decoded = jwtDecode(res.data.token);
            const role = decoded.role;
            localStorage.setItem("role", role);
            if(role === "ROLE_ADMIN"){
                navigate("/admin");
            }else{
                navigate("/dashboard");
            }
        } catch (err) {
            const data = err.response?.data;
            if(data?.errors){
                setErrors(data.errors);
            }else{
                alert(data?.message || "Login failed");
            }
            console.log(err)
        }finally {
            setLoading(false);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded-xl shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center"> Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)} 
                    autoFocus
                />
                {errors.userName && (
                    <p className="text-red-500 text-sm">{errors.userName}</p>
                )}
                <input
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                )}
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                    >{loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="text-sm text-center mt-4">
                    Don't have an account?
                <Link to="/signup" className="text-blue-500 hover:underline ml-1"> Signup here</Link>
            </p>
            </div>
        </div>
    )
}

export default LoginPage;