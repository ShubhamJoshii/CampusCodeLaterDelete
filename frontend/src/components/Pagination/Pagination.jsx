import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import './Pagination.css'; // Import your new CSS file here

const Pagination = ({ totalPages = 10, initialPage = 1, limit = 10, changePagination, changePaginationLimit }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(10);
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      changePagination(page);
      setCurrentPage(page);
    }
  };

  const handleChangeLimit = (e) => {
    changePaginationLimit(parseInt(e.target.value, 10));
  };

  return (
    <nav className="pagination-container" aria-label="Pagination">
      <div className="pagination-select-group">
        <label htmlFor="page-size" className="pagination-label">Rows per page:</label>
        <select
          id="page-size"
          value={limit}
          onChange={handleChangeLimit}
          className="pagination-select"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div className='paginationControls'>

        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="page-numbers">
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;

            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`page-number ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              );
            }

            if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="pagination-ellipsis">
                  <MoreHorizontal size={20} />
                </span>
              );
            }

            return null;
          })}
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          <ChevronRight size={20} />
        </button>

      </div>
    </nav>
  );
};

export default Pagination;