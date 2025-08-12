import React, { useState, useEffect } from "react";
import { FaPlay, FaCheck, FaTimes, FaRedo } from "react-icons/fa";

const QuizPage = () => {
  // ✅ Aggiunta di una chiave per forzare il re-fetch dei dati
  const [quizKey, setQuizKey] = useState(0);
  const [questions, setQuestions] = useState([]); // Array delle domande
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Indice della domanda attuale
  const [score, setScore] = useState(0); // Punteggio del giocatore
  const [loading, setLoading] = useState(true); // Stato di caricamento iniziale
  const [error, setError] = useState(null); // Stato di errore
  const [showResults, setShowResults] = useState(false); // Flag per mostrare i risultati
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Risposta selezionata dall'utente
  // ✅ Rimosso: const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  // Fetch dei dati del quiz all'avvio del componente, o ogni volta che la chiave del quiz cambia
  useEffect(() => {
    const fetchQuizData = async () => {
      console.log("Inizio il fetch dei dati del quiz...");
      setLoading(true);
      setError(null);
      setShowResults(false);

      try {
        // 1. Ottiene un ID del quiz casuale
        const quizIdResponse = await fetch(
          "http://localhost:8080/api/quiz/random"
        );
        if (!quizIdResponse.ok) {
          throw new Error("Impossibile ottenere un ID del quiz casuale.");
        }
        const randomQuizId = await quizIdResponse.json();

        // 2. Ottiene le domande per l'ID del quiz
        const questionsResponse = await fetch(
          `http://localhost:8080/api/quiz/${randomQuizId}/questions`
        );
        if (!questionsResponse.ok) {
          throw new Error("Impossibile ottenere le domande del quiz.");
        }
        const quizQuestions = await questionsResponse.json();

        // ✅ Aggiunge un controllo per assicurarsi che ci siano domande
        if (quizQuestions && quizQuestions.length > 0) {
          setQuestions(quizQuestions);
        } else {
          throw new Error("Il quiz non contiene domande. Riprova.");
        }
      } catch (err) {
        console.error("Errore nel recupero dei dati del quiz:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("Fetch dati completato.");
      }
    };

    fetchQuizData();
  }, [quizKey]); // ✅ Ora l'effect dipende da quizKey

  // Gestisce la risposta dell'utente
  const handleAnswer = (selectedOption) => {
    // Se l'utente ha già risposto, non fare nulla
    if (selectedAnswer !== null) return;

    setSelectedAnswer(selectedOption);
    // ✅ Rimosso: const isCorrect = selectedOption === questions[currentQuestionIndex].correct;
    // ✅ Rimosso: setIsAnswerCorrect(isCorrect);

    if (selectedOption === questions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }

    // Passa alla domanda successiva dopo un breve ritardo
    setTimeout(() => {
      const nextQuestion = currentQuestionIndex + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestionIndex(nextQuestion);
        setSelectedAnswer(null); // Resetta lo stato della risposta
        // ✅ Rimosso: setIsAnswerCorrect(null);
      } else {
        setShowResults(true); // Mostra i risultati finali
      }
    }, 1500); // Ritardo di 1.5 secondi per il feedback visivo
  };

  // Riavvia il quiz
  const restartQuiz = () => {
    // ✅ Resetta tutti gli stati prima di far ripartire la richiesta
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setLoading(true);
    setError(null);
    setShowResults(false);
    setSelectedAnswer(null);
    // ✅ Rimosso: setIsAnswerCorrect(null);
    setQuizKey((prevKey) => prevKey + 1); // ✅ Incrementa la chiave per rieseguire l'effect
  };

  // Funzioni di rendering per i vari stati
  const renderLoading = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="text-center">
        <FaPlay className="text-4xl text-blue-500 animate-spin mb-4" />
        <p className="text-xl font-semibold text-gray-700">
          Caricamento del quiz...
        </p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg shadow-md">
        <FaTimes className="text-4xl mx-auto mb-4" />
        <p className="text-xl font-semibold">Si è verificato un errore!</p>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={restartQuiz}
          className="mt-6 bg-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300 flex items-center mx-auto"
        >
          <FaRedo className="mr-2" /> Riprova
        </button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="text-center p-10 bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <h2 className="text-5xl font-extrabold text-blue-600 mb-4 animate-bounce">
          Finito!
        </h2>
        <p className="text-3xl font-semibold text-gray-800 mb-6">
          Hai totalizzato{" "}
          <span className="text-green-500 font-bold">{score}</span> su{" "}
          <span className="text-blue-500 font-bold">{questions.length}</span>{" "}
          punti!
        </p>
        <button
          onClick={restartQuiz}
          className="bg-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:bg-purple-700 transition duration-300 text-lg flex items-center mx-auto"
        >
          <FaRedo className="mr-3" /> Gioca di nuovo
        </button>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    // Mapping dinamico delle opzioni
    const options = [
      { key: "A", text: question.optionA },
      { key: "B", text: question.optionB },
      { key: "C", text: question.optionC },
      { key: "D", text: question.optionD },
    ];

    // Helpers definiti QUI così leggono `question` e `selectedAnswer`
    const getAnswerButtonClass = (optionKey) => {
      let cls = "w-100 text-start p-3 fw-semibold mb-3 btn ";
      if (selectedAnswer !== null) {
        if (optionKey === question.correct) cls += "btn-success";
        else if (optionKey === selectedAnswer) cls += "btn-danger";
        else cls += "btn-secondary disabled";
      } else {
        cls += "btn-outline-primary";
      }
      return cls;
    };

    const getIcon = (optionKey) => {
      if (selectedAnswer !== null) {
        if (optionKey === question.correct)
          return <FaCheck className="ms-auto text-white fs-5" />;
        if (optionKey === selectedAnswer)
          return <FaTimes className="ms-auto text-white fs-5" />;
      }
      return null;
    };

    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
        <div
          className="bg-white rounded-4 shadow p-4 w-100"
          style={{ maxWidth: 840 }}
        >
          <div className="d-flex justify-content-between text-secondary mb-3">
            <span>
              Domanda {currentQuestionIndex + 1} di {questions.length}
            </span>
            <span>Punti: {score}</span>
          </div>

          <h2 className="h3 text-center fw-bold mb-4">{question.text}</h2>

          <div>
            {options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswer(option.key)}
                className={getAnswerButtonClass(option.key)}
                disabled={selectedAnswer !== null}
              >
                <div className="d-flex align-items-center">
                  <span className="badge bg-secondary me-3 fs-6">
                    {option.key}
                  </span>
                  <span>{option.text}</span>
                  {getIcon(option.key)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // RENDER principale
  if (loading) return renderLoading();
  if (error) return renderError();
  if (showResults) return renderResults();
  return renderQuiz();
};

export default QuizPage;
