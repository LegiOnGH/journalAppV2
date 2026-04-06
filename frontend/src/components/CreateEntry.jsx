import { useState } from "react";
import API from "../services/api";

function CreateEntry() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [sentiment, setSentiment] = useState("HAPPY");

    const handleCreate = async () => {
        try {
            await API.post("/journal/create", {
                title,
                content,
                sentiment,  
            });

            alert("Entry created.");
            setTitle("");
            setContent("");
            setSentiment("HAPPY");
        } catch (err) {
            alert("Failed to create entry.");
        }   
    };

    return (
        <div>
            <h2>Create Journal Entry</h2>
            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <br />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                />
            <br />
            <select value={sentiment} onChange={(e) => setSentiment(e.target.value)}>
                <option value="HAPPY">Happy</option>
                <option value="SAD">Sad</option>
                <option value="NEUTRAL">Neutral</option>
                <option value="ANGRY">Angry</option>
            </select>
            <br />
            <button onClick={handleCreate}>Create Entry</button>
        </div>
    )
}

export default CreateEntry;