import React, { useState } from "react";
import { login, register } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // Kayıt için ek alanlar
  const [registerMode, setRegisterMode] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("servis");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (registerMode) {
        // Kayıt ol
        const user = { name, email, password, role, username };
        const data = await register(user);
        setRegisterMode(false);
        setError("");
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      } else {
        // Giriş yap
        const data = await login(email, password);
        onLogin(data.user, data.token);
      }
    } catch (err) {
      setError(registerMode ? "Kayıt başarısız!" : "Giriş başarısız!");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 60 }}>
      <h2 className="login-title text-center mb-4">Teknik Servis</h2>
      {!registerMode ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-posta
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Şifre
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-danger mb-2">{error}</div>}
            <div className="d-flex align-items-center gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-fill"
                style={{ color: "#fff" }}
              >
                Giriş Yap
              </button>
              <span style={{ color: "#fff", fontWeight: 500 }}>
                Hesabınız yok mu?
              </span>
              <button
                type="button"
                className="btn btn-success"
                style={{ fontWeight: 600, color: "#fff" }}
                onClick={() => setRegisterMode(true)}
              >
                Kayıt Ol
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Ad Soyad
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Ad Soyad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Rol
              </label>
              <select
                className="form-control"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="admin">Admin</option>
                <option value="anabayi">Ana Bayi</option>
                <option value="altbayi">Alt Bayi</option>
                <option value="servis">Servis</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-posta
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Şifre
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-danger mb-2">{error}</div>}
            <div className="d-flex align-items-center gap-2">
              <button
                type="submit"
                className="btn btn-success flex-fill"
                style={{ color: "#fff" }}
              >
                Kayıt Ol
              </button>
              <span style={{ color: "#fff", fontWeight: 500 }}>
                Zaten hesabınız var mı?
              </span>
              <button
                type="button"
                className="btn btn-primary"
                style={{ fontWeight: 600, color: "#fff" }}
                onClick={() => setRegisterMode(false)}
              >
                Giriş Yap
              </button>
            </div>
          </form>
          {/* Alt kısım kaldırıldı, çünkü butonlar yukarıda yan yana */}
        </>
      )}
    </div>
  );
}
