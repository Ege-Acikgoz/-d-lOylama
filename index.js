const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // .env dosyasını yükler

const app = express();

// Middleware'ler
app.use(cors());
app.use(bodyParser.json());

// MongoDB Bağlantısı
const dbURL = process.env.MONGODB_URI || 'mongodb+srv://sefaege:ZS81WflmN3Z8DLgW@odul.dvbrf.mongodb.net/?retryWrites=true&w=majority&appName=odul';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Oy Modeli Tanımı
const OySchema = new mongoose.Schema({
  adSoyad: { type: String, required: true },
  oylar: { type: [String], required: true }
});

const Oy = mongoose.model('Oy', OySchema);

// Oy Kullanma Endpoint'i
app.post('/oy-kullan', async (req, res) => {
  const { adSoyad, oylar } = req.body;
  try {
    // Kullanıcı adı kontrolü
    const mevcutOy = await Oy.findOne({ adSoyad });
    if (mevcutOy) {
      return res.status(400).json({ error: 'Bu kullanıcı zaten oy kullandı' });
    }
    
    const yeniOy = new Oy({ adSoyad, oylar });
    await yeniOy.save();
    res.json({ message: 'Oy başarıyla kaydedildi' });
  } catch (error) {
    console.error('Oy kaydedilirken hata:', error);
    res.status(500).json({ error: 'Bir hata oluştu', details: error.message });
  }
});

// Oyları Getirme Endpoint'i
app.get('/oylar', async (req, res) => {
  try {
    const oylar = await Oy.find();
    res.json(oylar);
  } catch (error) {
    console.error('Oylar getirilirken hata:', error);
    res.status(500).json({ error: 'Bir hata oluştu', details: error.message });
  }
});

// Statik Dosyaları Sunma (Opsiyonel)
app.use(express.static('public'));

// Ana Sayfa Rota Tanımı (Opsiyonel)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Sunucu Başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
