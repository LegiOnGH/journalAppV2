export default function Pagination({page, totalPages, setPage}) {
    return (
        <div className="flex justify-center gap-3 mt-6">
            <button 
                className="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 active:scale-95 disabled: opacity-40 disabled:cursor-not-allowed"
                onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
            <span className="text-sm font-medium px-2" style={{margin: "0 10px"}}>Page {page + 1} of {totalPages}</span>
            <button 
                className="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 active:scale-95 disabled: opacity-40 disabled:cursor-not-allowed"
                onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>Next</button>
        </div>
    );
}