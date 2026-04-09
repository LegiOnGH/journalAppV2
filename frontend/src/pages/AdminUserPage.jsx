import { useNavigate } from "react-router-dom";
import DeleteUserByUsername from "../components/DeleteUserByUsername";
import "../index.css"

function AdminUsersPage() {
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="card max-w-md space-y-4">

                <button
                    onClick={() => navigate(-1)}
                    className="link self-start"
                >
                    Back
                </button>

                <h2 className="h2">
                    User Management
                </h2>

                <div className="border-t border-gray-200 pt-4">
                    <DeleteUserByUsername />
                </div>

            </div>
        </div>
    );
}

export default AdminUsersPage;