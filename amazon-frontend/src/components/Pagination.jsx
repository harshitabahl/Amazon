function Pagination({ page, pages, setPage }) {
  if (pages <= 1) return null;

  return (
    <div className="pagination">
      <button
        aria-label="Previous Page"
        disabled={page === 1}
        onClick={() => setPage((prev) => prev - 1)}
      >
        ← Previous
      </button>

      <span>
        Page <strong>{page}</strong> of <strong>{pages}</strong>
      </span>

      <button
        aria-label="Next Page"
        disabled={page === pages}
        onClick={() => setPage((prev) => prev + 1)}
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;