import { useNavigate } from "react-router-dom";

export default function JournalList({journals}) {
        const navigate = useNavigate();
    return (
        <div className="space-y-4 mt-4">
            {journals.map((journal) => (
                <div key={journal.id} onClick={() => navigate(`/journal/${journal.id}`)} className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition">
                    <h3 className="text-lg font-semibold">{journal.title}</h3>
                    <p className="text-gray-600 mt-1">{journal.content.substring(0, 100)}...</p>
                    <p className="text-sm mt-2 text-blue-500">{journal.sentiment}</p>
                </div>
            ))}
        </div>
    );
}