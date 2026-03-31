function DashboardPage() {
    return (
        <div>
            <button onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
            }}>Logout</button>
        </div>
    )
}

export default DashboardPage;