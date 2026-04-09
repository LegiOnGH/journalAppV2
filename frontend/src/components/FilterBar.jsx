import "../index.css";


export default function FilterBar({ filters, setFilters, isAdmin}) {
    return (
        <div className="mb-4">
            <div className="card-item flex flex-wrap gap-3 items-center">

                <input
                    className="input sm:w-64"
                    type="text"
                    placeholder="Title"
                    value={filters.title}
                    onChange={(e) => {
                        setFilters({ ...filters, title: e.target.value });
                    }}
                />

                <select
                    className="input sm:w-40"
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
                        className="input sm:w-64"
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