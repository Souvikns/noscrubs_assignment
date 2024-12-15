import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/home";
import Callback from "./pages/callback";
import { CookiesProvider } from 'react-cookie'


function App() {

  return (
    <>
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/api/callback" element={<Callback />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </>
  );
}

export default App;
