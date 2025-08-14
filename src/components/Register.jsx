import React, { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "..api/api";
// Stili CSS personalizzati per la form
const formStyles = `
  .custom-form-container {
    padding: 2.5rem;
    background: #ffffff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .form-control-lg {
    padding: 1rem 1.25rem;
    font-size: 1.25rem;
  }

  .btn-custom-lg {
    padding: 1rem 1.5rem;
    font-size: 1.25rem;
    border-radius: 0.75rem;
  }
`;

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await api.post("/auth/register", { username, password }); // 🔹 usa baseURL e axios
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(
        "Errore di registrazione:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message || "Errore durante la registrazione."
      );
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <style>{formStyles}</style>
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6} className="custom-form-container">
          <Form onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Registrazione</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
              <Alert variant="success">
                Registrazione avvenuta con successo! Ora puoi accedere.
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="lg"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
                required
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-75 btn-custom-lg"
            >
              Registrati
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
