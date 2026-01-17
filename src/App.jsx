import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Calculator from "./Calculator.jsx";
import Header from './header.jsx'
import Footer from './footer.jsx'
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Help from "./pages/Help";
import Support from "./pages/Support";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />
        <Route path="/support" element={<Support />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}


export default App

