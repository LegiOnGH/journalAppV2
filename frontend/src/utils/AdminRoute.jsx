import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const role = JSON.parse(localStorage.getItem("role")|| "[]");  
    if (role==="ADMIN") {
        return <Navigate to="/dashboard" />;
    }
    return children;
}

export default AdminRoute;