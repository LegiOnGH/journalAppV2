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
        try {
            await API.post("/journal/create", form);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Failed to create entry");
        }
    };

    return (
        <div>
            <h2>New Entry</h2>

            <input
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                }
            />

            <textarea
                placeholder="Content"
                value={form.content}
                onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                }
            />

            <select
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

            <button onClick={handleCreate}>Create</button>
        </div>
    );
}

export default CreateJournalPage;