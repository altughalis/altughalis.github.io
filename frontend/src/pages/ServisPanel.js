import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ServisPanel({ user, token }) {
  const [kayitlar, setKayitlar] = useState([]);

  useEffect(() => {
    async function fetchKayitlar() {
      const res = await axios.get("http://localhost:5000/api/serviskayit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sadece kendi servis kayıtlarını filtrele
      setKayitlar(res.data.filter((k) => k.servis === user._id));
    }
    fetchKayitlar();
  }, [token, user]);

  return (
    <div>
      <h2>Yetkili Servis Paneli</h2>
      <h4>Kendi Servis Kayıtlarınız</h4>
      <ul>
        {kayitlar.map((k) => (
          <li key={k._id}>
            {k.musteriAdi} - {k.urun} - {k.ariza} - {k.tarih}
          </li>
        ))}
      </ul>
    </div>
  );
}
