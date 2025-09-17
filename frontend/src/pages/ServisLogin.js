import React from "react";
import "../App.css";

export default function ServisLogin() {
  return (
    <div className="login-bg">
      <div className="login-box">
        <h2>Yetkili Servis Girişi</h2>
        <form>
          <input type="email" placeholder="E-posta" required />
          <input type="password" placeholder="Şifre" required />
          <button className="btn btn-primary w-100">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}
