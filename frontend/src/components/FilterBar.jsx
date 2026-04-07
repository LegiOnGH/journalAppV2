export default function FilterBar({ filters, setFilters, isAdmin}) {
    return (
        <div className="mb-4">
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-3 items-center">

                <input
                    className="p-2 border rounded w-full sm:w-64"
                    type="text"
                    placeholder="Title"
                    value={filters.title}
                    onChange={(e) => {
                        setFilters({ ...filters, title: e.target.value });
                    }}
                />

                <select
                    className="p-2 border rounded w-full sm:w-40"
                    value={filters.sentiment}
                    onChange={(e) => {
                        setFilters({ ...filters, sentiment: e.target.value });
                    }}
                >
                    <option value="">All</option>
                    <option value="HAPPY">Happy</option>
                    <option value="SAD">Sad</option>
                    <option value="ANGRY">Angry</option>
                    <option value="NEUTRAL">Neutral</option>
                </select>

                {isAdmin && (
                    <input
                        className="p-2 border rounded w-full sm:w-64"
                        type="text"
                        placeholder="Username"
                        value={filters.userName}
                        onChange={(e) => {
                            setFilters({ ...filters, userName: e.target.value });
                        }}
                    />
                )}
            </div>
        </div>
    );
}