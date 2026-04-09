import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { parseError } from "../utils/errorHandler";
import "../index.css";

function JournalDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [journal, setJournal] = useState(null);
    const [originalJournal, setOriginalJournal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const role = localStorage.getItem("role");
    const isAdmin = role === "ROLE_ADMIN";

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                setError("");
                const res = await API.get(`/journal/get/${id}`);
                setJournal(res.data);
                setOriginalJournal(res.data);
            } catch (err) {
                const parsed = parseError(err);
                setError(parsed.message);
            }
        };
        fetchJournal();
    }, [id, navigate]);

    const handleDelete = async () => {
        try {
            await API.delete(`/journal/delete/${id}`);
            navigate(isAdmin ? "/admin" : "/dashboard");
        } catch (err) {
            const parsed = parseError(err);
            if (parsed.isUnauthorized) {
                localStorage.clear();
                navigate("/");
                return;
            }
            setError(parsed.message);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            setError("");
            setFieldErrors({});

            await API.patch(`/journal/update/${id}`, {
                title: journal.title,
                content: journal.content,
                sentiment: journal.sentiment,
            });

            setOriginalJournal(journal);
            setIsEditing(false);
        } catch (err) {
            const parsed = parseError(err);
            if (parsed.isUnauthorized) {
                localStorage.clear();
                navigate("/");
                return;
            }
            if (parsed.isValidationError) {
                setFieldErrors(parsed.fieldErrors);
                setError(parsed.message);
                return;
            }
            setError(parsed.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setJournal(originalJournal);
        setIsEditing(false);
        setError("");
        setFieldErrors({});
    };

    if(error && !journal){
        return <p className="error text-center">{error}</p>;
    }

    if (!journal) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="page-container">
            <div className="card max-w-2xl space-y-4">

                <button
                    className="link self-start"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>

                <h2 className="h2">
                    Journal Entry
                </h2>

                {isAdmin && (
                    <p className="text-center text-gray-500">
                        Read-only view
                    </p>
                )}

                {error && (
                    <p className="error text-center">{error}</p>
                )}

                {isEditing ? (
                    <div className="space-y-3">
                        <input
                            className="input"
                            value={journal.title}
                            onChange={(e) => {
                                setJournal({ ...journal, title: e.target.value });
                                setFieldErrors(prev => ({ ...prev, title: "" }));
                            }}
                        />
                        {fieldErrors.title && (
                            <p className="error">{fieldErrors.title}</p>
                        )}

                        <textarea
                            className="textarea"
                            value={journal.content}
                            onChange={(e) => {
                                setJournal({ ...journal, content: e.target.value });
                                setFieldErrors(prev => ({ ...prev, content: "" }))
                            }}
                        />
                        {fieldErrors.content && (
                            <p className="error">{fieldErrors.content}</p>
                        )}

                        <select
                            className="input"
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

                        <h3 className="text-xl font-semibold text-gray-800">
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
                                    className="btn-yellow"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn-danger"
                                    onClick={() => setShowConfirm(true)}
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="btn-secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn-primary"
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
                    <div className="card max-w-sm text-center space-y-4">

                        <h3 className="text-lg font-semibold">
                            Delete Entry?
                        </h3>

                        <p className="text-gray-600">
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await handleDelete();
                                    setShowConfirm(false);
                                }}
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

export default JournalDetailPage;