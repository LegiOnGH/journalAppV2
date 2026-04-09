import { useState } from "react";
import API from "../services/api";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import { parseError } from "../utils/errorHandler";

function SignupPage(){
    const[userName, setUserName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState("");
    const[fieldErrors, setFieldErrors] = useState({});

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!userName.trim() || !email.trim() || !password) {
            setError("All fields are required");
            return;
        }
        try{
            setLoading(true);
            setError("");
            setFieldErrors({});
            await API.post("/auth/signup", {
                userName,
                email,
                password,
            }); 
            navigate("/");
        } catch (err) {
            const parsed = parseError(err);
            if(parsed.isValidationError){
                setFieldErrors(parsed.fieldErrors);
            setError(parsed.message);
            return;
            }
            setError(parsed.message);
        }finally {
            setLoading(false);
        }
    }; 

    return(
        <div className="page-container">
            <div className="card max-w-sm">
                <h2 className="h2"> Signup</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                    {error && (<p className="error text-center">{error}</p>)}
                    <input
                        className="input"
                        placeholder="Username"
                        autoComplete="username"
                        value={userName}
                        onChange={(e) => {
                            const value = e.target.value;
                            if(!/\s/.test(value)){
                                setUserName(value);
                            }
                        }}
                        autoFocus
                    />  
                    {fieldErrors.userName && (
                        <p className="error">{fieldErrors.userName}</p> 
                    )}
                    <input
                        className="input"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />  
                    {fieldErrors.email && (
                        <p className="error">{fieldErrors.email}</p> 
                    )}
                    <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => { 
                            setPassword(e.target.value);
                            setFieldErrors(prev => ({ ...prev, password: "" }))
                        }}
                    />
                    {fieldErrors.password && (
                        <p className="error">{fieldErrors.password}</p> 
                    )}
                    <button
                        type="submit"
                        className={`btn-primary w-full ${loading ? "cursor-not-allowed" : ""}`}
                        disabled={loading}>
                            {loading ? "Signing up..." : "Signup"}
                    </button>
                </form>
                <p className="text-sm text-center mt-4">
                    Already have an account?
                    <Link to="/" className="link ml-1">Login here</Link>
                </p>
            </div>
        </div>
    )
}

export default SignupPage;