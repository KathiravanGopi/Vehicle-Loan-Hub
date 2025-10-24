import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser, selectUserRole } from '../redux/slices/userSlice';
import './AdminNavbar.css';
import CustomModal from '../Components/CustomModal';

function AdminNavbar() {
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const role = useSelector(selectUserRole)
  const user = useSelector(selectUser)
  const userName = user?.userName || ''
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <>
      <Navbar className="navbar-gradient" variant="dark" expand="lg" sticky="top">
        <Container fluid>
          <Navbar.Brand as={Link} to={`/${role}/home`} className="fw-bold text-white">
            VEHICLE LOANHUB
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <span className="user-role-badge">
                {userName} / {role}
              </span>
              <Nav.Link as={Link} to={`/${role}/home`} className="nav-link-custom">
                Home
              </Nav.Link>

              <NavDropdown
                title={<span className="nav-link-custom">Loan</span>}
                id="loan-dropdown"
                className="dropdown-hover"
                show={loanOpen}
                onMouseEnter={() => setLoanOpen(true)}
                onMouseLeave={() => setLoanOpen(false)}
                onToggle={(next) => setLoanOpen(next)}
                renderMenuOnMount
              >
                <NavDropdown.Item as={Link} to="/admin/add-loan">Add Loan</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/view-loans">View Loans</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link as={Link} to="/admin/loan-requests" className="nav-link-custom">
                Loans Requested
              </Nav.Link>

              <Nav.Link onClick={handleLogoutClick} className="logout-button">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <CustomModal
        show={showLogoutModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        body="Are you sure you want to logout?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        width="500px"
      />

      <Outlet />
    </>
  );
}

export default AdminNavbar;