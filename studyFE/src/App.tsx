import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login";
import SignuPage from "./components/signup";
import HomePage from "./components/home";
import Dashboard from "./components/dashboard";
import Profile from "./components/profile";
import PrivateRoute from "./components/protected";
import { NavBar } from "./components/mainNavBar";
import Room from "./components/Room";
import { WebSocketProvider } from "./hooks/WebSocketContext";

function App() {
    return (
        
            <div>
            <Router>
                <Routes>
                    <Route path="/homepage" element={<HomePage/>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignuPage/>} />
                    <Route path="/profile" element={<Profile/>}/>
                    <Route element={<NavBar/>}>
                    <Route element={<PrivateRoute/>}>
                     <WebSocketProvider>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/room/:id" element={<Room/>}/>
                     </WebSocketProvider>
                    </Route>
                    </Route>

                </Routes>
            </Router>
            </div>
    );
} 
export default App;
