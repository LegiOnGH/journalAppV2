import { useState } from "react";
import API from "../services/api";

export default function DeleteUserByUsername() {
    const [username, setUsername] = useState("");
    const [confirmInput, setConfirmInput] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDelete = async () => {
        if (!username.trim()) {
            return setMessage("Enter username");
        }

        setConfirmInput("");
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (confirmInput !== username) {
            return setMessage("Username mismatch. Deletion cancelled.");
        }

        try {
            setLoading(true);
            setMessage("");

            await API.delete(`/admin/delete/${username}`);

            setMessage("User deleted successfully");
            setUsername("");
            setShowConfirm(false);

        } catch (err) {
            console.error(err);
            setMessage("Failed to delete user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-red-500">Delete User</h3>

            <input
                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-400"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            {message && (
                <p className="text-sm text-center text-gray-600">
                    {message}
                </p>
            )}

            <button
                onClick={handleDelete}
                disabled={loading}
                className={`w-full p-2 text-white rounded transition active:scale-95 disabled:opacity-50 ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                }`}
            >
                {loading ? "Deleting..." : "Delete"}
            </button>

            {/* 🔴 Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg space-y-4 transform transition duration-200 scale-95 animate-in">

                        <h3 className="text-lg font-semibold">Confirm Deletion</h3>

                        <p className="text-gray-600 text-sm">
                            Type <strong>{username}</strong> to confirm
                        </p>

                        <input
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-400"
                            placeholder="Enter username"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                        />

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition active:scale-95"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                disabled={loading}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition active:scale-95 disabled:opacity-50"
                            >
                                Confirm
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}