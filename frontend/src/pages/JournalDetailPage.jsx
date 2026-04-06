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
        }
    };

    const handleCancel = () => {
        setJournal(originalJournal);
        setIsEditing(false);
    };

    if (!journal) return <p>Loading...</p>;

    return (
        <div>
            <h2>Journal Detail</h2>

            {isAdmin && <p style={{ color: "gray" }}>Read-only view</p>}

            {isEditing ? (
                <>
                    <input
                        value={journal.title}
                        onChange={(e) =>
                            setJournal({ ...journal, title: e.target.value })
                        }
                    />

                    <textarea
                        value={journal.content}
                        onChange={(e) =>
                            setJournal({ ...journal, content: e.target.value })
                        }
                    />

                    <select
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
                        <option value="NEUTRAL">Neutral</option>
                    </select>
                </>
            ) : (
                <>
                    <h3>{journal.title}</h3>
                    <p>{journal.content}</p>
                    <p>Sentiment: {journal.sentiment}</p>
                </>
            )}

            {!isAdmin && (
                <>
                    {!isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(true)}>
                                Edit
                            </button>

                            <button onClick={() => setShowConfirm(true)}>
                                Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleCancel}>Cancel</button>
                            <button onClick={handleUpdate}>Save</button>
                        </>
                    )}
                </>
            )}

            {/* Confirm Delete Modal */}
            {showConfirm && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3>Delete Entry?</h3>
                        <p>This action cannot be undone.</p>

                        <div style={{ marginTop: "10px" }}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                style={{ marginRight: "10px" }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await handleDelete();
                                    setShowConfirm(false);
                                }}
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                }}
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

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
        width: "300px",
    },
};

export default JournalDetailPage;