import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

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

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("/auth/login", { username, password });

      // Il backend restituisce un token in testo semplice
      const token =
        typeof response.data === "string" ? response.data : response.data.token;

      login({ username, token });
      navigate("/");
    } catch (err) {
      console.error(
        "Errore durante il login:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Credenziali non valide");
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <style>{formStyles}</style>
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6} className="custom-form-container">
          <Form onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Accedi</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="lg" // Rende l'input più grande
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
                size="lg" // Rende l'input più grande
                required
              />
            </Form.Group>
            <Button
              variant="warning"
              type="submit"
              className="w-100 btn-custom-lg"
            >
              Accedi
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
