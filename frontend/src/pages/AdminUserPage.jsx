import DeleteUserByUsername from "../components/DeleteUserByUsername";

function AdminUsersPage() {

    return (
        <div>
            <h2>User Management</h2>
            <DeleteUserByUsername />
            <hr />
        </div>
    );
}

export default AdminUsersPage;