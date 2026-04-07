import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function JournalDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [journal, setJournal] = useState(null);
    const [originalJournal, setOriginalJournal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const role = localStorage.getItem("role");
    const isAdmin = role === "ROLE_ADMIN";

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                const res = await API.get(`/journal/get/${id}`);
                setJournal(res.data);
                setOriginalJournal(res.data);
            } catch (err) {
                console.error(err);
                const data = err.response?.data;
                if (data?.errors) {
                    setErrors(data.errors);
                } else {
                    alert(data?.message || "Failed to load journal entry");
                }
            }
        };
        fetchJournal();
    }, [id]);

    const handleDelete = async () => {
        try {
            await API.delete(`/journal/delete/${id}`);
            navigate(isAdmin ? "/admin" : "/dashboard");
        } catch (err) {
            console.error(err);
            const data = err.response?.data;
            if (data?.errors) {
                setErrors(data.errors);
            } else {
                alert(data?.message || "Failed to delete journal entry");
            }
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);

            await API.patch(`/journal/update/${id}`, {
                title: journal.title,
                content: journal.content,
                sentiment: journal.sentiment,
            });

            setOriginalJournal(journal);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            const data = err.response?.data;
            if (data?.errors) {
                setErrors(data.errors);
            } else {
                alert(data?.message || "Failed to update journal entry");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setJournal(originalJournal);
        setIsEditing(false);
    };

    if (errors.general) {
        return <p className="text-center mt-10 text-red-500">{errors.general}</p>;
    }

    if (!journal) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4">

                <button
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>

                <h2 className="text-2xl font-bold text-center">
                    Journal Entry
                </h2>

                {isAdmin && (
                    <p className="text-center text-gray-500">
                        Read-only view
                    </p>
                )}

                {isEditing ? (
                    <div className="space-y-3">
                        <input
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                            value={journal.title}
                            onChange={(e) =>
                                setJournal({ ...journal, title: e.target.value })
                            }
                        />

                        <textarea
                            className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-400"
                            value={journal.content}
                            onChange={(e) =>
                                setJournal({ ...journal, content: e.target.value })
                            }
                        />

                        <select
                            className="w-full p-2 border rounded"
                            value={journal.sentiment}
                            onChange={(e) =>
                                setJournal({
                                    ...journal,
                                    sentiment: e.target.value,
                                })
                            }
                        >
                            <option value="HAPPY">Happy</option>
                            <option value="SAD">Sad</option>
                            <option value="ANGRY">Angry</option>
                            <option value="NEUTRAL">Neutral</option>
                        </select>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border space-y-3">

                        <h3 className="text-2xl font-bold text-gray-800">
                            {journal.title}
                        </h3>

                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {journal.content}
                        </p>

                        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600">
                            {journal.sentiment}
                        </span>

                    </div>
                )}

                {!isAdmin && (
                    <div className="flex justify-center gap-10 pt-2">
                        {!isEditing ? (
                            <>
                                <button
                                    className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 transition active:scale-95"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition active:scale-95"
                                    onClick={() => setShowConfirm(true)}
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition active:scale-95"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition active:scale-95 disabled:opacity-50"
                                    onClick={handleUpdate}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </>
                        )}
                    </div>
                )}

            </div>

            {/* Confirm Delete Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg space-y-4">

                        <h3 className="text-lg font-semibold">
                            Delete Entry?
                        </h3>

                        <p className="text-gray-600">
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition active:scale-95"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await handleDelete();
                                    setShowConfirm(false);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition active:scale-95"
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

export default JournalDetailPage;