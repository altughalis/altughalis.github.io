const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://altughalis_db_user:erthaJuiMkBIZQAO@cluster0.nniadky.mongodb.net/bayi_yonetim?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Bağlantı başarılı!"))
  .catch((err) => console.error("Bağlantı hatası:", err));
