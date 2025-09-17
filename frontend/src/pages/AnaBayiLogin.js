import React from "react";
import "../App.css";
import { useState } from "react";

export default function AnaBayiLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.data.user.role !== "anabayi") {
        setError("Sadece ana bayi girişi yapılabilir.");
        setLoading(false);
        return;
      }
      if (onLogin) onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError("Giriş başarısız! Bilgileri kontrol edin.");
    }
    setLoading(false);
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: 400,
        margin: "4rem auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "2rem",
      }}
    >
      <h2 className="text-center mb-4">Ana Bayi Giriş</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>E-posta</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Şifre</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
