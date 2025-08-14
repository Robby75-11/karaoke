import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchLyricsBySong } from "../api/musicService.js";
import { Container, Card, Spinner, Alert } from "react-bootstrap";

const KaraokeSessionPage = () => {
  const location = useLocation();
  const trackData = location.state?.trackData; // oggetto Deezer track

  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLyrics = async () => {
      if (!trackData) {
        setError("Nessun brano selezionato.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchLyricsBySong(trackData);
        setLyrics(data);
      } catch (err) {
        console.error("Errore nel recupero dei testi:", err);
        setError("Impossibile caricare i testi.");
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
        <Card.Header as="h2">{trackData?.title || "Karaoke"}</Card.Header>
        <Card.Body>
          {trackData?.album?.cover_medium && (
            <div className="d-flex justify-content-center mb-4">
              <img
                src={trackData.album.cover_medium}
                alt={trackData.album?.title || trackData?.title}
                className="rounded-circle shadow"
                style={{ width: 150, height: 150, objectFit: "cover" }}
              />
            </div>
          )}

          {trackData?.preview && (
            <Card.Text>
              <audio controls src={trackData.preview} className="w-100 my-3" />
            </Card.Text>
          )}

          <hr />

          {lyrics?.lyrics ? (
            <div
              className="lyrics-display text-start"
              style={{
                whiteSpace: "pre-wrap",
                maxHeight: 520,
                overflowY: "auto",
                fontSize: 18,
                lineHeight: 1.6,
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
