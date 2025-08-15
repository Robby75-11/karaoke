import React, { useState } from "react";
import { fetchDeezer } from "../api/musicService.js";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";

const KaraokeSearchPage = () => {
  const [query, setQuery] = useState(""); // Stato per l'input di ricerca
  const [results, setResults] = useState([]); // Stato per i risultati della ricerca
  const [loading, setLoading] = useState(false); // Stato di caricamento
  const [playingTrack, setPlayingTrack] = useState(null); // Stato per il brano in riproduzione
  const navigate = useNavigate();

  // Funzione per gestire la ricerca dei brani
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResults([]);
    setPlayingTrack(null);

    try {
      const data = await fetchDeezer(query);
      setResults(data.data);
      console.log("Risultati API Deezer per Karaoke:", data);
    } catch (error) {
      console.error("Errore di ricerca:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per gestire la riproduzione del brano
  const handlePlay = (track) => {
    if (playingTrack && playingTrack.id === track.id) {
      // Se si clicca di nuovo sullo stesso brano, metti in pausa/riprendi
      const audio = document.getElementById("audio-player");
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      // Altrimenti, interrompi il brano precedente e riproduci il nuovo
      if (playingTrack) {
        const audio = document.getElementById("audio-player");
        audio.pause();
      }
      setPlayingTrack(track); // Imposta il nuovo brano in riproduzione
    }
  };

  // Funzione per avviare la sessione di karaoke
  const startKaraoke = (track) => {
    // Naviga a una pagina dedicata al karaoke, passando i dati del brano
    navigate("/karaoke-session", { state: { trackData: track } });
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-5">Cerca Brani per Karaoke 🎤</h1>

      {/* Form di ricerca */}
      <Form onSubmit={handleSearch} className="mb-5 d-flex">
        <Form.Control
          type="text"
          placeholder="Cerca un artista o un brano..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="me-2 rounded-pill"
        />
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="rounded-pill"
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Ricerca...</span>
            </>
          ) : (
            "Cerca"
          )}
        </Button>
      </Form>

      {/* Player audio per l'anteprima */}
      {playingTrack && (
        <Card bg="dark" text="white" className="mb-5 shadow-lg">
          <Card.Body className="d-flex align-items-center justify-content-between flex-wrap">
            <div className="d-flex align-items-center">
              <img
                src={playingTrack.album.cover_small}
                alt={playingTrack.album.title}
                className="rounded-circle me-3"
                style={{ width: "64px", height: "64px" }}
              />
              <div>
                <Card.Title className="mb-0">{playingTrack.title}</Card.Title>
                <Card.Text className="text-muted">
                  {playingTrack.artist.name}
                </Card.Text>
              </div>
            </div>
            <audio
              id="audio-player"
              controls
              autoPlay
              src={playingTrack.preview}
              className="mt-3 mt-sm-0"
            ></audio>
          </Card.Body>
        </Card>
      )}

      {/* Risultati della ricerca */}
      {results.length > 0 && (
        <Row xs={1} md={2} lg={4} className="g-4">
          {results.map((track) => (
            <Col key={track.id}>
              <Card className="h-100 shadow-sm text-center">
                <Card.Img
                  variant="top"
                  src={track.album.cover_medium}
                  alt={track.album.title}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{track.title}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    {track.artist.name}
                  </Card.Text>
                  <div className="d-flex justify-content-center gap-2 mt-auto">
                    <Button
                      variant="success"
                      onClick={() => handlePlay(track)}
                      className="rounded-pill"
                    >
                      Play
                    </Button>
                    <Button
                      variant="purple"
                      onClick={() => startKaraoke(track)}
                      className="rounded-pill"
                    >
                      Canta 🎤
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Messaggi di stato */}
      {!loading && results.length === 0 && query && (
        <p className="text-center text-muted fst-italic">
          Nessun risultato trovato per "{query}".
        </p>
      )}
    </Container>
  );
};

export default KaraokeSearchPage;
