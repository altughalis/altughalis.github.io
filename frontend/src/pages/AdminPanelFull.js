import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import axios from "axios";
import "../App.css";

// Cari hesap grafik bileşeni
const CariChart = ({ accounts }) => {
  if (!Array.isArray(accounts) || accounts.length === 0) {
    return <div>Grafik verisi yok</div>;
  }

  const data = {
    labels: accounts.map((_, i) => `Dönem ${i + 1}`),
    datasets: [
      {
        label: "Gelir",
        data: accounts.map(a => a.gelir || 0),
        backgroundColor: "#4caf50",
      },
      {
        label: "Gider",
        data: accounts.map(a => a.gider || 0),
        backgroundColor: "#f44336",
      },
      {
        label: "Bakiye",
        data: accounts.map(a => a.bakiye || 0),
        backgroundColor: "#2196f3",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  };

  return <div>Chart</div>;
};

// Placeholder API fonksiyonları
const fetchDealers = async () => [];
const fetchSubDealers = async () => [];
const fetchServices = async () => [];
const fetchAccounts = async () => [];
const fetchReports = async () => [];
const fetchUsers = async () => [];
const addUser = async (user) => {
  // Backend API'ye yeni kullanıcı ekle
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      user
    );
    return res.data;
  } catch (err) {
    alert("Kullanıcı eklenemedi! " + (err.response?.data?.message || ""));
    return null;
  }
};

