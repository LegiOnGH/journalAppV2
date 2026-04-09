import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { parseError } from "../utils/errorHandler";
import "../index.css";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const isAdmin = role === "ROLE_ADMIN";

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setError("");
                const res = await API.get("/user/me");
                setUser(res.data);
            } catch (err) {
                const parsed = parseError(err);
                setError(parsed.message);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            setError("Both fields are required");
            return;
        }

        if (newPassword.length < 5 || newPassword.length > 14) {
            setError("Password must be between 5-14 characters.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await API.post("/user/changePass", { oldPassword, newPassword });
            setSuccess("Password updated successfully");

            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            const parsed = parseError(err);
            if(parsed.isUnauthorized){
                localStorage.clear();
                navigate("/");
                return;
            }
            if(parsed.isValidationError){
                setFieldErrors(parsed.fieldErrors);
                setError(parsed.message);
                return;
            }
            setError(parsed.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Delete your account?")) return;

        try {
            await API.delete("/user/delete");
            localStorage.clear();
            navigate("/");
        } catch (err) {
            const parsed = parseError(err);
            if(parsed.isUnauthorized){
                localStorage.clear();
                navigate("/");
                return;
            }
            setError(parsed.message);
        }
    };

    if (error && !user) return <p className="error text-center">{error}</p>;
    if (!user) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="page-container">
            <div className="card max-w-md space-y-4">
                <button
                    onClick={() => navigate(-1)}
                    className="link self-start"
                >
                    Back
                </button>

                <h2 className="h2">Profile</h2>

               

                <div className="space-y-1">
                    <p><strong>Username:</strong> {user.userName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>

                {error && <p className="error text-center">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="space-y-3">
                    <h3 className="font-semibold">Change Password</h3>

                    <input
                        className="input"
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => {
                            setOldPassword(e.target.value);
                            setFieldErrors(prev => ({ ...prev, oldPassword: "" }));
                        }}
                    />
                        {fieldErrors.oldPassword && (
                            <p className="error">{fieldErrors.oldPassword}</p>
                        )}

                    <input
                        className="input"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                        {fieldErrors.newPassword && (
                            <p className="error">{fieldErrors.newPassword}</p>
                        )}

                    <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>

                {!isAdmin && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-red-500">Danger Zone</h3>

                        <button
                            onClick={handleDeleteAccount}
                            className="btn-danger w-full"
                        >
                            Delete Account
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ProfilePage;