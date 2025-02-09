import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bar } from "./components/upperBar";
import LoginPage from "./components/login";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Bar />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}

export default App;
