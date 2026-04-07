import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function SignupPage(){
    const[userName, setUserName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[loading, setLoading] = useState(false);
    const[errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!userName.trim() || !email.trim() || !password) {
            return alert("All fields are required");
        }
        try{
            setLoading(true);
            await API.post("/auth/signup", {
                userName,
                email,
                password,
            }); 

            alert("Signup Successful! Please login.");
            navigate("/");
        } catch (err) {
            const data = err.response?.data;
            if(data?.errors){
                setErrors(data.errors);
            } else{
                alert(data?.message || "Signup failed");
            }
            console.log(err);
        }finally {
            setLoading(false);
        }
    }; 

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center"> Signup</h2>
                <form onSubmit={handleSignup} className="space-y-4">
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
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />  
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p> 
                    )}
                    <input
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p> 
                    )}
                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50 ${loading ? "cursor-not-allowed" : ""}`}
                        disabled={loading}>
                            {loading ? "Signing up..." : "Signup"}
                    </button>
                </form>
                <p className="text-sm text-center mt-4">
                    Already have an account?
                    <Link to="/" className="text-blue-500 hover:underline ml-1">Login here</Link>
                </p>
            </div>
        </div>
    )
}

export default SignupPage;