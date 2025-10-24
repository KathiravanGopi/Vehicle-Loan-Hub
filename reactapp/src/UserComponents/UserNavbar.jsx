import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser, selectUserRole } from '../redux/slices/userSlice';
import CustomModal from '../Components/CustomModal';
import './UserNavbar.css';

function UserNavbar() {
  const dispatch = useDispatch();
  const role = useSelector(selectUserRole)
  const user = useSelector(selectUser)
  const userName = user?.userName || ''
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    // Dispatch logout action (this will clear session storage and Redux state)
    dispatch(logout());
    // Force navigation to login page
    window.location.href = '/login';
  };

  return (
    <>
      <Navbar className="navbar-gradient" variant="dark" expand="lg" sticky="top">
        <Container fluid>
          <Navbar.Brand as={Link} to={`/${role}/home`} className="fw-bold text-white">
            VEHICLE LOANHUB
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="user-navbar-nav" />
          <Navbar.Collapse id="user-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <span className="user-role-badge">
                {userName} / {role}
              </span>
              <Nav.Link as={Link} to={`/${role}/home`} className="nav-link-custom">
                Home
              </Nav.Link>

              <Nav.Link as={Link} to="/user/loans" className="nav-link-custom">
                Loans
              </Nav.Link>

              <Nav.Link as={Link} to="/user/applied-loans" className="nav-link-custom">
                Applied Loans
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
      />
      
      {/* Render child routes */}
      <Outlet />
    </>
  );
}

export default UserNavbar;