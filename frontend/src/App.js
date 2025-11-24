import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import HomePage from './components/home/HomePage';
import NearbyPage from './components/nearby/NearbyPage';
import NationwidePage from './components/nationwide/NationwidePage';
import LoginModal from './components/auth/LoginModal';
import SignupModal from './components/auth/SignupModal';
import ProfileModal from "./components/auth/ProfileModal";


function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);


  return (
    <Router>
      <div className="app">
        <Header
          user={currentUser}
          onLoginClick={() => setShowLogin(true)}
          onLogout={() => setCurrentUser(null)}
          onUserClick={() => setShowProfile(true)}
        />
        <Routes>
          <Route path="/" element={<HomePage user={currentUser} />} />
          <Route path="/nearby" element={<NearbyPage />} />
          <Route path="/nationwide" element={<NationwidePage />} />
        </Routes>
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSignupClick={() => {
              setShowLogin(false); // 로그인창 닫고
              setShowSignup(true); // 회원가입창 열기!
            }}
            onSuccess={setCurrentUser}
          />
        )}
        {showSignup && (
          <SignupModal
            onClose={() => setShowSignup(false)}
            onLoginClick={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
        )}
        {showProfile && currentUser && (
          <ProfileModal
            user={currentUser}
            onClose={() => setShowProfile(false)}
            onProfileUpdate={setCurrentUser}
            onDeleteUser={() => setCurrentUser(null)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
