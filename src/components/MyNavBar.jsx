import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

const navbarStyles = `
  .my-navbar-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .my-navbar-nav-group {
    display: flex;
    align-items: center;
  }

  .my-navbar-btn {
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 50px;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-left: 10px;
  }

  .my-navbar-btn.btn-outline-primary {
    color: #0d6efd;
    border-color: #0d6efd;
  }
  .my-navbar-btn.btn-outline-primary:hover {
    background-color: #0d6efd;
    color: white;
  }
  .my-navbar-btn.btn-outline-success {
    color: #198754;
    border-color: #198754;
  }
  .my-navbar-btn.btn-outline-success:hover {
    background-color: #198754;
    color: white;
  }
  .my-navbar-btn.btn-outline-danger {
    color: #dc3545;
    border-color: #dc3545;
  }
  .my-navbar-btn.btn-outline-danger:hover {
    background-color: #dc3545;
    color: white;
  }
`;

function MyNavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.nome ||
    (user?.email ? user.email.split("@")[0] : null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <style>{navbarStyles}</style>

      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container fluid className="my-navbar-container">
          <Navbar.Brand as={Link} to="/">
            <span className="fw-bold text-primary">Karaoke Quiz</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto my-navbar-nav-group">
              <Nav.Link as={Link} to="/quiz" className="mx-2">
                Quiz
              </Nav.Link>
              <Nav.Link as={Link} to="/music" className="mx-2">
                Music
              </Nav.Link>
            </Nav>
            <Form className="d-flex mx-auto my-navbar-nav-group">
              <FormControl
                type="search"
                placeholder="Cerca autore o brano"
                className="me-2"
                aria-label="Search"
              />
              <Button
                as={Link}
                to="/search"
                variant="outline-success"
                className="my-navbar-btn"
              >
                Search
              </Button>
            </Form>
            <Nav className="my-navbar-nav-group">
              {user ? (
                <>
                  <Navbar.Text className="me-2 fw-semibold">
                    {displayName ? `Ciao, ${displayName}` : "Ciao!"}
                  </Navbar.Text>
                  <Button
                    variant="outline-danger"
                    onClick={handleLogout}
                    className="my-navbar-btn"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-primary"
                    className="me-2 my-navbar-btn"
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="outline-success"
                    className="my-navbar-btn"
                  >
                    Registrati
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavBar;
