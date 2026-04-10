import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import FilterBar from "../components/FilterBar";
import JournalList from "../components/JournalList";
import Pagination from "../components/Pagination";
import { parseError } from "../utils/errorHandler";
import "../index.css";

function DashboardPage() {

    const navigate = useNavigate();

    const [journals, setJournals] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
                    setError("");
                    const res = await API.get("/journal/getAll", {
                        params: {
                            page,
                            size: 5,
                            ...(filters.title && { title: filters.title }),
                            ...(filters.sentiment && { sentiment: filters.sentiment }),  
                        },
                    });
                    setJournals(res.data.content);
                    setTotalPages(res.data.totalPages);
                } catch (err) {
                    const parsed = parseError(err);
                    setError(parsed.message);
                }finally {
                    setLoading(false);
                }
            };
            fetchJournals();
        }, 400);
        return () => clearTimeout(delay);
    }, [page, filters, navigate]);

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
                        <button onClick={() => navigate("/profile")} className="btn-secondary">Profile</button>
                        <button onClick={handleLogout} className="btn-danger">Logout</button>
                    </div>
                </div>
                <div className="mb-6">
                    <button onClick={() => navigate("/create")} className="btn-primary">New Entry</button>
                </div>
                
                <FilterBar filters={filters} setFilters={setFilters} isAdmin={false} />
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : journals.length === 0 ? (
                        <p className="text-center mt-6 text-gray-500">No journal entries found.</p>
                    ) : (<JournalList journals={journals} isAdmin={false} />)}
                <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            </div>
        </div>
    )
}

export default DashboardPage;