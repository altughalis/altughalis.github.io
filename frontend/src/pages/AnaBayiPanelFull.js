import React from "react";
import "../App.css";

export default function AnaBayiPanelFull() {
  return (
    <div className="dealer-layout">
      <aside className="sidebar">
        <h3>Ana Bayi Paneli</h3>
        <ul>
          <li>Alt Bayiler</li>
          <li>Yetkili Servisler</li>
          <li>Satış İşlemleri</li>
          <li>Cari Hesaplar</li>
          <li>Raporlama</li>
        </ul>
      </aside>
      <main className="main-content">
        <section id="altbayi">
          <h2>Alt Bayiler</h2>
          <button className="btn btn-primary mb-2">Alt Bayi Ekle</button>
          <table className="table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Bölge</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </section>
        <section id="servis">
          <h2>Yetkili Servisler</h2>
          <button className="btn btn-primary mb-2">Servis Ekle</button>
          <table className="table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </section>
        <section id="sales">
          <h2>Satış İşlemleri</h2>
          <button className="btn btn-success mb-2">Yeni Satış</button>
          <table className="table">
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Adet</th>
                <th>Fiyat</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </section>
        <section id="cari">
          <h2>Cari Hesaplar</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Gelir</th>
                <th>Gider</th>
                <th>Bakiye</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </section>
        <section id="report">
          <h2>Raporlama</h2>
          <canvas id="dealerReportChart"></canvas>
        </section>
      </main>
    </div>
  );
}
