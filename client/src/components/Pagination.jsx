import "./Pagination.css";

const Pagination = ({ page, totalPages, onPageChange }) => {
  // if (totalPages <= 1) return null;

  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div className="pagination">
      <button onClick={prev} disabled={page === 1}>
        ◀ Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button onClick={next} disabled={page === totalPages}>
        Next ▶
      </button>
    </div>
  );
};

export default Pagination;
