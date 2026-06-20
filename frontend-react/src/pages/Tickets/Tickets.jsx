import React, { useState, useEffect } from 'react';
import { TicketService } from '../../services/TicketService';
import TicketTable from '../../components/TicketTable/TicketTable';
import SearchBar from '../../components/SearchBar/SearchBar';
import Pagination from '../../components/Pagination/Pagination';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import { Filter, TicketPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Tickets.css';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await TicketService.getTickets({
        search,
        status,
        priority,
        page,
        limit: 5
      });
      setTickets(response.tickets);
      setTotalPages(response.pages);
      setTotalTickets(response.total);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [search, status, priority, page]);

  // Reset page when search or filters change
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  const handlePriorityChange = (val) => {
    setPriority(val);
    setPage(1);
  };

  return (
    <div className="tickets-page-container">
      {/* Top Header Card */}
      <div className="tickets-header-card card mb-2">
        <div className="tickets-header-main">
          <div>
            <h2 className="tickets-page-title">SYSTEM_TICKETS ({totalTickets})</h2>
            <p className="tickets-page-subtitle">VIEW_MANAGE_AND_FILTER_ORGANIZATION_ISSUES</p>
          </div>
          <Link to="/tickets/create" className="btn btn-primary create-ticket-header-btn">
            <TicketPlus size={16} /> NEW_TICKET
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="tickets-filters-card card mb-2">
        <div className="filters-grid">
          <div className="search-col">
            <SearchBar value={search} onChange={handleSearchChange} placeholder="SEARCH_BY_ID_TITLE_CREATOR..." />
          </div>
          
          <div className="filter-select-col">
            <div className="filter-select-wrapper">
              <Filter className="filter-icon" size={14} />
              <select 
                className="form-select filter-select" 
                value={status} 
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="">STATUS: ALL</option>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <Filter className="filter-icon" size={14} />
              <select 
                className="form-select filter-select" 
                value={priority} 
                onChange={(e) => handlePriorityChange(e.target.value)}
              >
                <option value="">PRIORITY: ALL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      {loading ? (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <LoadingSkeleton type="table" count={5} />
            </table>
          </div>
        </div>
      ) : (
        <>
          <TicketTable tickets={tickets} loading={false} />
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => setPage(p)} 
          />
        </>
      )}
    </div>
  );
};

export default Tickets;
