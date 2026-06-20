import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <button
        className="btn btn-secondary btn-sm pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowLeft size={16} /> PREV
      </button>
      
      <span className="pagination-info">
        PAGE {currentPage} OF {totalPages}
      </span>

      <button
        className="btn btn-secondary btn-sm pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        NEXT <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
