export default function FilterBar({ filters, setFilters, isAdmin ,setPage }) {
    return (
        <div className="flex gap-3 mb-4">
            <input className="p-2 border rounded w-full" type="text" placeholder="Search title" value={filters.title} onChange={(e) => {
                setFilters({...filters, title: e.target.value});
                setPage(0);
            }} />
            <select className="p-2 border rounded" value={filters.sentiment} onChange={(e) => setFilters({...filters, sentiment: e.target.value})}>
                <option value="">All</option>
                <option value="HAPPY">Happy</option>
                <option value="SAD">Sad</option>
                <option value="ANGRY">Angry</option>
                <option value="NEUTRAL">Neutral</option>
            </select>
            {isAdmin && (
                <input 
                className="p-2 border rounded w-full"
                type="text"
                placeholder="Search by username" 
                value={filters.userName} 
                onChange={(e) => setFilters({...filters, userName : e.target.value})}
                />
            )}
        </div>
    );
}