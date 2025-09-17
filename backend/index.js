const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB bağlantısı başarılı");
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
  });

app.get("/", (req, res) => {
  res.send("Service Backend Çalışıyor!");
});

const userRoutes = require("./routes/user");
const cariRoutes = require("./routes/cari");
const servisKayitRoutes = require("./routes/serviskayit");
const garantiRoutes = require("./routes/garanti");
const satisRoutes = require("./routes/satis");
const siparisRoutes = require("./routes/siparis");
const authRoutes = require("./routes/auth");
const altBayiRoutes = require("./routes/altbayi");
const servisRoutes = require("./routes/servis");

app.use("/api/users", userRoutes);
app.use("/api/cari", cariRoutes);
app.use("/api/serviskayit", servisKayitRoutes);
app.use("/api/garanti", garantiRoutes);
app.use("/api/satis", satisRoutes);
app.use("/api/siparis", siparisRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/altbayi", altBayiRoutes);
app.use("/api/servis", servisRoutes);

app.listen(5000, () => {
  console.log("Backend 5000 portunda çalışıyor");
});
