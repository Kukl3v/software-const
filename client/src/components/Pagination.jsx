function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <nav className="flex items-center justify-center gap-x-1 mt-6" aria-label="Pagination">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
        disabled={currentPage === 0}
        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Previous"
      >
        Предыдущая
      </button>

      <div className="flex items-center gap-x-1">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onPageChange(idx)}
            className={`min-h-9.5 min-w-9.5 flex justify-center items-center py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-100 ${
              idx === currentPage
                ? 'text-gray-800 bg-gray-100'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
            aria-current={idx === currentPage ? 'page' : undefined}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
        disabled={currentPage === totalPages - 1}
        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Next"
      >
        Следующая
      </button>
    </nav>
  )
}

export default Pagination