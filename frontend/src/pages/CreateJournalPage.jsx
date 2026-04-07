import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateJournalPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        content: "",
        sentiment: "HAPPY",
    });

    const handleCreate = async () => {
        if (!form.title || !form.content) {
            alert("Title and content are required");
            return;
        }
        try {
            await API.post("/journal/create", form);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Failed to create entry");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-100">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Entry</h2>

            <input
                className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                }
            />

            <textarea
                className="w-full p-2 mb-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Write your thoughts here..."
                value={form.content}
                onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                }
            />

            <select
                className="w-full p-2 border rounded mb-4"
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

            <div className="flex justify-between mt-4">
                <button onClick={() => navigate("/dashboard")} 
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleCreate}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Create</button>
            </div>
            </div>
        </div>
    );
}

export default CreateJournalPage;