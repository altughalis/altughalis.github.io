import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ServisPanelYetkili = ({ user, token }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [showBayiler, setShowBayiler] = useState(false);
  const [showPaymentsTable, setShowPaymentsTable] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [records, setRecords] = useState([
    {
      id: "#1757583323058",
      date: "11.09.2025 12:35:23",
      customer: "refrsan — 1234",
      problem: "deneme yapıldı",
      createdBy: "admin",
    },
  ]);

  useEffect(() => {
    document.title = "Teknik Servis - Yönetim Paneli";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("servisEmail");
    window.location.href = "/login";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRecord = {
      id: `#${Date.now()}`,
      date: new Date().toLocaleString("tr-TR"),
      customer: `${formData.get("customer")} — ${formData.get("device")}`,
      problem: formData.get("problem"),
      createdBy: user.email || "admin",
    };
    setRecords([...records, newRecord]);
    e.target.reset();
    setImagePreview(null);
  };

  const bayiler = ["Bayi 1 - İstanbul", "Bayi 2 - Ankara", "Bayi 3 - İzmir", "Bayi 4 - Bursa", "Bayi 5 - Antalya"];

  if (!user || user.role !== "servis") {
    return <Navigate to="/" replace />;
  }

  const bodyStyle = {
    margin: 0,
    fontFamily: "Arial, sans-serif",
    background: "#f4f6f9",
    color: "#333",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 25px",
    background: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    color: "#333",
  };

  const userInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#333",
  };

  const logoutBtnStyle = {
    padding: "6px 12px",
    border: "none",
    background: "#eee",
    cursor: "pointer",
    borderRadius: "4px",
    color: "#333",
  };

  const containerStyle = {
    display: "flex",
    gap: "20px",
    padding: "20px",
  };

  const leftPanelStyle = {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const rightPanelStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  const cardH3Style = {
    marginTop: 0,
    marginBottom: "15px",
  };

  const formLabelStyle = {
    display: "block",
    margin: "10px 0 5px",
    fontSize: "14px",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    fontSize: "14px",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "80px",
    resize: "vertical",
  };

  const selectStyle = {
    ...inputStyle,
  };

  const fileInputStyle = {
    ...inputStyle,
  };

  const formButtonsStyle = {
    display: "flex",
    gap: "10px",
  };

  const btnPrimaryStyle = {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const btnSecondaryStyle = {
    background: "#f8f9fa",
    border: "1px solid #ddd",
    padding: "10px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "block",
    marginBottom: "10px",
    width: "100%",
    color: "#333",
  };

  const recordStyle = {
    borderTop: "1px solid #eee",
    paddingTop: "10px",
    fontSize: "14px",
  };

  const previewAreaStyle = {
    marginTop: "10px",
  };

  const imgStyle = {
    maxWidth: "100%",
    borderRadius: "6px",
  };

  return (
    <div style={bodyStyle}>
      <header style={topBarStyle}>
        <h2>Teknik Servis - Yönetim Paneli</h2>
        <div style={userInfoStyle}>
          <span>{user.email ? user.email : "Giriş yapılmadı"}</span>
          <button style={logoutBtnStyle} onClick={handleLogout}>
            Çıkış
          </button>
        </div>
      </header>

      <main style={containerStyle}>
        {/* Sol Kısım */}
        <section style={leftPanelStyle}>
          <div style={cardStyle}>
            <h3 style={cardH3Style}>Servis Formu</h3>
            <form onSubmit={handleSubmit}>
              <label style={formLabelStyle}>Müşteri Adı</label>
              <input type="text" name="customer" placeholder="Müşteri adı girin" style={inputStyle} />

              <label style={formLabelStyle}>Cihaz Modeli</label>
              <input type="text" name="device" placeholder="Cihaz modeli girin" style={inputStyle} />

              <label style={formLabelStyle}>Problem Açıklaması</label>
              <textarea name="problem" placeholder="Problemi açıklayın" style={textareaStyle}></textarea>

              <label style={formLabelStyle}>Garanti</label>
              <select style={selectStyle}>
                <option>Var</option>
                <option>Yok</option>
              </select>

              <label style={formLabelStyle}>Resim Ekle (opsiyonel)</label>
              <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} style={fileInputStyle} />

              <div style={formButtonsStyle}>
                <button type="submit" style={btnPrimaryStyle}>
                  Kaydet / Gönder
                </button>
                <button type="button" style={btnSecondaryStyle}>
                  Taslak Olarak Kaydet
                </button>
              </div>
            </form>
          </div>

          <div style={cardStyle}>
            <h3 style={cardH3Style}>Tüm Servis Kayıtları</h3>
            {records.map((record, index) => (
              <div key={index} style={recordStyle}>
                <p>
                  <strong>{record.id} — {record.date}</strong>
                </p>
                <p>
                  <b>{record.customer}</b>
                </p>
                <p>
                  <b>Problem:</b> {record.problem}
                </p>
                <p>
                  <small>Kaydı açan: {record.createdBy}</small>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sağ Kısım */}
        <aside style={rightPanelStyle}>
          <div style={cardStyle}>
            <h3 style={cardH3Style}>Hızlı İşlemler</h3>
            <button style={btnSecondaryStyle} onClick={() => setShowBayiler(!showBayiler)}>Tüm Bayileri Görüntüle</button>
            {showBayiler && (
              <div style={{ marginTop: "10px" }}>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {bayiler.map((bayi, index) => (
                    <li key={index} style={{ padding: "5px 0", borderBottom: "1px solid #eee" }}>
                      {bayi}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button style={btnSecondaryStyle} onClick={() => setShowPaymentsTable(!showPaymentsTable)}>Ödemeleri Yönet</button>
            {showPaymentsTable && (
              <div style={{ marginTop: "10px", padding: "10px", background: "#f9f9f9", borderRadius: "6px", border: "1px solid #ddd" }}>
                <h4>Cari Gelir Tablosu</h4>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tarih</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Açıklama</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Gelir</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Gider</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>2023-10-01</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>Bayi 1 Ödeme</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>500 TL</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>-</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>2023-10-02</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>Bayi 2 Ödeme</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>750 TL</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>-</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>2023-10-03</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>Malzeme Gideri</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>-</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>300 TL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <button style={btnSecondaryStyle} onClick={() => setShowSettings(!showSettings)}>Ayarlar</button>
            {showSettings && (
              <div style={{ marginTop: "10px", padding: "10px", background: "#f9f9f9", borderRadius: "6px", border: "1px solid #ddd" }}>
                <h4>Ayarlar</h4>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Tema:</label>
                  <select style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}>
                    <option>Açık</option>
                    <option>Koyu</option>
                  </select>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Bildirimler:</label>
                  <input type="checkbox" style={{ marginRight: "5px" }} /> E-posta bildirimleri
                  <br />
                  <input type="checkbox" style={{ marginRight: "5px" }} /> SMS bildirimleri
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Dil:</label>
                  <select style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}>
                    <option>Türkçe</option>
                    <option>English</option>
                  </select>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Otomatik Kaydetme:</label>
                  <input type="checkbox" style={{ marginRight: "5px" }} /> Etkinleştir
                </div>
                <button style={{ background: "#28a745", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>Kaydet</button>
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h3 style={cardH3Style}>Resim Yükleme Önizleme</h3>
            <div id="previewArea" style={previewAreaStyle}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={imgStyle} />
              ) : (
                <p>Henüz resim seçilmedi.</p>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ServisPanelYetkili;
