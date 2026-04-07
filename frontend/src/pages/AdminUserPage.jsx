import { useNavigate } from "react-router-dom";
import DeleteUserByUsername from "../components/DeleteUserByUsername";

function AdminUsersPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10">
            <div className="bg-white p-6 rounded-xl shadow-md w-100">
                <button onClick={() => navigate(-1)}
                    className="mb-4 text-sm text-blue-500 hover:underline">
                    Back
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">User Management</h2>
                <DeleteUserByUsername />
                <hr />
            </div>
        </div>
    );
}

export default AdminUsersPage;