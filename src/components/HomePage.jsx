import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function HomePage() {
  return (
    <Container className="mt-5">
      <Row className="text-center">
        <Col>
          <h1>Benvenuto nella Karaoke App! 🎉</h1>
          <p>Accedi per iniziare o esplora i brani disponibili.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
