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

    const role = localStorage.getItem("role");
    const isAdmin = role === "ROLE_ADMIN";

    const fetchJournal = async () => {
        try {
            const res = await API.get(`/journal/get/${id}`);
            setJournal(res.data);
            setOriginalJournal(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchJournal();
    }, [id]);

    const handleDelete = async () => {
        try {
            await API.delete(`/journal/delete/${id}`);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const updatedData = {
                title: journal.title,
                content: journal.content,
                sentiment: journal.sentiment,
            };

            await API.patch(`/journal/update/${id}`, updatedData);

            setOriginalJournal(journal);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setJournal(originalJournal);
        setIsEditing(false);
    };

    if (!journal) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10">
            <div className="bg-white p-6 rounded-xl shadow-md w-125">
                <button className="mb-4 text-sm text-blue-500 hover:underline" onClick={() => navigate(-1)}>
                    Back
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">Journal Entry</h2>

                {isAdmin && <p className="text-center text-gray-500 mb-4">Read-only view</p>}

                {isEditing ? (
                    <>
                        <input
                            className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-blue-400"
                            value={journal.title}
                            onChange={(e) =>
                                setJournal({ ...journal, title: e.target.value })
                            }
                        />

                        <textarea
                            className="w-full p-2 border rounded mb-3 h-32 focus:ring-2 focus:ring-blue-400"
                            value={journal.content}
                            onChange={(e) =>
                                setJournal({ ...journal, content: e.target.value })
                            }
                        />

                        <select
                            className="w-full p-2 border rounded mb-4"
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
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold mb-2">{journal.title}</h3>
                        <p className="text-gray-700 mt-2 whitespace-pre-line">{journal.content}</p>
                        <p className="mt-4 text-sm text-blue-500 font-medium">Sentiment: {journal.sentiment}</p>
                    </>
                )}

                {!isAdmin && (
                    <div className="flex justify-between mt-6">
                        {!isEditing ? (
                            <>
                                <button 
                                    className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 active:scale-95 transition"
                                    onClick={() => setIsEditing(true)}>
                                        Edit
                                </button>

                                <button 
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 active:scale-95 transition"
                                    onClick={() => setShowConfirm(true)}>
                                        Delete
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={handleCancel}>Cancel</button>
                                <button 
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                    onClick={handleUpdate}
                                    disabled={loading}>
                                        {loading ? "Saving..." : "Save"} </button>
                            </>
                        )}
                    </div>
                )}
                </div>

                {/* Confirm Delete Modal */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg">
                            <h3 className="text-lg font-semibold mb-2">Delete Entry?</h3>
                            <p className="text-gray-600 mb-4">This action cannot be undone.</p>

                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={async () => {
                                        await handleDelete();
                                        setShowConfirm(false);
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}


export default JournalDetailPage;