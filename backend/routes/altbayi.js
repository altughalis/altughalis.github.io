const express = require("express");
const router = express.Router();
const AltBayi = require("../models/AltBayi");
const ServisKayit = require("../models/ServisKayit");

// Alt bayi ekle
router.post("/", async (req, res) => {
  try {
    const altBayi = new AltBayi(req.body);
    await altBayi.save();
    res.status(201).json(altBayi);
  } catch (err) {
    res.status(400).json({ error: "Alt bayi eklenemedi" });
  }
});

// Alt bayileri listele (region ile filtrelenebilir)
router.get("/", async (req, res) => {
  try {
    const { region } = req.query;
    const altBayiler = await AltBayi.find(region ? { region } : {});
    res.json(altBayiler);
  } catch (err) {
    res.status(500).json({ error: "Alt bayiler getirilemedi" });
  }
});

// Tek alt bayi getir
router.get("/:id", async (req, res) => {
  try {
    const altBayi = await AltBayi.findById(req.params.id);
    if (!altBayi) {
      return res.status(404).json({ error: "Alt bayi bulunamadı" });
    }
    res.json(altBayi);
  } catch (err) {
    res.status(500).json({ error: "Alt bayi getirilemedi" });
  }
});

// Alt bayi güncelle
router.put("/:id", async (req, res) => {
  try {
    const altBayi = await AltBayi.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!altBayi) {
      return res.status(404).json({ error: "Alt bayi bulunamadı" });
    }
    res.json(altBayi);
  } catch (err) {
    res.status(400).json({ error: "Alt bayi güncellenemedi" });
  }
});

// Alt bayi performans verilerini getir
router.get("/:id/performance", async (req, res) => {
  try {
    const servisKayitlari = await ServisKayit.find({ altBayiId: req.params.id });

    const totalServis = servisKayitlari.length;
    const openServis = servisKayitlari.filter(s => s.status === "Açık").length;
    const completedServis = servisKayitlari.filter(s => s.status === "Tamamlandı").length;
    const pendingPayments = servisKayitlari.filter(s => s.paymentStatus === "Bekliyor").length;

    const recentTransactions = servisKayitlari
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(s => ({
        id: s._id,
        date: s.createdAt,
        description: s.description,
        amount: s.cost,
        status: s.status
      }));

    res.json({
      totalServis,
      openServis,
      completedServis,
      pendingPayments,
      recentTransactions
    });
  } catch (err) {
    res.status(500).json({ error: "Performans verileri getirilemedi" });
  }
});

// Alt bayi finans verilerini getir
router.get("/:id/finance", async (req, res) => {
  try {
    const altBayi = await AltBayi.findById(req.params.id);
    if (!altBayi) {
      return res.status(404).json({ error: "Alt bayi bulunamadı" });
    }

    // Demo data for now - in real implementation, this would come from payment/invoice models
    const recentPayments = [
      { id: "1", date: "2025-01-15", amount: 5000, description: "Servis ödemesi" },
      { id: "2", date: "2025-01-10", amount: 3000, description: "Malzeme ödemesi" }
    ];

    const pendingInvoices = [
      { id: "1", date: "2025-01-20", amount: 2500, description: "Bekleyen fatura" }
    ];

    res.json({
      balance: altBayi.balance,
      recentPayments,
      pendingInvoices
    });
  } catch (err) {
    res.status(500).json({ error: "Finans verileri getirilemedi" });
  }
});

// Alt bayi ödeme yap
router.put("/:id/payment", async (req, res) => {
  try {
    const { amount } = req.query;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Geçerli bir ödeme miktarı girin" });
    }

    const altBayi = await AltBayi.findById(req.params.id);
    if (!altBayi) {
      return res.status(404).json({ error: "Alt bayi bulunamadı" });
    }

    altBayi.balance = (altBayi.balance || 0) + parseFloat(amount);
    await altBayi.save();

    res.json({ message: "Ödeme yapıldı", balance: altBayi.balance });
  } catch (err) {
    res.status(500).json({ error: "Ödeme yapılamadı" });
  }
});

module.exports = router;
