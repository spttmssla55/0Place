import React, { useState } from "react";
import "./ModalAuth.css";

function LoginModal({ onClose, onSignupClick, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg("");
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        onSuccess(data);
        onClose();
      } else {
        setErrorMsg("로그인 실패 (아이디/비밀번호 확인)");
      }
    } catch (err) {
      setErrorMsg("네트워크 오류");
    }
  };

  return (
    <div className="auth-modal-bg">
      <div className="auth-modal-card">
        <h2 className="auth-modal-title">로그인</h2>
        <input className="auth-modal-input" placeholder="아이디" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="auth-modal-input" type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} />
        {errorMsg && <div className="auth-modal-error">{errorMsg}</div>}
        <div className="auth-modal-actions">
          <button className="auth-modal-btn-main" onClick={handleLogin}>로그인</button>
          <button className="auth-modal-btn-alt" onClick={onSignupClick}>회원가입</button>
          <button className="auth-modal-btn-close" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
