import { useEffect, useState } from "react";
import API from "../services/api";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const role = localStorage.getItem("role");
    const isAdmin = role === "ROLE_ADMIN";

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/user/me");
                setUser(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    const handleChangePassword = async () => {
        if(!oldPassword || !newPassword) {
            return alert("Both fields are required");
        }
        if(newPassword.length < 5 || newPassword.length > 14) {
            return alert("Password must be between 5-14 characters.");
        }
        try {
            await API.post("/user/changePass", { oldPassword, newPassword });
            alert("Password updated");

            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            alert("Failed to update password");
            console.error(err);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Delete your account?")) return;

        try {
            await API.delete("/user/delete");
            localStorage.clear();
            window.location.href = "/";
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10">
            <div className="bg-white p-6 rounded-xl shadow-md w-100">
                <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

                <div className="mb-6">
                    <p className="text-gray-700"><strong>Username:</strong> {user.userName}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                </div>
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Change Password</h3>
                    <input
                        className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-blue-400"
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <input
                        className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-blue-400"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
                        onClick={handleChangePassword}>
                            Update Password
                    </button>
                </div>
                {!isAdmin && (
                <div>
                    <h3 className="font-semibold text-red-400 mb-2">Danger Zone</h3>
                    <button
                        className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600" 
                        onClick={handleDeleteAccount}>
                            Delete Account
                    </button>
                </div>
                )}
            </div>  
        </div>
    );
}

export default ProfilePage;