import React from "react";
import "../App.css";

export default function ServisPanelFull() {
  return (
    <div className="service-layout">
      <aside className="sidebar">
        <h3>Servis Paneli</h3>
        <ul>
          <li>Servis Kayıtları</li>
          <li>Garanti İşlemleri</li>
          <li>Cari Hesap</li>
        </ul>
      </aside>
      <main className="main-content">
        <section id="servis-kayit">
          <h2>Servis Kayıtları</h2>
          <button className="btn btn-success mb-2">Yeni Kayıt Aç</button>
          <table className="table">
            <thead>
              <tr>
                <th>Müşteri</th>
                <th>Ürün</th>
                <th>Arıza</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </section>
        <section id="garanti">
          <h2>Garanti İşlemleri</h2>
          <button className="btn btn-primary mb-2">Garanti Sorgula</button>
          <table className="table">
            <thead>
              <tr>
                <th>Seri No</th>
                <th>Durum</th>
                <th>İşlem</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </section>
        <section id="cari">
          <h2>Cari Hesap</h2>
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
      </main>
    </div>
  );
}
