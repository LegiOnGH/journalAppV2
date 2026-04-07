import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import FilterBar from "../components/FilterBar";
import JournalList from "../components/JournalList";
import Pagination from "../components/Pagination";

function DashboardPage() {

    const navigate = useNavigate();

    const [journals, setJournals] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        title: "",
        sentiment: "",
    });

    useEffect(() => {
        setPage(0);
    }, [filters]);

    useEffect(() => {
        const delay = setTimeout(() => {
            const fetchJournals = async () => {
                try {
                    setLoading(true);
                    const res = await API.get("/journal/getAll", {
                        params: {
                            page,
                            size : 5,
                            ...filters,
                        },
                    });
                    setJournals(res.data.content);
                    setTotalPages(res.data.totalPages);
                } catch (err) {
                    console.error(err);
                }finally {
                    setLoading(false);
                }
            };
            fetchJournals();
        }, 400);
        return () => clearTimeout(delay);
    }, [page, filters]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Journal</h2>
                    <div className="flex gap-3">
                        <button onClick={() => navigate("/profile")} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition active:scale-95">Profile</button>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition active:scale-95">Logout</button>
                    </div>
                </div>
                <div className="mb-6">
                    <button onClick={() => navigate("/create")} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition active:scale-95">New Entry</button>
                </div>
                
                <FilterBar filters={filters} setFilters={setFilters} isAdmin={false} />
                {loading ? (
                    <p className="text-center mt-6">Loading...</p>) : journals.length === 0 ? (
                        <p className="text-center mt-6 text-gray-500">No journal entries found.</p>
                    ) : (<JournalList journals={journals} />)}
                <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            </div>
        </div>
    )
}

export default DashboardPage;