const updateUser = async (userId, updatedUser, token) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/users/${userId}`,
      updatedUser,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    alert("Kullanıcı güncellenemedi! " + (err.response?.data?.message || ""));
    return null;
  }
};

const deleteUser = async (userId, token) => {
  try {
    await axios.delete(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    alert("Kullanıcı silinemedi! " + (err.response?.data?.message || ""));
    return false;
  }
};

const menuItems = [
  { key: "dealers", label: "Ana Bayiler", icon: "🏢" },
  { key: "subdealers", label: "Alt Bayiler", icon: "🏬" },
  { key: "services", label: "Yetkili Servisler", icon: "🛠️" },
  { key: "accounts", label: "Cari Hesap Akışı", icon: "💳" },
  { key: "reports", label: "Raporlama", icon: "📊" },
  { key: "users", label: "Kullanıcı Yönetimi", icon: "👤" },
  { key: "logout", label: "Çıkış", icon: "🚪" },
];

export default function AdminPanelFull({ user, token }) {
  // Mobil sidebar aç/kapa
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState("dealers");
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Kullanıcılar alınamadı:", error);
      }
    };
    if (token) fetchUsers();
  }, [token]);
  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    role: "Admin",
    email: "",
    password: "",
  });
  const [loggedOut, setLoggedOut] = useState(false);

  // Panelde kullanılan veri tabloları için state tanımları
  const [dealers, setDealers] = useState([
    { name: "Bayi A", region: "İstanbul" },
    { name: "Bayi B", region: "Ankara" },
  ]);
  const [subdealers, setSubDealers] = useState([
    { name: "Alt Bayi 1", region: "İstanbul" },
    { name: "Alt Bayi 2", region: "Ankara" },
  ]);
  const [services, setServices] = useState([
    { name: "Servis 1", parent: "Bayi A" },
    { name: "Servis 2", parent: "Bayi B" },
  ]);
  const [accounts, setAccounts] = useState([
    { gelir: 10000, gider: 5000, bakiye: 5000 },
    { gelir: 8000, gider: 3000, bakiye: 5000 },
  ]);
  const [reports, setReports] = useState([
    { type: "Satış", tutar: 12000, tarih: "2024-06-01" },
    { type: "Servis", tutar: 4000, tarih: "2024-06-02" },
  ]);

  if (loggedOut) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <h2>Çıkış yapıldı.</h2>
        <p>Güvenli çıkış yaptınız.</p>
        <a href="/" className="btn btn-primary">
          Girişe Dön
        </a>
      </div>
    );
  }

  return (
    <div className="admin-layout" style={{ position: "relative" }}>
      {/* Mobilde hamburger butonu */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((v) => !v)}
      >
        ☰
      </button>
      {/* Sağ üstte Hoşgeldiniz ve Çıkış */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 32,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          background: "#fff",
          padding: "0.7rem 1.5rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            fontSize: "1.1rem",
            color: "#2a3a5e",
          }}
        >
          Hoşgeldiniz, {user?.name || "Admin"}
        </span>
        <button className="btn btn-danger" onClick={() => setLoggedOut(true)}>
          Çıkış Yap
        </button>
      </div>
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <h3>Admin Paneli</h3>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={selected === item.key ? "active" : ""}
              onClick={() =>
                item.key === "logout"
                  ? setLoggedOut(true)
                  : setSelected(item.key)
              }
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <span>{item.icon}</span> {item.label}
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            marginTop: "3.5rem",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              flex: "1 1 700px",
              minWidth: "500px",
              maxWidth: "900px",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
              padding: "3rem 2.5rem",
              marginBottom: "2rem",
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {selected === "dealers" && (
              <>
                <h2
                  className="panel-title"
                  style={{
                    color: "#007bff",
                    fontWeight: "700",
                    fontSize: "2rem",
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  Ana Bayiler
                </h2>
                <table
                  className="table"
                  style={{
                    width: "80%",
                    margin: "0 auto",
                    fontSize: "1.15rem",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th>Ad</th>
                      <th>Bölge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealers.map((d, i) => (
                      <tr key={i} style={{ textAlign: "center" }}>
                        <td>{d.name}</td>
                        <td>{d.region}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {selected === "subdealers" && (
              <>
                <h2
                  className="panel-title"
                  style={{
                    color: "#007bff",
                    fontWeight: "700",
                    fontSize: "2rem",
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  Alt Bayiler
                </h2>
                <table
                  className="table"
                  style={{
                    width: "80%",
                    margin: "0 auto",
                    fontSize: "1.15rem",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th>Ad</th>
                      <th>Üst Bayi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subdealers.map((d, i) => (
                      <tr key={i} style={{ textAlign: "center" }}>
                        <td>{d.name}</td>
                        <td>{d.parent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {selected === "services" && (
              <>
                <h2
                  className="panel-title"
                  style={{
                    color: "#007bff",
                    fontWeight: "700",
                    fontSize: "2rem",
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  Yetkili Servisler
                </h2>
                <table
                  className="table"
                  style={{
                    width: "80%",
                    margin: "0 auto",
                    fontSize: "1.15rem",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th>Ad</th>
                      <th>Üst Bayi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s, i) => (
                      <tr key={i} style={{ textAlign: "center" }}>
                        <td>{s.name}</td>
                        <td>{s.parent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {selected === "accounts" && (
              <>
                <h2
                  className="panel-title"
                  style={{
                    color: "#007bff",
                    fontWeight: "700",
                    fontSize: "2rem",
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  Cari Hesap Akışı
                </h2>
                <table
                  className="table"
                  style={{
                    width: "80%",
                    margin: "0 auto",
                    fontSize: "1.15rem",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th>Gelir</th>
                      <th>Gider</th>
                      <th>Bakiye</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((a, i) => (
                      <tr key={i} style={{ textAlign: "center" }}>
                        <td>{a.gelir}</td>
                        <td>{a.gider}</td>
                        <td>{a.bakiye}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    margin: "2rem 0",
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "1rem"
                  }}
                >
                  <h4 style={{ textAlign: "center" }}>Cari Hesap Grafik</h4>
                  {/* Chart.js ile grafik */}
                  <CariChart accounts={accounts} />
                </div>
              </>
            )}
            {selected === "reports" && (
              <>
                <h2
                  className="panel-title"
                  style={{
                    color: "#007bff",
                    fontWeight: "700",
                    fontSize: "2rem",
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  Raporlama
                </h2>
                <table
                  className="table"
                  style={{
                    width: "80%",
                    margin: "0 auto",
                    fontSize: "1.15rem",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th>Tür</th>
                      <th>Tutar</th>
                      <th>Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => (
                      <tr key={i} style={{ textAlign: "center" }}>
                        <td>{r.type}</td>
                        <td>{r.tutar}</td>
                        <td>{r.tarih}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    margin: "2rem 0",
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    textAlign: "center",
                  }}
                >
                  <button className="btn btn-success">Excel İndir</button>
                  <button
                    className="btn btn-primary"
                    style={{ marginLeft: "1rem" }}
                  >
                    PDF İndir
                  </button>
                </div>
              </>
            )}
            {selected === "users" && (
              <>
                <h2
                  className="panel-title"
                  style={{
                    color: "#007bff",
                    fontWeight: "700",
                    fontSize: "2rem",
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  Kullanıcı Yönetimi
                </h2>
                <button
                  className="btn btn-primary mb-2"
                  onClick={() => {
                    setShowAddUser(true);
                    setEditingUser(null);
                  }}
                  style={{ marginBottom: "1.5rem" }}
                >
                  Yeni Kullanıcı Ekle
                </button>
                <table
                  className="table"
                  style={{
                    width: "80%",
                    margin: "0 auto",
                    fontSize: "1.15rem",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th>Kullanıcı Adı</th>
                      <th>Ad</th>
                      <th>Rol</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i} style={{ textAlign: "center" }}>
                        <td>{u.username || "-"}</td>
                        <td>{u.name || "-"}</td>
                        <td>{u.role}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => {
                              setShowAddUser(true);
                              setEditingUser(u);
                              setNewUser({ ...u, password: "" });
                            }}
                          >
                            Düzenle
                          </button>{" "}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={async () => {
                              if (
                                window.confirm(
                                  "Kullanıcıyı silmek istediğinize emin misiniz?"
                                )
                              ) {
                                const success = await deleteUser(u._id, token);
                                if (success)
                                  setUsers(
                                    users.filter((user) => user._id !== u._id)
                                  );
                              }
                            }}
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {showAddUser && (
                  <div
                    style={{
                      marginTop: "2rem",
                      background: "#f8f9fa",
                      padding: "1.5rem",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      width: "80%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h4 style={{ textAlign: "center" }}>
                      {editingUser
                        ? "Kullanıcıyı Düzenle"
                        : "Yeni Kullanıcı Ekle"}
                    </h4>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (editingUser) {
                          // Güncelle
                          const updated = { ...newUser };
                          if (!updated.password) delete updated.password;
                          const result = await updateUser(
                            editingUser._id,
                            updated,
                            token
                          );
                          if (result) {
                            setUsers(
                              users.map((user) =>
                                user._id === editingUser._id ? result : user
                              )
                            );
                            setShowAddUser(false);
                            setEditingUser(null);
                            setNewUser({
                              username: "",
                              name: "",
                              role: "admin",
                              email: "",
                              password: "",
                            });
                            alert("Kullanıcı güncellendi!");
                          }
                        } else {
                          // Ekle
                          const userToAdd = {
                            username: newUser.username,
                            password: newUser.password,
                            role: newUser.role,
                            name: newUser.name,
                            email: newUser.email,
                          };
                          const result = await addUser(userToAdd);
                          if (result) {
                            setUsers([...users, result]);
                            setShowAddUser(false);
                            setNewUser({
                              username: "",
                              name: "",
                              role: "admin",
                              email: "",
                              password: "",
                            });
                            alert("Kullanıcı başarıyla eklendi!");
                          }
                        }
                      }}
                    >
                      <div className="mb-3">
                        <label>Kullanıcı Adı (username)</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={newUser.username || ""}
                          onChange={(e) =>
                            setNewUser({ ...newUser, username: e.target.value })
                          }
                          disabled={!!editingUser}
                        />
                      </div>
                      <div className="mb-3">
                        <label>Ad</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newUser.name || ""}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label>Rol</label>
                        <select
                          className="form-control"
                          required
                          value={newUser.role}
                          onChange={(e) =>
                            setNewUser({ ...newUser, role: e.target.value })
                          }
                        >
                          <option value="admin">Admin</option>
                          <option value="anabayi">Ana Bayi</option>
                          <option value="altbayi">Alt Bayi</option>
                          <option value="servis">Servis</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label>E-posta</label>
                        <input
                          type="email"
                          className="form-control"
                          value={newUser.email || ""}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label>Şifre</label>
                        <input
                          type="password"
                          className="form-control"
                          value={newUser.password || ""}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                          placeholder={
                            editingUser
                              ? "Değiştirmek için yeni şifre girin"
                              : "Şifre"
                          }
                        />
                      </div>
                      <button className="btn btn-success" type="submit">
                        {editingUser ? "Güncelle" : "Kaydet"}
                      </button>
                      <button
                        className="btn btn-secondary"
                        type="button"
                        style={{ marginLeft: "1rem" }}
                        onClick={() => {
                          setShowAddUser(false);
                          setEditingUser(null);
                          setNewUser({
                            username: "",
                            name: "",
                            role: "admin",
                            email: "",
                            password: "",
                          });
                        }}
                      >
                        İptal
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
