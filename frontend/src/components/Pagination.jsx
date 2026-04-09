export default function Pagination({page, totalPages, setPage}) {

    if(totalPages === 0) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button 
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
            <span className="text-sm font-medium" style={{margin: "0 10px"}}>Page {page + 1} of {totalPages}</span>
            <button 
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>Next</button>
        </div>
    );
}