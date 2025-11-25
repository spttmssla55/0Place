import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import HomePage from './components/home/HomePage';
import NearbyPage from './components/nearby/NearbyPage';
import NationwidePage from './components/nationwide/NationwidePage';
import LoginModal from './components/auth/LoginModal';
import SignupModal from './components/auth/SignupModal';
import ProfileModal from "./components/auth/ProfileModal";
import BookmarkPage from './components/myplace/BookmarkPage';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 로그인 유지: 새로고침해도 sessionStorage에 값 있으면 로그인 유지
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Header
          user={currentUser}
          onLoginClick={() => setShowLogin(true)}
          onLogout={() => {
            setCurrentUser(null);
            sessionStorage.removeItem("user");
          }}
          onUserClick={() => setShowProfile(true)}
        />
        <Routes>
          <Route path="/" element={<HomePage user={currentUser} />} />
          <Route path="/nearby" element={<NearbyPage currentUser={currentUser} />} />
          <Route path="/nationwide" element={<NationwidePage currentUser={currentUser} />} />
          <Route path="/bookmark" element={<BookmarkPage user={currentUser} />} />

        </Routes>
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSignupClick={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
            onSuccess={(user) => {
              setCurrentUser(user);
              sessionStorage.setItem("user", JSON.stringify(user)); // 로그인 정보 저장
            }}
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
            onProfileUpdate={(user) => {
              setCurrentUser(user);
              sessionStorage.setItem("user", JSON.stringify(user)); // 프로필 변경도 동기화
            }}
            onDeleteUser={() => {
              setCurrentUser(null);
              sessionStorage.removeItem("user");
            }}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
