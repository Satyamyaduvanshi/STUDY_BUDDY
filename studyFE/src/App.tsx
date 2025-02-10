import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bar } from "./components/upperBar";
import LoginPage from "./components/login";
import SignuPage from "./components/signup";

function App() {
    return (
        
            <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Bar />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignuPage/>} />
                </Routes>
            </Router>
            </div>
    );
} 
export default App;
