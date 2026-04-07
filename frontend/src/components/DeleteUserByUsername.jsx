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
            <h3 className="font-semibold mb-3 text-red-500">Delete User</h3>

            <input
                className="p-2 border rounded mb-4 w-full focus:ring-2 focus:ring-red-400"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <button onClick={handleDelete} disabled={loading}
                className={`w-full p-2 text-white rounded disabled:opacity-50 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}>
                {loading ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}