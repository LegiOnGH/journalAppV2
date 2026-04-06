import { useState } from "react";
import API from "../services/api";

export default function DeleteUserByUsername() {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!username.trim()) {
            return alert("Enter username");
        }

        const confirmText = prompt(
            `Type "${username}" to confirm deletion`
        );

        if (confirmText !== username) {
            return alert("Username mismatch. Deletion cancelled.");
        }

        try {
            setLoading(true);

            await API.delete(`/admin/delete/${username}`);

            alert("User deleted");
            setUsername("");

        } catch (err) {
            console.error(err);
            alert("Failed to delete user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Delete User</h3>

            <input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <button onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}