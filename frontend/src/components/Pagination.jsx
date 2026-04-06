export default function Pagination({page, totalPages, setPage}) {
    return (
        <div className="flex justify-center gap-3 mt-6">
            <button 
                className="px-3 py-1 bg-gray-200 rounded disabled: opacity-50"
                onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
            <span className="px-2" style={{margin: "0 10px"}}>Page {page + 1} of {totalPages}</span>
            <button 
                className="px-3 py-1 bg-gray-200 rounded disabled: opacity-50"
                onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>Next</button>
        </div>
    );
}