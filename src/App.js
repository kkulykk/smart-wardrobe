import {Route, BrowserRouter as Router, Routes, Navigate} from 'react-router-dom';
import {ColorSchemeProvider} from 'gestalt';

import Main from "./pages/Main/Main";
import UploadItem from "./pages/UploadItem/UploadItem";
import Wardrobe from "./pages/Wardrobe/Wardrobe";

import './App.css';
import 'gestalt/dist/gestalt.css';

function App() {
    return (
        <ColorSchemeProvider colorScheme="light" fullDimensions>
            <Router>
                <Routes>
                    <Route path="/upload" element={<UploadItem/>}/>
                    <Route path="/wardrobe" element={<Wardrobe/>}/>
                    <Route path="/" element={<Main/>}/>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </Router>
        </ColorSchemeProvider>
    );
}

export default App;