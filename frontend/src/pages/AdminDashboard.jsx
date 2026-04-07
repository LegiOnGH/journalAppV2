import { useEffect, useState } from "react";
import "../index.css";
import API from "../services/api";
import FilterBar from "../components/FilterBar";
import JournalList from "../components/JournalList";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

    const navigate = useNavigate();
    const [journals, setJournals] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        title: "",
        sentiment: "",
        userName: ""
    });

    useEffect(() => {
        setPage(0);
    }, [filters]);

    useEffect(() => {
        const delay = setTimeout(() => {
            const fetchJournals = async () => {
                try {
                    setLoading(true);
                    const res = await API.get("/admin/entries", {
                        params: {
                            page,
                            size: 5,
                            ...(filters.title && { title: filters.title }),
                            ...(filters.sentiment && { sentiment: filters.sentiment }),
                            ...(filters.userName && { userName: filters.userName }),    
                        },
                    });
                    setJournals(res.data.content);
                    setTotalPages(res.data.totalPages);
                } catch (err) {
                    console.error(err);
                }finally{
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
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                    <div className="flex gap-3">
                        <button onClick={()=> navigate("/profile")}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition active:scale-95">
                                Profile
                            </button>
                            <button onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition active:scale-95">
                                Logout
                            </button>
                    </div>
                </div>
                <div className="mb-6">
                    <button onClick={() => navigate("/admin/users")}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition active:scale-95">
                        Manage Users
                    </button>
                </div>

                <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                    isAdmin={true}
                />
                {loading ? (
                    <p className="text-center mt-6">Loading...</p>
                ) : journals.length === 0 ? ( 
                    <p className="text-center mt-6 text-gray-500">No entries found</p>
                ) : (
                    <JournalList journals={journals} />
                )}
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                />
            </div>
        </div>
    );
}