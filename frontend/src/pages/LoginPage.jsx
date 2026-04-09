import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { parseError } from "../utils/errorHandler";
import "../index.css";

function LoginPage(){
    const[userName, setUserName] = useState("");
    const[password, setPassword] = useState("");
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState("");
    const[fieldErrors, setFieldErrors] = useState({});

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!userName || !password) {
            setError("Username and password are required");
            return;
        }
        try{
            setLoading(true);
            setError("");
            setFieldErrors({});
            const res = await API.post("/auth/login", {
                userName,
                password,
            });

            localStorage.setItem("token", res.data.token);
            const decoded = jwtDecode(res.data.token);
            const role = decoded.role;
            localStorage.setItem("role", role);
            navigate(role === "ROLE_ADMIN" ? "/admin" : "/dashboard");
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
            <h2 className="h2"> Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
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
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)
                    setFieldErrors(prev => ({ ...prev, password: "" }))
                }}
                />
                {fieldErrors.password && (
                    <p className="error">{fieldErrors.password}</p>
                )}
                <button 
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                    >{loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="text-sm text-center mt-4">
                    Don't have an account?
                <Link to="/signup" className="link ml-1"> Signup here</Link>
            </p>
            </div>
        </div>
    )
}

export default LoginPage;