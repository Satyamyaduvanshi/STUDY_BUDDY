import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bar } from "./components/upperBar";
import LoginPage from "./components/login";
import SignuPage from "./components/signup";
import HomePage from "./components/home";

function App() {
    return (
        
            <div>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignuPage/>} />
                </Routes>
            </Router>
            </div>
    );
} 
export default App;
