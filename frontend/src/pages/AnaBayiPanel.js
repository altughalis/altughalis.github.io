import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AnaBayiPanel({ user, token }) {
  const [selected, setSelected] = useState("altbayiler");
  // Demo alt bayi verisi
  const [altBayiler, setAltBayiler] = useState([
    { _id: "1", name: "Bursa Alt Bayi", region: "Bursa" },
    { _id: "2", name: "İstanbul Alt Bayi", region: "İstanbul" },
    { _id: "3", name: "Kocaeli Alt Bayi", region: "Kocaeli" },
    { _id: "4", name: "Edirne Alt Bayi", region: "Edirne" },
  ]);
  const [editingAltBayi, setEditingAltBayi] = useState(null);
  const [newAltBayi, setNewAltBayi] = useState({ name: "", region: "" });
  const [servisler, setServisler] = useState([]);
  const [editingServis, setEditingServis] = useState(null);
  const [newServis, setNewServis] = useState({ name: "", region: "" });

  useEffect(() => {
    fetchAltBayiler();
    fetchServisler();
  }, []);

  const fetchAltBayiler = async () => {
    try {
      const response = await axios.get("/api/altbayi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAltBayiler(response.data);
    } catch (error) {
      console.error("Error fetching altbayiler:", error);
    }
  };

  const fetchServisler = async () => {
    try {
      const response = await axios.get("/api/servis", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServisler(response.data);
    } catch (error) {
      console.error("Error fetching servisler:", error);
    }
  };

  const handleAddAltBayi = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/altbayi", newAltBayi, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewAltBayi({ name: "", region: "" });
      fetchAltBayiler();
    } catch (error) {
      console.error("Error adding altbayi:", error);
    }
  };

  const handleEditAltBayi = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/altbayi/${editingAltBayi._id}`, editingAltBayi, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingAltBayi(null);
      fetchAltBayiler();
    } catch (error) {
      console.error("Error editing altbayi:", error);
    }
  };

  const handleDeleteAltBayi = async (id) => {
    try {
      await axios.delete(`/api/altbayi/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAltBayiler();
    } catch (error) {
      console.error("Error deleting altbayi:", error);
    }
  };

  const handleAddServis = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/servis", newServis, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewServis({ name: "", region: "" });
      fetchServisler();
    } catch (error) {
      console.error("Error adding servis:", error);
    }
  };

  const handleEditServis = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/servis/${editingServis._id}`, editingServis, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingServis(null);
      fetchServisler();
    } catch (error) {
      console.error("Error editing servis:", error);
    }
  };

  const handleDeleteServis = async (id) => {
    try {
      await axios.delete(`/api/servis/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServisler();
    } catch (error) {
      console.error("Error deleting servis:", error);
    }
  };

  const satisListesi = [
    {
      no: "S001",
      tarih: "01.10.2025",
      urun: "Buzdolabı",
      adet: 1,
      fiyat: "₺9.000",
      toplam: "₺9.000",
    },
    {
      no: "S002",
      tarih: "03.10.2025",
      urun: "Çamaşır",
      adet: 2,
      fiyat: "₺7.000",
      toplam: "₺14.000",
    },
    {
      no: "S003",
      tarih: "05.10.2025",
      urun: "TV",
      adet: 1,
      fiyat: "₺12.000",
      toplam: "₺12.000",
    },
  ];

  const siparisListesi = [
    {
      no: "SP001",
      tarih: "01.10.2025",
      urun: "Buzdolabı",
      adet: 1,
      musteri: "Ahmet",
      durum: "Tamamlandı",
    },
    {
      no: "SP002",
      tarih: "02.10.2025",
      urun: "Çamaşır",
      adet: 2,
      musteri: "Ayşe",
      durum: "Bekliyor",
    },
    {
      no: "SP003",
      tarih: "04.10.2025",
      urun: "TV",
      adet: 1,
      musteri: "Mehmet",
      durum: "Tamamlandı",
    },
  ];

  const cariIslemler = [
    {
      no: "C001",
      tarih: "01.10.2025",
      aciklama: "Satış Geliri",
      borc: "₺9.000",
      alacak: "-",
      bakiye: "₺9.000",
    },
    {
      no: "C002",
      tarih: "02.10.2025",
      aciklama: "Kira Ödemesi",
      borc: "-",
      alacak: "₺2.000",
      bakiye: "₺7.000",
    },
    {
      no: "C003",
      tarih: "03.10.2025",
      aciklama: "Cari Tahsilat",
      borc: "₺3.000",
      alacak: "-",
      bakiye: "₺10.000",
    },
    {
      no: "C004",
      tarih: "04.10.2025",
      aciklama: "Mal Alımı",
      borc: "-",
      alacak: "₺1.000",
      bakiye: "₺9.000",
    },
  ];

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
          Ana Bayi Paneli
        </h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "altbayiler" ? "#0056b3" : "transparent",
              color: selected === "altbayiler" ? "#fff" : "#333",
              fontWeight: selected === "altbayiler" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("altbayiler")}
          >
            Alt Bayiler
            <div
              style={{
                fontSize: 12,
                color: selected === "altbayiler" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              Bölgenize bağlı alt bayileri görüntüleyin ve ekleyin.
            </div>
          </li>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "servisler" ? "#0056b3" : "transparent",
              color: selected === "servisler" ? "#fff" : "#333",
              fontWeight: selected === "servisler" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("servisler")}
          >
            Yetkili Servisler
            <div
              style={{
                fontSize: 12,
                color: selected === "servisler" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              Bölgenizdeki yetkili servisleri yönetin.
            </div>
          </li>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: selected === "satis" ? "#0056b3" : "transparent",
              color: selected === "satis" ? "#fff" : "#333",
              fontWeight: selected === "satis" ? "700" : "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => setSelected("satis")}
          >
            Satış İşlemleri
            <div
              style={{
                fontSize: 12,
                color: selected === "satis" ? "#cbd5e1" : "#555",
                marginTop: 2,
                fontStyle: "italic",
              }}
            >
              Bölgenize ait satış hareketlerini inceleyin.
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
              Gelir, gider ve bakiye durumunu takip edin.
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
              Performans ve finansal raporları görüntüleyin.
            </div>
          </li>
          <li
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              borderBottom: "1px solid #cbd5e1",
              background: "transparent",
              color: "#333",
              fontWeight: "400",
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => (window.location.href = "/")}
          >
            Çıkış Yap
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
        {selected === "altbayiler" && (
          <div style={{ width: "100%" }}>
            <h2>Alt Bayiler</h2>
            <button
              className="btn btn-success mb-3"
              onClick={() => setEditingAltBayi(null)}
            >
              Yeni Alt Bayi Ekle
            </button>
            {/* Ekleme/Düzenleme Formu */}
            {(editingAltBayi !== null || newAltBayi) && (
              <form
                onSubmit={editingAltBayi ? handleEditAltBayi : handleAddAltBayi}
                style={{ marginBottom: 20 }}
              >
                <input
                  type="text"
                  placeholder="Ad"
                  value={editingAltBayi ? editingAltBayi.name : newAltBayi.name}
                  onChange={(e) =>
                    editingAltBayi
                      ? setEditingAltBayi({
                          ...editingAltBayi,
                          name: e.target.value,
                        })
                      : setNewAltBayi({ ...newAltBayi, name: e.target.value })
                  }
                  required
                  style={{ marginRight: 10 }}
                />
                <input
                  type="text"
                  placeholder="Bölge"
                  value={
                    editingAltBayi ? editingAltBayi.region : newAltBayi.region
                  }
                  onChange={(e) =>
                    editingAltBayi
                      ? setEditingAltBayi({
                          ...editingAltBayi,
                          region: e.target.value,
                        })
                      : setNewAltBayi({ ...newAltBayi, region: e.target.value })
                  }
                  required
                  style={{ marginRight: 10 }}
                />
                <button type="submit" className="btn btn-primary">
                  {editingAltBayi ? "Kaydet" : "Ekle"}
                </button>
                {editingAltBayi && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setEditingAltBayi(null)}
                  >
                    İptal
                  </button>
                )}
              </form>
            )}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Bölge</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {altBayiler.map((bayi) => (
                  <tr key={bayi._id}>
                    <td>{bayi.name}</td>
                    <td>{bayi.region}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => setEditingAltBayi(bayi)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteAltBayi(bayi._id)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selected === "servisler" && (
          <div style={{ width: "100%" }}>
            <h2>Yetkili Servisler</h2>
            <button
              className="btn btn-success mb-3"
              onClick={() => setEditingServis(null)}
            >
              Yeni Servis Ekle
            </button>
            {/* Ekleme/Düzenleme Formu */}
            {(editingServis !== null || newServis) && (
              <form
                onSubmit={editingServis ? handleEditServis : handleAddServis}
                style={{ marginBottom: 20 }}
              >
                <input
                  type="text"
                  placeholder="Ad"
                  value={editingServis ? editingServis.name : newServis.name}
                  onChange={(e) =>
                    editingServis
                      ? setEditingServis({
                          ...editingServis,
                          name: e.target.value,
                        })
                      : setNewServis({ ...newServis, name: e.target.value })
                  }
                  required
                  style={{ marginRight: 10 }}
                />
                <input
                  type="text"
                  placeholder="Bölge"
                  value={
                    editingServis ? editingServis.region : newServis.region
                  }
                  onChange={(e) =>
                    editingServis
                      ? setEditingServis({
                          ...editingServis,
                          region: e.target.value,
                        })
                      : setNewServis({ ...newServis, region: e.target.value })
                  }
                  required
                  style={{ marginRight: 10 }}
                />
                <button type="submit" className="btn btn-primary">
                  {editingServis ? "Kaydet" : "Ekle"}
                </button>
                {editingServis && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setEditingServis(null)}
                  >
                    İptal
                  </button>
                )}
              </form>
            )}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Bölge</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {servisler.map((servis) => (
                  <tr key={servis._id}>
                    <td>{servis.name}</td>
                    <td>{servis.region}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => setEditingServis(servis)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteServis(servis._id)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selected === "satis" && (
          <div style={{ width: "100%" }}>
            <h2>Satış İşlemleri</h2>
            <form style={{ marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Ürün"
                style={{ marginRight: 10 }}
                required
              />
              <input
                type="number"
                placeholder="Adet"
                style={{ marginRight: 10 }}
                required
              />
              <input
                type="text"
                placeholder="Fiyat"
                style={{ marginRight: 10 }}
                required
              />
              <button type="submit" className="btn btn-success">
                Satış Ekle
              </button>
            </form>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tarih</th>
                  <th>Ürün</th>
                  <th>Adet</th>
                  <th>Fiyat</th>
                  <th>Toplam</th>
                </tr>
              </thead>
              <tbody>
                {satisListesi.map((satis) => (
                  <tr key={satis.no}>
                    <td>{satis.no}</td>
                    <td>{satis.tarih}</td>
                    <td>{satis.urun}</td>
                    <td>{satis.adet}</td>
                    <td>{satis.fiyat}</td>
                    <td>{satis.toplam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selected === "cari" && (
          <div style={{ width: "100%" }}>
            <h2>Cari Hesaplar</h2>
            <form style={{ marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Açıklama"
                style={{ marginRight: 10 }}
                required
              />
              <input
                type="number"
                placeholder="Borc"
                style={{ marginRight: 10 }}
              />
              <input
                type="number"
                placeholder="Alacak"
                style={{ marginRight: 10 }}
              />
              <button type="submit" className="btn btn-success">
                Cari Ekle
              </button>
            </form>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tarih</th>
                  <th>Açıklama</th>
                  <th>Borc</th>
                  <th>Alacak</th>
                  <th>Bakiye</th>
                </tr>
              </thead>
              <tbody>
                {cariIslemler.map((cari) => (
                  <tr key={cari.no}>
                    <td>{cari.no}</td>
                    <td>{cari.tarih}</td>
                    <td>{cari.aciklama}</td>
                    <td>{cari.borc}</td>
                    <td>{cari.alacak}</td>
                    <td>{cari.bakiye}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selected === "rapor" && (
          <div style={{ width: "100%" }}>
            <h2>Raporlama</h2>
            <form style={{ marginBottom: 20 }}>
              <input type="date" style={{ marginRight: 10 }} />
              <input type="date" style={{ marginRight: 10 }} />
              <button type="submit" className="btn btn-primary">
                Filtrele
              </button>
            </form>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Rapor Tipi</th>
                  <th>Toplam</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Toplam Satış</td>
                  <td>₺35.000</td>
                </tr>
                <tr>
                  <td>Toplam Cari</td>
                  <td>₺9.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
