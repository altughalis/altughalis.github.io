import React, { useEffect, useState } from "react";
import { getUsers /* getCari */ } from "../api";

export default function AdminPanel({ user, token }) {
  const [users, setUsers] = useState([]);
  // const [cari, setCari] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const userList = await getUsers(token);
      setUsers(userList);
      // const cariList = await getCari(token);
      // setCari(cariList);
    }
    fetchData();
  }, [token]);

  return (
    <div>
      <h2>Admin Paneli</h2>
      <h4>Kullanıcılar</h4>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} - {u.email} - {u.role}
          </li>
        ))}
      </ul>
      {/* Cari hesap ve diğer veriler burada listelenebilir */}
    </div>
  );
}
