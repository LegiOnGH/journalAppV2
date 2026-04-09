import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../index.css";
import { parseError } from "../utils/errorHandler";

function CreateJournalPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const [form, setForm] = useState({
        title: "",
        content: "",
        sentiment: "HAPPY",
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim() ) {
            setError("Title and content are required");
            return;
        }
        try {
            setLoading(true);
            setError("");
            setFieldErrors({});
            await API.post("/journal/create", form);
            navigate("/dashboard");
        } catch (err) {
            const parsed = parseError(err);
            if (parsed.isValidationError) {
                setFieldErrors(parsed.fieldErrors);
                setError(parsed.message);
                return;
            }
            setError(parsed.message);
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="card max-w-lg">
                <h2 className="h2">Create Entry</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    {error && (<p className="error text-center">{error}</p>)}
                    <input
                        className="input"
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) => {
                            setForm({ ...form, title: e.target.value });
                            setFieldErrors(prev => ({ ...prev, title: "" }));
                        }}
                    />
                    {fieldErrors.title && (
                        <p className="error">{fieldErrors.title}</p>
                    )}

                    <textarea
                        className="textarea"
                        placeholder="Write your thoughts here..."
                        value={form.content}
                        onChange={(e) => {
                            setForm({ ...form, content: e.target.value })
                            setFieldErrors(prev => ({ ...prev, content: "" }));
                        }}
                    />
                    {fieldErrors.content && (
                        <p className="error">{fieldErrors.content}</p>
                    )}

                    <select
                        className="input"
                        value={form.sentiment}
                        onChange={(e) =>
                            setForm({ ...form, sentiment: e.target.value })
                        }
                    >
                        <option value="HAPPY">Happy</option>
                        <option value="SAD">Sad</option>
                        <option value="ANGRY">Angry</option>
                        <option value="NEUTRAL">Neutral</option>
                    </select>

                    <div className="flex justify-center gap-6 pt-2">
                        <button 
                            type="button"
                            onClick={() => navigate("/dashboard")} 
                            className="btn-secondary">
                                Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="btn-primary">
                                {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateJournalPage;