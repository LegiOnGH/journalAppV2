import { useState } from "react";
import API from "../services/api";
import { parseError } from "../utils/errorHandler";

export default function DeleteUserByUsername() {
    const [username, setUsername] = useState("");
    const [confirmInput, setConfirmInput] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleDelete = async () => {
        if (!username.trim()) {
            setError("Enter username");
            return;
        }

        setError("");
        setSuccess("");
        setConfirmInput("");
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (confirmInput !== username) {
            setError("Username mismatch");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await API.delete(`/admin/delete/${username}`);

            setSuccess("User deleted successfully");
            setUsername("");
            setShowConfirm(false);

        } catch (err) {
            const parsed = parseError(err);
            setError(parsed.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-red-500">Delete User</h3>

            <input
                className="input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            {error && (
                <p className="error text-center">
                    {error}
                </p>
            )}
            {success && (
                <p className="success">
                    {success}
                </p>
            )}

            <button
                onClick={handleDelete}
                disabled={loading}
                className={"btn-danger w-full"}
            >
                {loading ? "Deleting..." : "Delete"}
            </button>

            {/* 🔴 Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="card max-w-sm text-center space-y-4 ">

                        <h3 className="text-lg font-semibold">Confirm Deletion</h3>

                        <p className="text-gray-600 text-sm">
                            Type <strong>{username}</strong> to confirm
                        </p>

                        <input
                            className="input"
                            placeholder="Enter username"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                        />

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                disabled={loading}
                                className="btn-danger"
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