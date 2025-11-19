import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import NearbyPage from './components/nearby/NearbyPage';
import NationwidePage from './components/nationwide/NationwidePage';
import HomePage from './components/home/HomePage';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/nearby" element={<NearbyPage />} />
          <Route path="/nationwide" element={<NationwidePage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
