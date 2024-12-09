import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Login} from "./components/login";
import {Home} from "./components/Home";
import {Navigation} from './components/navigation';
import {Logout} from './components/logout';
function App() {
    return (
        <>
        <div style={{ padding: "100px" }}>
        <BrowserRouter>
        <Navigation></Navigation>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>
            </Routes>
        </BrowserRouter>
        </div>
        </>
    );
}

export default App;