import React, { useState } from "react";

const menuItems = [
  { key: "dashboard", label: "Dashboard (Ana Sayfa)" },
  { key: "sales", label: "Satış" },
  { key: "new-sale", label: "Yeni Satış" },
  { key: "sales-list", label: "Satış Listesi" },
  { key: "orders", label: "Siparişler" },
  { key: "new-order", label: "Yeni Sipariş" },
  { key: "orders-list", label: "Sipariş Listesi" },
  { key: "accounts", label: "Cari Hesap" },
  { key: "accounts-summary", label: "Cari Özeti" },
  { key: "accounts-list", label: "Cari İşlemler" },
  { key: "profile", label: "Profilim" },
  { key: "logout", label: "Çıkış" },
];

export default function AltBayiPanelFull({ user }) {
  const [selected, setSelected] = useState("dashboard");

  // Demo veriler
  const dashboardCards = [
    { icon: "📦", label: "Toplam Satış", value: "150.000 ₺" },
    { icon: "📝", label: "Bekleyen Sipariş", value: "12 sipariş" },
    { icon: "💰", label: "Net Cari Bakiye", value: "+25.000 ₺" },
  ];
  const lastTransactions = [
    { date: "17.09.2025", type: "Satış", desc: "Buzdolabı", amount: "₺9.000" },
    {
      date: "16.09.2025",
      type: "Sipariş",
      desc: "Çamaşır Makinesi",
      amount: "₺7.000",
    },
    { date: "15.09.2025", type: "Gelir", desc: "Tahsilat", amount: "₺2.000" },
    { date: "14.09.2025", type: "Gider", desc: "Kira", amount: "-₺1.200" },
    { date: "13.09.2025", type: "Satış", desc: "TV", amount: "₺12.000" },
  ];

  // Menü tıklama logout ise yönlendir
  const handleMenuClick = (key) => {
    if (key === "logout") {
      window.location.href = "/login";
      return;
    }
    setSelected(key);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 230,
          background: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "2rem 1rem 1rem 1rem",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li
              key={item.key}
              onClick={() => handleMenuClick(item.key)}
              style={{
                padding: "0.75rem 1rem",
                marginBottom: "0.5rem",
                borderRadius: 8,
                cursor: "pointer",
                background: selected === item.key ? "#007bff" : "#fff",
                color: selected === item.key ? "#fff" : "#222",
                fontWeight: selected === item.key ? 600 : 400,
                fontSize: "1.08rem",
                transition: "background 0.2s",
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.2rem 2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{ fontSize: "1.25rem", fontWeight: 600, color: "#007bff" }}
          >
            {user?.name || "Alt Bayi - İstanbul Anadolu"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <span style={{ fontSize: "1.4rem", color: "#007bff" }}>🔔</span>
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#e3eafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
                color: "#007bff",
              }}
            >
              👤
            </span>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, padding: "2.5rem 2rem", background: "#f4f6fb" }}>
          {selected === "dashboard" && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  marginBottom: "2.5rem",
                  flexWrap: "wrap",
                }}
              >
                {dashboardCards.map((card) => (
                  <div
                    key={card.label}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 2px 8px rgba(0,123,255,0.08)",
                      flex: 1,
                      minWidth: 220,
                      maxWidth: 320,
                      padding: "1.5rem 1.2rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "2.2rem",
                        color: "#007bff",
                        background: "#e3eafc",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {card.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "1.05rem",
                          color: "#555",
                          marginBottom: 4,
                        }}
                      >
                        {card.label}
                      </div>
                      <div
                        style={{
                          fontSize: "1.35rem",
                          fontWeight: 600,
                          color: "#222",
                        }}
                      >
                        {card.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,123,255,0.08)",
                  width: "100%",
                  marginTop: 24,
                  overflowX: "auto",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: "0.7rem 1rem",
                          background: "#e3eafc",
                          color: "#007bff",
                          fontWeight: 600,
                        }}
                      >
                        Tarih
                      </th>
                      <th
                        style={{
                          padding: "0.7rem 1rem",
                          background: "#e3eafc",
                          color: "#007bff",
                          fontWeight: 600,
                        }}
                      >
                        İşlem Tipi
                      </th>
                      <th
                        style={{
                          padding: "0.7rem 1rem",
                          background: "#e3eafc",
                          color: "#007bff",
                          fontWeight: 600,
                        }}
                      >
                        Açıklama
                      </th>
                      <th
                        style={{
                          padding: "0.7rem 1rem",
                          background: "#e3eafc",
                          color: "#007bff",
                          fontWeight: 600,
                        }}
                      >
                        Tutar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastTransactions.map((tx, i) => (
                      <tr key={i}>
                        <td
                          style={{
                            padding: "0.7rem 1rem",
                            textAlign: "center",
                          }}
                        >
                          {tx.date}
                        </td>
                        <td
                          style={{
                            padding: "0.7rem 1rem",
                            textAlign: "center",
                          }}
                        >
                          {tx.type}
                        </td>
                        <td
                          style={{
                            padding: "0.7rem 1rem",
                            textAlign: "center",
                          }}
                        >
                          {tx.desc}
                        </td>
                        <td
                          style={{
                            padding: "0.7rem 1rem",
                            textAlign: "center",
                          }}
                        >
                          {tx.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {/* Diğer menü içerikleri burada dinamik olarak eklenecek */}
          {/* ...existing code... */}
        </div>
      </main>
    </div>
  );
}
