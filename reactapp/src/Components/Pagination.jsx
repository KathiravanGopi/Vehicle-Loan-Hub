import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as BSPagination } from 'react-bootstrap';
import './Pagination.css';

function Pagination({ 
  totalPages = 0, 
  currentPage = 1, 
  handlePageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 15, 20],
}) {
  if (!totalPages) return null;

  const showPageSizeSelector = pageSize !== undefined && typeof onPageSizeChange === 'function';

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        'ellipsis',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        'ellipsis',
        totalPages
      );
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-3 flex-wrap custom-pagination-wrapper">
      {showPageSizeSelector && (
        <div className="d-flex align-items-center gap-2">
          <label 
            htmlFor="page-size-selector"
            className="fw-bold mb-0"
            style={{ fontSize: 14, color: '#1e5fa8' }}
          >
            Rows per page:
          </label>
          <select
            id="page-size-selector"
            className="form-select form-select-sm"
            style={{
              width: 'auto',
              minWidth: 70,
              borderColor: '#1e5fa8',
              color: '#1e5fa8',
              fontWeight: 600,
            }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <BSPagination className="mb-0 custom-pagination">
        <BSPagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <BSPagination.Prev
          onClick={() => handlePageChange((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />

        {pageNumbers.map((page, idx) =>
          page === 'ellipsis' ? (
            <BSPagination.Ellipsis
              key={`ellipsis-${pageNumbers[idx - 1]}-${pageNumbers[idx + 1]}`}
              disabled
            />
          ) : (
            <BSPagination.Item
              key={`page-${page}`}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </BSPagination.Item>
          )
        )}

        <BSPagination.Next
          onClick={() => handlePageChange((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
        <BSPagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </BSPagination>
    </div>
  );
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  onPageSizeChange: PropTypes.func,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number)
};

export default Pagination;
