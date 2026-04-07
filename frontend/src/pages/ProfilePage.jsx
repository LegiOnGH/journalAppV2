import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const isAdmin = role === "ROLE_ADMIN";

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/user/me");
                setUser(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load profile");
            }
        };
        fetchUser();
    }, []);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            return alert("Both fields are required");
        }

        if (newPassword.length < 5 || newPassword.length > 14) {
            return alert("Password must be between 5-14 characters.");
        }

        try {
            setLoading(true);

            await API.post("/user/changePass", { oldPassword, newPassword });
            alert("Password updated");

            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            alert("Failed to update password");
            console.error(err);
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
            console.error(err);
        }
    };

    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!user) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-6">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
                <button
                    onClick={() => navigate(-1)}
                    className="self-start text-sm text-blue-500 hover:underline"
                >
                    Back
                </button>

                <h2 className="text-2xl font-bold text-center">Profile</h2>
                <div className="space-y-1">
                    <p className="text-gray-700"><strong>Username:</strong> {user.userName}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Change Password</h3>

                    <input
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <input
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>

                {!isAdmin && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-red-500">Danger Zone</h3>

                        <button
                            onClick={handleDeleteAccount}
                            className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition active:scale-95"
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