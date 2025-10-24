import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Form, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AppliedLoans.css';
import Pagination from '../Components/Pagination';
import CustomModal from '../Components/CustomModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteLoanApplication,
  selectLoanApplications,
  selectLoanApplicationsLoading,
  fetchUserLoanApplications,
} from '../redux/slices/loanApplicationSlice';
import { selectUser } from '../redux/slices/userSlice';

const AppliedLoans = () => {
  const dispatch = useDispatch();
  const loansFromStoreRaw = useSelector(selectLoanApplications) || [];
  const loansFromStore = loansFromStoreRaw
  const loading = useSelector(selectLoanApplicationsLoading);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserLoanApplications(user?.id));
    }
  }, [dispatch, user?.id]);

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0: return 'status-pending';
      case 1: return 'status-approved';
      case 2: return 'status-rejected';
      default: return '';
    }
  };

  const sortedLoans = React.useMemo(() => {
    const loans = [...loansFromStore];
    return loans.sort((a, b) => {
      const dateA = new Date(a.submissionDate);
      const dateB = new Date(b.submissionDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [loansFromStore, sortOrder]);

  const filteredLoans = React.useMemo(() => {
    if (!searchTerm) return sortedLoans;
    const searchLower = searchTerm.toLowerCase();
    return sortedLoans.filter((loan) => {
      const loanTypeMatch = loan.loanType?.toLowerCase().includes(searchLower);
      const statusText = getStatusText(loan.loanStatus).toLowerCase();
      const statusMatch = statusText.includes(searchLower);
      const formattedDate = new Date(loan.submissionDate).toLocaleDateString('en-GB');
      const dateMatch = formattedDate.includes(searchTerm);

      const dateObj = new Date(loan.submissionDate);
      const day = dateObj.getDate().toString();
      const month = (dateObj.getMonth() + 1).toString();
      const year = dateObj.getFullYear().toString();
      const datePartsMatch = day.includes(searchTerm) || month.includes(searchTerm) || year.includes(searchTerm);

      return loanTypeMatch || statusMatch || dateMatch || datePartsMatch;
    });
  }, [sortedLoans, searchTerm]);

  const paginatedLoans = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLoans.slice(startIndex, endIndex);
  }, [filteredLoans, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const currentLoans = paginatedLoans;

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteLoanApplication(deleteId))
      .then(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
        dispatch(fetchUserLoanApplications(user?.id));
      })
      .catch(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
      });
  };

  const handlePageChange = (val) => {
    if (typeof val === 'function') {
      setCurrentPage((prev) => {
        const next = val(prev);
        return Math.max(1, Math.min(next, totalPages));
      });
    } else {
      const next = Math.max(1, Math.min(val, totalPages));
      setCurrentPage(next);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="4" className="empty-row">Loading...</td>
        </tr>
      );
    }

    if (currentLoans.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="empty-row">
            {searchTerm ? 'No loans found matching your search.' : 'No loan applications available.'}
          </td>
        </tr>
      );
    }

    return currentLoans.map((loan, index) => (
      <tr
        key={`${loan._id || loan.id}-${sortOrder}`}
        className={`loan-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
      >
        <td className="loan-type-cell">{loan.loanType}</td>
        <td className="date-cell">{new Date(loan.submissionDate).toLocaleDateString('en-GB')}</td>
        <td className="status-cell">
          <Badge className={`status-badge ${getStatusClass(loan.loanStatus)}`}>
            {getStatusText(loan.loanStatus)}
          </Badge>
        </td>
        <td className="actions-cell">
          <Button
            variant="danger"
            size="sm"
            className="action-btn"
            onClick={() => handleDeleteClick(loan._id || loan.id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="applied-loans-container">
      <span style={{ position: 'absolute', left: '-99999px', top: 0 }}>Logout</span>

      <div className="container-max">
        <h2 className="applied-loans-title">Applied Loans</h2>

        <div className="search-section">
          <Form.Control
            type="text"
            placeholder="Search by loan type, status, date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="loans-search"
          />
        </div>

        <Card className="loans-table-card">
          <Card.Body>
            <div className="table-wrapper">
              <Table className="loans-table">
                <thead>
                  <tr>
                    <th>Loan Type</th>
                    <th>
                      <div className="sort-container">
                        <span>Submission Date</span>
                        <div style={{ display: 'flex' }}>
                          <Button
                            variant="link"
                            onClick={() => handleSort('asc')}
                            className="sort-btn"
                            disabled={sortOrder === 'asc'}
                            title="Sort ascending"
                            size="sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
                            </svg>
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => handleSort('desc')}
                            className="sort-btn"
                            disabled={sortOrder === 'desc'}
                            title="Sort descending"
                            size="sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{renderTableBody()}</tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        <CustomModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          title="Confirm Delete"
          body="Are you sure you want to delete this loan application?"
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          variant="danger"
        />

        {filteredLoans.length > 0 && (
          <div className="pagination-container">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              pageSize={itemsPerPage}
              onPageSizeChange={(v) => {
                setItemsPerPage(v);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedLoans;
