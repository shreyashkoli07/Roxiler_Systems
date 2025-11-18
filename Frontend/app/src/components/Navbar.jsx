import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, removeToken } from '../utils/auth';

const AppNavbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    removeToken();
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-warning">
          StoreRatings
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <>
                    <Nav.Link as={Link} to="/admin/dashboard">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/users">
                      User List
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/stores">
                      Store List
                    </Nav.Link>
                  </>
                )}
                {user.role === 'STORE_OWNER' && (
                  <Nav.Link as={Link} to="/owner/dashboard">
                    Owner Dashboard
                  </Nav.Link>
                )}
                {user.role === 'USER' && (
                  <Nav.Link as={Link} to="/stores">
                    Stores
                  </Nav.Link>
                )}

                <NavDropdown title={user.name} id="user-dropdown" align="end">
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout} className="text-danger">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  className="me-2"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="warning"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
