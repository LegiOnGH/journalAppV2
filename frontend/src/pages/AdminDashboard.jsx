import React, { useEffect, useState } from "react";
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

    const [filters, setFilters] = useState({
        title: "",
        sentiment: "",
        userName: ""
    });

    const fetchJournals = async () => {
        try {
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
            alert("Failed to fetch journals");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchJournals();
    }, [page, filters]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>

            <h2>Admin Dashboard</h2>

            <FilterBar
                filters={filters}
                setFilters={setFilters}
                isAdmin={true}
                setPage={setPage}
            />

            <JournalList journals={journals} />

            <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />

            <button onClick={() => navigate("/admin/users")}>
                Manage Users
            </button>
        </div>
    );
}