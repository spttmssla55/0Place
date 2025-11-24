import React, { useState } from "react";
import "./ModalAuth.css";

function SignupModal({ onClose, onLoginClick }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name }),
      });
      if (res.ok) {
        alert("회원가입 성공! 로그인 해주세요.");
        onLoginClick();
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "회원가입 실패");
      }
    } catch (err) {
      setErrorMsg("네트워크 오류");
    }
  };

  return (
    <div className="auth-modal-bg">
      <div className="auth-modal-card">
        <h2 className="auth-modal-title">회원가입</h2>
        <form onSubmit={handleSignup}>
          <input className="auth-modal-input" placeholder="이름" value={name} onChange={e => setName(e.target.value)} required />
          <input className="auth-modal-input" placeholder="아이디" value={username} onChange={e => setUsername(e.target.value)} required />
          <input className="auth-modal-input" type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} required />
          <div className="auth-modal-actions">
            <button type="submit" className="auth-modal-btn-main">회원가입</button>
            <button type="button" className="auth-modal-btn-alt" onClick={onLoginClick}>로그인으로</button>
            <button type="button" className="auth-modal-btn-close" onClick={onClose}>닫기</button>
          </div>
          {errorMsg && <div className="auth-modal-error">{errorMsg}</div>}
        </form>
      </div>
    </div>
  );
}

export default SignupModal;
