import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login";
import SignuPage from "./components/signup";
import HomePage from "./components/home";
import Dashboard from "./components/dashboard";
import Profile from "./components/profile";

function App() {
    return (
        
            <div>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignuPage/>} />
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                </Routes>
            </Router>
            </div>
    );
} 
export default App;
