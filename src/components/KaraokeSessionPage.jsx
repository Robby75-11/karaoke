import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchLyricsBySongId } from "../api.js";
import { Container, Card, Spinner, Alert } from "react-bootstrap";

const KaraokeSessionPage = () => {
  // Hook per ottenere i dati del brano passati dalla pagina di ricerca
  const location = useLocation();
  const trackData = location.state?.trackData;

  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect per caricare i testi quando il componente viene montato
  useEffect(() => {
    const getLyrics = async () => {
      if (!trackData) {
        setError("Nessun brano selezionato.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchLyricsBySongId(trackData.id);
        setLyrics(data);
        console.log("Testo del brano:", data);
      } catch (err) {
        setError("Impossibile caricare i testi.");
        console.error("Errore nel recupero dei testi:", err);
      } finally {
        setLoading(false);
      }
    };

    getLyrics();
  }, [trackData]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="text-center shadow-lg">
        <Card.Header as="h2">{trackData.title}</Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-center mb-4">
            <img
              src={trackData.album.cover_medium}
              alt={trackData.album.title}
              className="rounded-circle shadow"
              style={{ width: "150px", height: "150px" }}
            />
          </div>
          <Card.Text>
            {/* Qui il player audio del brano completo, se disponibile */}
            <audio
              controls
              src={trackData.preview}
              className="w-100 my-3"
            ></audio>
          </Card.Text>
          <hr />
          {lyrics && lyrics.lyrics ? (
            <div
              className="lyrics-display text-start"
              style={{
                whiteSpace: "pre-wrap",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {lyrics.lyrics}
            </div>
          ) : (
            <p className="text-muted fst-italic">
              Testi non disponibili per questo brano.
            </p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default KaraokeSessionPage;
