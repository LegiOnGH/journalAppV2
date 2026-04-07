import { useNavigate } from "react-router-dom";
import DeleteUserByUsername from "../components/DeleteUserByUsername";

function AdminUsersPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-6">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">

                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-blue-500 hover:underline"
                >
                    Back
                </button>

                <h2 className="text-2xl font-bold text-center">
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