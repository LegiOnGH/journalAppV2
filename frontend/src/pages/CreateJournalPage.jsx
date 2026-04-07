import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateJournalPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        content: "",
        sentiment: "HAPPY",
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title || !form.content) {
            alert("Title and content are required");
            return;
        }
        try {
            setLoading(true);
            await API.post("/journal/create", form);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Failed to create entry");
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Entry</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <input
                        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                    />

                    <textarea
                        className="w-full p-2 border rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Write your thoughts here..."
                        value={form.content}
                        onChange={(e) =>
                            setForm({ ...form, content: e.target.value })
                        }
                    />

                    <select
                        className="w-full p-2 border rounded"
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

                    <div className="flex justify-center gap-10 pt-2">
                        <button 
                            type="button"
                            onClick={() => navigate("/dashboard")} 
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition active:scale-95">
                                Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            onClick={handleCreate}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 active:scale-95">
                                {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateJournalPage;