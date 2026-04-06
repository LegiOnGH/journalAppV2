import { useEffect, useState } from "react";
import API from "../services/api";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

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

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h2>Profile</h2>

            <p>Username: {user.userName}</p>
            <p>Email: {user.email}</p>

            <h3>Change Password</h3>
            <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>
                Update Password
            </button>

            <h3>Danger Zone</h3>
            <button onClick={handleDeleteAccount}>
                Delete Account
            </button>
        </div>
    );
}

export default ProfilePage;