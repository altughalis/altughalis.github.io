import React, { useState, useEffect } from "react";
import { createServiceRecord, updateAltBayi, makePayment, fetchServiceRecords } from "../api";

export default function AltBayiPanel({ user, token }) {
  const [selected, setSelected] = useState("genel");

  // Demo veriler
  const bayiData = {
    adi: "Bursa Alt Bayi",
    yetkili: "Ali Vural",
    telefon: "0555 123 4567",
    email: "ali@altbayi.com",
    adres: "Osmangazi/Bursa",
    kod: "ALTB-001",
    uyelik: "01.01.2022",
  };

  const performanceData = {
    toplamServis: 42,
    acikServis: 5,
    tamamlananServis: 37,
    bekleyenOdeme: 2,
    sonIslemler: [
      { tarih: "17.09.2025", islem: "Servis kaydı oluşturuldu" },
      { tarih: "16.09.2025", islem: "Ödeme yapıldı" },
      { tarih: "15.09.2025", islem: "Servis kaydı tamamlandı" },
    ],
  };

  const financeData = {
    bakiye: "₺7.500",
    sonOdemeler: [
      { tarih: "16.09.2025", tutar: "₺2.000" },
      { tarih: "10.09.2025", tutar: "₺1.500" },
    ],
    bekleyenFaturalar: [
      { no: "FTR-001", tutar: "₺1.000" },
      { no: "FTR-002", tutar: "₺500" },
    ],
  };

  // Demo müşteri verisi
  const [musteriler, setMusteriler] = useState([
    {
      _id: "1",
      name: "Ahmet Yılmaz",
      region: "İstanbul",
      phone: "0555 123 4567",
    },
    { _id: "2", name: "Ayşe Kaya", region: "İstanbul", phone: "0555 234 5678" },
    {
      _id: "3",
      name: "Mehmet Demir",
      region: "İstanbul",
      phone: "0555 345 6789",
    },
  ]);

  // Demo sipariş listesi
  const [siparisListesi, setSiparisListesi] = useState([
    { no: 1, tarih: "15.09.2025", urun: "Ürün A", adet: 5, musteri: "Ahmet Yılmaz", durum: "Bekliyor" },
    { no: 2, tarih: "16.09.2025", urun: "Ürün B", adet: 3, musteri: "Ayşe Kaya", durum: "Tamamlandı" },
  ]);

  // Demo cari işlemler
  const [cariIslemler, setCariIslemler] = useState([
    { no: 1, tarih: "15.09.2025", aciklama: "Satış", borc: 1000, alacak: 0, bakiye: 1000 },
    { no: 2, tarih: "16.09.2025", aciklama: "Ödeme", borc: 0, alacak: 500, bakiye: 500 },
  ]);

  // Form states
  const [serviceForm, setServiceForm] = useState({ description: '', cost: '', status: 'Açık' });
  const [paymentForm, setPaymentForm] = useState({ amount: '' });
  const [bayiForm, setBayiForm] = useState({ name: '', region: '' });
  const [cariForm, setCariForm] = useState({ aciklama: '', borc: '', alacak: '' });
  const [raporForm, setRaporForm] = useState({ startDate: '', endDate: '' });
  const [siparisForm, setSiparisForm] = useState({ urun: '', adet: '', musteri: '' });

  // Service records state
  const [serviceRecords, setServiceRecords] = useState([]);

  // Fetch service records on mount
  useEffect(() => {
    const loadServiceRecords = async () => {
      try {
        const records = await fetchServiceRecords(user._id, token);
        setServiceRecords(records);
      } catch (error) {
        console.error("Error fetching service records:", error);
      }
    };
    if (user && token) {
      loadServiceRecords();
    }
  }, [user, token]);

  const handleCreateServiceForm = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!serviceForm.description || !serviceForm.cost) {
        alert("Lütfen tüm alanları doldurun.");
        return;
      }
      const data = {
        description: serviceForm.description,
        cost: parseFloat(serviceForm.cost),
        status: serviceForm.status,
        altBayiId: user._id,
        tarih: new Date().toISOString()
      };
      await createServiceRecord(data, token);
      setServiceForm({ description: '', cost: '', status: 'Açık' });
      // Refresh table by fetching updated records
      const updatedRecords = await fetchServiceRecords(user._id, token);
      setServiceRecords(updatedRecords);
      alert("Servis kaydı oluşturuldu ve veritabanına eklendi");
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  const handleMakePaymentForm = async (e) => {
    e.preventDefault();
    try {
      if (!paymentForm.amount || isNaN(paymentForm.amount)) {
        alert("Lütfen geçerli bir ödeme miktarı girin.");
        return;
      }
      await makePayment(user._id, parseFloat(paymentForm.amount), token);
      setPaymentForm({ amount: '' });
      alert("Ödeme yapıldı ve bakiye güncellendi");
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  const handleEditBayiForm = async (e) => {
    e.preventDefault();
    try {
      if (!bayiForm.name || !bayiForm.region) {
        alert("Lütfen bayi adı ve bölgeyi doldurun.");
        return;
      }
      await updateAltBayi(user._id, bayiForm, token);
      setBayiForm({ name: '', region: '' });
      alert("Bayi bilgileri güncellendi");
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  const handleCariForm = (e) => {
    e.preventDefault();
    const newCari = {
      no: cariIslemler.length + 1,
      tarih: new Date().toLocaleDateString('tr-TR'),
      aciklama: cariForm.aciklama,
      borc: parseFloat(cariForm.borc) || 0,
      alacak: parseFloat(cariForm.alacak) || 0,
      bakiye: (cariIslemler[cariIslemler.length - 1]?.bakiye || 0) + (parseFloat(cariForm.borc) || 0) - (parseFloat(cariForm.alacak) || 0)
    };
    setCariIslemler([...cariIslemler, newCari]);
    setCariForm({ aciklama: '', borc: '', alacak: '' });
    alert("Cari işlem eklendi");
  };

  const handleRaporForm = (e) => {
    e.preventDefault();
    // TODO: Implement real filtering from API
    alert(`Rapor filtrelendi: ${raporForm.startDate} - ${raporForm.endDate}`);
  };

  const handleSiparisForm = (e) => {
    e.preventDefault();
    const newSiparis = {
      no: siparisListesi.length + 1,
      tarih: new Date().toLocaleDateString('tr-TR'),
      urun: siparisForm.urun,
      adet: parseInt(siparisForm.adet),
      musteri: siparisForm.musteri,
      durum: "Bekliyor"
    };
    setSiparisListesi([...siparisListesi, newSiparis]);
    setSiparisForm({ urun: '', adet: '', musteri: '' });
    alert("Sipariş eklendi");
  };

  return (
    <div style={{ display: "flex" }}>
      <aside
        className="sidebar"
        style={{
          width: 280,
          background: "#f0f4f8",
          padding: "2rem 1.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          minHeight: "100vh",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            fontWeight: 700,
            letterSpacing: 1,
            color: "#0056b3",
            textTransform: "uppercase",
            fontSize: "1.5rem",
            borderBottom: "2px solid #0056b3",
            paddingBottom: "0.5rem",
          }}
        >
          Alt Bayi Paneli
        </h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "genel" ? "#0056b3" : "transparent",
              color: selected === "genel" ? "#fff" : "#333",
              fontWeight: selected === "genel" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("genel")}
          >
            Genel Bilgiler
            <div
              style={{
                fontSize: 12,
                color: selected === "genel" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              Bayi bilgilerini görüntüleyin.
            </div>
          </li>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "performans" ? "#0056b3" : "transparent",
              color: selected === "performans" ? "#fff" : "#333",
              fontWeight: selected === "performans" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("performans")}
          >
            Performans
            <div
              style={{
                fontSize: 12,
                color: selected === "performans" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              İşlemler ve performans verilerini inceleyin.
            </div>
          </li>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "finans" ? "#0056b3" : "transparent",
              color: selected === "finans" ? "#fff" : "#333",
              fontWeight: selected === "finans" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("finans")}
          >
            Finans
            <div
              style={{
                fontSize: 12,
                color: selected === "finans" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              Bakiye ve ödeme bilgilerini takip edin.
            </div>
          </li>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "hizli" ? "#0056b3" : "transparent",
              color: selected === "hizli" ? "#fff" : "#333",
              fontWeight: selected === "hizli" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("hizli")}
          >
            Hızlı İşlemler
            <div
              style={{
                fontSize: 12,
                color: selected === "hizli" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              Servis, ödeme ve bayi düzenleme işlemlerini yapın.
            </div>
          </li>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "musteriler" ? "#0056b3" : "transparent",
              color: selected === "musteriler" ? "#fff" : "#333",
              fontWeight: selected === "musteriler" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("musteriler")}
          >
            Müşteriler
            <div
              style={{
                fontSize: 12,
                color: selected === "musteriler" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              Müşteri bilgilerini yönetin.
            </div>
          </li>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "siparis" ? "#0056b3" : "transparent",
              color: selected === "siparis" ? "#fff" : "#333",
              fontWeight: selected === "siparis" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("siparis")}
          >
            Siparişler
            <div
              style={{
                fontSize: 12,
                color: selected === "siparis" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              Sipariş işlemlerini takip edin.
            </div>
          </li>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "cari" ? "#0056b3" : "transparent",
              color: selected === "cari" ? "#fff" : "#333",
              fontWeight: selected === "cari" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("cari")}
          >
            Cari Hesaplar
            <div
              style={{
                fontSize: 12,
                color: selected === "cari" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              Cari hesap hareketlerini inceleyin.
            </div>
          </li>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "rapor" ? "#0056b3" : "transparent",
              color: selected === "rapor" ? "#fff" : "#333",
              fontWeight: selected === "rapor" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("rapor")}
          >
            Raporlama
            <div
              style={{
                fontSize: 12,
                color: selected === "rapor" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              Raporları görüntüleyin.
            </div>
          </li>
        </ul>
      </aside>
      <main
        style={{
          flex: 1,
          background: "#fff",
          padding: "3rem 4rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {selected === "genel" && (
          <div style={{ width: "100%" }}>
            <h2>Genel Bilgiler</h2>
            <table style={{ width: "100%", fontSize: "1rem" }}>
              <tbody>
                <tr><td>Bayi Adı</td><td>{bayiData.adi}</td></tr>
                <tr><td>Yetkili Kişi</td><td>{bayiData.yetkili}</td></tr>
                <tr><td>Telefon / E-posta</td><td>{bayiData.telefon} / {bayiData.email}</td></tr>
                <tr><td>Adres</td><td>{bayiData.adres}</td></tr>
                <tr><td>Bayi Kodu</td><td>{bayiData.kod}</td></tr>
                <tr><td>Üyelik Başlangıç Tarihi</td><td>{bayiData.uyelik}</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {selected === "performans" && (
          <div style={{ width: "100%" }}>
            <h2>Performans / İşlemler</h2>
            <table style={{ width: "100%", fontSize: "1rem" }}>
              <tbody>
                <tr><td>Toplam Servis Kaydı</td><td>{performanceData.toplamServis}</td></tr>
                <tr><td>Açık Servis Kayıtları</td><td>{performanceData.acikServis}</td></tr>
                <tr><td>Tamamlanan Servis Kayıtları</td><td>{performanceData.tamamlananServis}</td></tr>
                <tr><td>Bekleyen Ödemeler</td><td>{performanceData.bekleyenOdeme}</td></tr>
              </tbody>
            </table>
            <h3>Son Yapılan İşlemler</h3>
            <ul>
              {performanceData.sonIslemler.map((islem, i) => (
                <li key={i}>{islem.tarih} - {islem.islem}</li>
              ))}
            </ul>
          </div>
        )}
        {selected === "finans" && (
          <div style={{ width: "100%" }}>
            <h2>Finans / Ödeme Bilgileri</h2>
            <table style={{ width: "100%", fontSize: "1rem" }}>
              <tbody>
                <tr><td>Bayi Bakiyesi</td><td>{financeData.bakiye}</td></tr>
              </tbody>
            </table>
            <h3>Son Ödemeler</h3>
            <ul>
              {financeData.sonOdemeler.map((odeme, i) => (
                <li key={i}>{odeme.tarih} - {odeme.tutar}</li>
              ))}
            </ul>
            <h3>Bekleyen Faturalar</h3>
            <ul>
              {financeData.bekleyenFaturalar.map((fatura, i) => (
                <li key={i}>{fatura.no} - {fatura.tutar}</li>
              ))}
            </ul>
          </div>
        )}
        {selected === "hizli" && (
          <div style={{ width: "100%" }}>
            <h2 style={{ color: "#0056b3", marginBottom: "2rem", fontSize: "2rem", fontWeight: "600" }}>Hızlı İşlemler</h2>

            <div style={{ marginBottom: 50, background: "#f8f9fa", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.07)" }}>
              <h3 style={{ color: "#0056b3", marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "500" }}>📋 Servis Kaydı Oluştur</h3>
              <form onSubmit={handleCreateServiceForm} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end", marginBottom: "2rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Açıklama</label>
                  <input
                    type="text"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0056b3"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Maliyet (₺)</label>
                  <input
                    type="number"
                    value={serviceForm.cost}
                    onChange={(e) => setServiceForm({ ...serviceForm, cost: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0056b3"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Durum</label>
                  <select
                    value={serviceForm.status}
                    onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      background: "white",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0056b3"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  >
                    <option value="Açık">Açık</option>
                    <option value="Kapalı">Kapalı</option>
                  </select>
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "linear-gradient(135deg, #0056b3, #007bff)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 4px rgba(0,86,179,0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(0,86,179,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(0,86,179,0.3)";
                  }}
                >
                  ➕ Oluştur
                </button>
              </form>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <thead style={{ background: "#0056b3", color: "white" }}>
                  <tr>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Açıklama</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Maliyet</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Durum</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRecords.length > 0 ? (
                    serviceRecords.map((record) => (
                      <tr key={record._id} style={{ borderBottom: "1px solid #e1e5e9" }}>
                        <td style={{ padding: "1rem" }}>{record.description}</td>
                        <td style={{ padding: "1rem" }}>₺{record.cost}</td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{
                            background: record.status === "Açık" ? "#28a745" : "#dc3545",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.875rem"
                          }}>
                            {record.status}
                          </span>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          {new Date(record.tarih).toLocaleDateString('tr-TR')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
                        Henüz servis kaydı bulunmuyor.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: 50, background: "#f8f9fa", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.07)" }}>
              <h3 style={{ color: "#28a745", marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "500" }}>💳 Ödeme Yap</h3>
              <form onSubmit={handleMakePaymentForm} style={{ display: "flex", gap: "1rem", alignItems: "end", marginBottom: "2rem", maxWidth: "400px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Ödeme Miktarı (₺)</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ amount: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#28a745"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "linear-gradient(135deg, #28a745, #20c997)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 4px rgba(40,167,69,0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(40,167,69,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(40,167,69,0.3)";
                  }}
                >
                  💰 Ödeme Yap
                </button>
              </form>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <thead style={{ background: "#28a745", color: "white" }}>
                  <tr>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Tarih</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Miktar</th>
                  </tr>
                </thead>
                <tbody>
                  {financeData.sonOdemeler.map((odeme, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e1e5e9" }}>
                      <td style={{ padding: "1rem" }}>{odeme.tarih}</td>
                      <td style={{ padding: "1rem", fontWeight: "600", color: "#28a745" }}>{odeme.tutar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: "#f8f9fa", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.07)" }}>
              <h3 style={{ color: "#ffc107", marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "500" }}>⚙️ Bayi Bilgilerini Düzenle</h3>
              <form onSubmit={handleEditBayiForm} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "1rem", alignItems: "end", marginBottom: "2rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Bayi Adı</label>
                  <input
                    type="text"
                    value={bayiForm.name}
                    onChange={(e) => setBayiForm({ ...bayiForm, name: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#ffc107"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Bölge</label>
                  <input
                    type="text"
                    value={bayiForm.region}
                    onChange={(e) => setBayiForm({ ...bayiForm, region: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#ffc107"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "linear-gradient(135deg, #ffc107, #fd7e14)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 4px rgba(255,193,7,0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(255,193,7,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(255,193,7,0.3)";
                  }}
                >
                  🔄 Güncelle
                </button>
              </form>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #e1e5e9" }}>
                    <td style={{ padding: "1rem", fontWeight: "600", background: "#f8f9fa", width: "200px" }}>Bayi Adı</td>
                    <td style={{ padding: "1rem" }}>{bayiData.adi}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "1rem", fontWeight: "600", background: "#f8f9fa" }}>Bölge</td>
                    <td style={{ padding: "1rem" }}>{bayiData.adres.split('/')[1]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {selected === "musteriler" && (
          <div style={{ width: "100%" }}>
            <h2>Müşteriler</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>İsim</th>
                  <th>Bölge</th>
                  <th>Telefon</th>
                </tr>
              </thead>
              <tbody>
                {musteriler.map((musteri) => (
                  <tr key={musteri._id}>
                    <td>{musteri._id}</td>
                    <td>{musteri.name}</td>
                    <td>{musteri.region}</td>
                    <td>{musteri.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selected === "siparis" && (
          <div style={{ width: "100%" }}>
            <h2 style={{ color: "#0056b3", marginBottom: "2rem", fontSize: "2rem", fontWeight: "600" }}>📦 Siparişler</h2>

            <div style={{ marginBottom: 50, background: "#f8f9fa", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.07)" }}>
              <h3 style={{ color: "#17a2b8", marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "500" }}>➕ Yeni Sipariş Ekle</h3>
              <form onSubmit={handleSiparisForm} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end", marginBottom: "2rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Ürün Adı</label>
                  <input
                    type="text"
                    value={siparisForm.urun}
                    onChange={(e) => setSiparisForm({ ...siparisForm, urun: e.target.value })}
                    placeholder="Ürün adını girin"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#17a2b8"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Adet</label>
                  <input
                    type="number"
                    value={siparisForm.adet}
                    onChange={(e) => setSiparisForm({ ...siparisForm, adet: e.target.value })}
                    placeholder="Miktar"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#17a2b8"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Müşteri</label>
                  <input
                    type="text"
                    value={siparisForm.musteri}
                    onChange={(e) => setSiparisForm({ ...siparisForm, musteri: e.target.value })}
                    placeholder="Müşteri adı"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#17a2b8"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "linear-gradient(135deg, #17a2b8, #20c997)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 4px rgba(23,162,184,0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(23,162,184,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(23,162,184,0.3)";
                  }}
                >
                  📦 Ekle
                </button>
              </form>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <thead style={{ background: "#17a2b8", color: "white" }}>
                  <tr>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>No</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Tarih</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Ürün</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Adet</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Müşteri</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {siparisListesi.map((siparis) => (
                    <tr key={siparis.no} style={{ borderBottom: "1px solid #e1e5e9" }}>
                      <td style={{ padding: "1rem" }}>{siparis.no}</td>
                      <td style={{ padding: "1rem" }}>{siparis.tarih}</td>
                      <td style={{ padding: "1rem" }}>{siparis.urun}</td>
                      <td style={{ padding: "1rem" }}>{siparis.adet}</td>
                      <td style={{ padding: "1rem" }}>{siparis.musteri}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{
                          background: siparis.durum === "Tamamlandı" ? "#28a745" : "#ffc107",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.875rem"
                        }}>
                          {siparis.durum}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {selected === "cari" && (
          <div style={{ width: "100%" }}>
            <h2 style={{ color: "#0056b3", marginBottom: "2rem", fontSize: "2rem", fontWeight: "600" }}>💼 Cari Hesaplar</h2>

            <div style={{ marginBottom: 50, background: "#f8f9fa", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.07)" }}>
              <h3 style={{ color: "#e67e22", marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "500" }}>➕ Yeni Cari İşlem Ekle</h3>
              <form onSubmit={handleCariForm} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end", marginBottom: "2rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Açıklama</label>
                  <input
                    type="text"
                    value={cariForm.aciklama}
                    onChange={(e) => setCariForm({ ...cariForm, aciklama: e.target.value })}
                    placeholder="İşlem açıklaması"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#e67e22"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Borç (₺)</label>
                  <input
                    type="number"
                    value={cariForm.borc}
                    onChange={(e) => setCariForm({ ...cariForm, borc: e.target.value })}
                    placeholder="Borç miktarı"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#e67e22"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Alacak (₺)</label>
                  <input
                    type="number"
                    value={cariForm.alacak}
                    onChange={(e) => setCariForm({ ...cariForm, alacak: e.target.value })}
                    placeholder="Alacak miktarı"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#e67e22"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "linear-gradient(135deg, #e67e22, #d35400)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 4px rgba(230,126,34,0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(230,126,34,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(230,126,34,0.3)";
                  }}
                >
                  💼 Ekle
                </button>
              </form>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <thead style={{ background: "#e67e22", color: "white" }}>
                  <tr>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>No</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Tarih</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Açıklama</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Borç</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Alacak</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Bakiye</th>
                  </tr>
                </thead>
                <tbody>
                  {cariIslemler.map((cari) => (
                    <tr key={cari.no} style={{ borderBottom: "1px solid #e1e5e9" }}>
                      <td style={{ padding: "1rem" }}>{cari.no}</td>
                      <td style={{ padding: "1rem" }}>{cari.tarih}</td>
                      <td style={{ padding: "1rem" }}>{cari.aciklama}</td>
                      <td style={{ padding: "1rem", color: "#dc3545", fontWeight: "600" }}>{cari.borc}₺</td>
                      <td style={{ padding: "1rem", color: "#28a745", fontWeight: "600" }}>{cari.alacak}₺</td>
                      <td style={{ padding: "1rem", fontWeight: "600", color: cari.bakiye >= 0 ? "#28a745" : "#dc3545" }}>{cari.bakiye}₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3>Bakiye Grafiği</h3>
            <div style={{ marginTop: 20, width: "100%", height: 300, border: "1px solid #ddd", padding: 20 }}>
              <svg width="100%" height="100%" viewBox="0 0 400 250">
                <line x1="50" y1="200" x2="350" y2="200" stroke="#ccc" strokeWidth="1" />
                <line x1="50" y1="200" x2="50" y2="50" stroke="#ccc" strokeWidth="1" />
                <text x="30" y="220" fontSize="12">Tarih</text>
                <text x="10" y="60" fontSize="12" transform="rotate(-90 10 60)">Bakiye</text>
                <polyline
                  fill="none"
                  stroke="#e67e22"
                  strokeWidth="2"
                  points="50,150 150,120 250,180 350,100"
                />
                <circle cx="50" cy="150" r="4" fill="#e67e22" />
                <circle cx="150" cy="120" r="4" fill="#e67e22" />
                <circle cx="250" cy="180" r="4" fill="#e67e22" />
                <circle cx="350" cy="100" r="4" fill="#e67e22" />
                <text x="40" y="170" fontSize="10">15.09</text>
                <text x="140" y="140" fontSize="10">16.09</text>
                <text x="240" y="200" fontSize="10">17.09</text>
                <text x="340" y="120" fontSize="10">18.09</text>
              </svg>
            </div>
          </div>
        )}
        {selected === "rapor" && (
          <div style={{ width: "100%" }}>
            <h2 style={{ color: "#0056b3", marginBottom: "2rem", fontSize: "2rem", fontWeight: "600" }}>📊 Raporlama</h2>
            <div style={{ marginBottom: 50, background: "#f8f9fa", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.07)" }}>
              <h3 style={{ color: "#6f42c1", marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "500" }}>📅 Tarih Aralığı Seçin</h3>
              <form onSubmit={handleRaporForm} style={{ display: "flex", gap: "1rem", alignItems: "end", marginBottom: "2rem", maxWidth: "500px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={raporForm.startDate}
                    onChange={(e) => setRaporForm({ ...raporForm, startDate: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#6f42c1"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={raporForm.endDate}
                    onChange={(e) => setRaporForm({ ...raporForm, endDate: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#6f42c1"}
                    onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "linear-gradient(135deg, #6f42c1, #e83e8c)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 4px rgba(111,66,193,0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(111,66,193,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(111,66,193,0.3)";
                  }}
                >
                  🔍 Filtrele
                </button>
              </form>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <thead style={{ background: "#6f42c1", color: "white" }}>
                  <tr>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Rapor Tipi</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #e1e5e9" }}>
                    <td style={{ padding: "1rem" }}>Toplam Satış</td>
                    <td style={{ padding: "1rem", fontWeight: "600", color: "#28a745" }}>₺35.000</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "1rem" }}>Toplam Cari</td>
                    <td style={{ padding: "1rem", fontWeight: "600", color: "#28a745" }}>₺7.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
