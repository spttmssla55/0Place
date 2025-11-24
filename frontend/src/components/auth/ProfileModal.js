import React, { useState } from "react";
import "./ModalAuth.css";

function ProfileModal({ user, onClose, onProfileUpdate, onDeleteUser }) {
  // 이름, 비밀번호 입력 상태
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  // 회원정보(이름) 변경
  const handleNameChange = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, name }),
      });
      if (res.ok) {
        setMsg("이름이 변경되었습니다.");
        onProfileUpdate({ ...user, name });
      } else {
        setMsg("이름 변경 실패");
      }
    } catch {
      setMsg("네트워크 오류");
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          oldPassword: password,
          newPassword: newPassword,
        }),
      });
      if (res.ok) {
        setMsg("비밀번호가 변경되었습니다.");
        setPassword("");
        setNewPassword("");
      } else {
        setMsg("비밀번호 변경 실패");
      }
    } catch {
      setMsg("네트워크 오류");
    }
  };

  // 회원탈퇴
  const handleDelete = async () => {
    if (!window.confirm("정말 회원 탈퇴 하시겠습니까?")) return;
    try {
      const res = await fetch("/api/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username }),
      });
      if (res.ok) {
        alert("회원 탈퇴 완료!");
        onDeleteUser();
        onClose();
      } else {
        setMsg("회원 탈퇴 실패");
      }
    } catch {
      setMsg("네트워크 오류");
    }
  };

  return (
    <div className="auth-modal-bg">
      <div className="auth-modal-card">
        <h2 className="auth-modal-title">{user.name}님 프로필</h2>
        {/* 이름 변경 */}
        <form onSubmit={handleNameChange}>
          <input className="auth-modal-input" value={name} onChange={e => setName(e.target.value)} placeholder="이름 변경" />
          <button className="auth-modal-btn-main" type="submit">이름 변경</button>
        </form>
        {/* 비밀번호 변경 */}
        <form onSubmit={handlePasswordChange} style={{ marginTop: 18 }}>
          <input className="auth-modal-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="기존 비밀번호"
            required />
          <input className="auth-modal-input"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="새 비밀번호"
            required />
          <button className="auth-modal-btn-alt" type="submit">비밀번호 변경</button>
        </form>
        {/* 회원 탈퇴 */}
        <div style={{ marginTop: 18, textAlign: "right" }}>
          <button className="auth-modal-btn-close" onClick={handleDelete} style={{color:'#f06666'}}>회원탈퇴</button>
        </div>
        <button className="auth-modal-btn-close" onClick={onClose}>닫기</button>
        {msg && <div className="auth-modal-error">{msg}</div>}
      </div>
    </div>
  );
}

export default ProfileModal;
