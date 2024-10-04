import React, { useState, useEffect } from 'react';
import { Link, Route, useLocation } from 'react-router-dom';
import './App.css';
import './assets/sidebar.css';
import Navbar from './component/navbar';
import Myrouter from './router';

function App() {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [showPlateform, setPlateform] = useState(true)

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }

   
  }, [location.pathname]); 
  return (
    <div className="App">
      {showNavbar && <Navbar />}
        <Myrouter />
         </div>
  );
}

export default App;
