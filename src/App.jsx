import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import MyNavBar from "./components/MyNavBar";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./components/HomePage";
import KaraokeSearchPage from "./components/KaraokeSearchPage.jsx";
import KaraokeSessionPage from "./components/KaraokeSessionPage.jsx"; // ✅ Import corretto per il componente della sessione
import QuizPage from "./components/QuizPage.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <MyNavBar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<KaraokeSearchPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route
              path="/karaoke-session"
              element={<KaraokeSessionPage />}
            />{" "}
            {/* ✅ Rotta aggiunta per la pagina del karaoke */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <div>Dashboard protetta</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}
export default App;
