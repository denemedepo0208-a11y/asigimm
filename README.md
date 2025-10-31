# 🎬 ReelsTogether v2.0

Instagram Reels'i arkadaşlarınla senkronize şekilde izle! Gerçek zamanlı sohbet, oda yönetimi ve kullanıcı izinleri ile gelişmiş bir birlikte izleme deneyimi.

## 🌟 Özellikler

### 🏠 Oda Sistemi
- **Public Odalar**: Keşfet sayfasında görünür, kategori bazlı filtreleme
- **Private Odalar**: Sadece kod ile erişim
- **Katılım İsteği Sistemi**: Oda sahibinin onayı ile katılım
- **Maksimum Katılımcı Limiti**: 2-10 kişi arası ayarlanabilir

### 👑 Oda Sahibi Yetkileri
- Chat izni verme/kaldırma
- Scroll (video kontrolü) izni verme/kaldırma
- Katılımcı atma
- Oda ayarlarını yönetme

### 💬 Chat Sistemi
- Gerçek zamanlı mesajlaşma
- Zaman damgalı mesajlar
- Video zamanına göre mesaj kaydı
- Baloncuk tasarımlı overlay

### 🎥 Reels Senkronizasyonu
- Otomatik play/pause senkronizasyonu
- Video değiştirme (scroll) senkronizasyonu
- Ses seviyesi senkronizasyonu
- Smart Watch Mode (±0.3s tolerans)

### 🔍 Keşfet Sistemi
- Public odaları listele
- Kategori bazlı filtreleme (Eğlence, Aşk, Komedi, Müzik, Spor)
- Arama özelliği
- Aktif katılımcı sayısı gösterimi

## 📦 Kurulum

### 1. Supabase Veritabanı Kurulumu

1. [Supabase](https://supabase.com) hesabınıza giriş yapın
2. Yeni bir proje oluşturun
3. SQL Editor'e gidin
4. `reelstogether-server/schema.sql` dosyasındaki SQL kodunu çalıştırın

### 2. Sunucu Kurulumu

```bash
cd reelstogether-server
npm install
```

`.env` dosyası zaten yapılandırılmış durumda. Gerekirse Supabase bilgilerinizi güncelleyin.

Sunucuyu başlatmak için:
```bash
npm start
```

Geliştirme modu için:
```bash
npm run dev
```

### 3. Chrome Eklentisi Kurulumu

1. Chrome'da `chrome://extensions/` adresine gidin
2. "Geliştirici modu"nu aktif edin
3. "Paketlenmemiş öğe yükle" butonuna tıklayın
4. `reelstogether-extension` klasörünü seçin

## 🚀 Kullanım

### Oda Oluşturma

1. Eklenti ikonuna tıklayın
2. "Oda Oluştur" sekmesine gidin
3. Oda adı, tip (Public/Private), kategori ve maksimum katılımcı sayısını seçin
4. "Oda Oluştur" butonuna tıklayın
5. Oda kodu ile arkadaşlarınızı davet edin

### Odaya Katılma

**Kod ile:**
1. "Koda Katıl" sekmesine gidin
2. 6 haneli oda kodunu girin
3. "Odaya Katıl" butonuna tıklayın

**Keşfet ile:**
1. "Keşfet" sekmesinde public odaları görün
2. İstediğiniz odanın "Katıl" butonuna tıklayın
3. Oda sahibinin onayını bekleyin

### Reels İzleme

1. Instagram'da Reels sayfasına gidin
2. Odaya katıldıktan sonra sağ tarafta chat overlay görünecek
3. Video kontrolü izniniz varsa, video değiştirme ve oynatma kontrolü yapabilirsiniz
4. Chat izniniz varsa mesaj gönderebilirsiniz

### Oda Yönetimi (Sadece Oda Sahibi)

1. "Koda Katıl" sekmesinde "Oda Ayarları" butonuna tıklayın
2. Katılımcıların izinlerini yönetin:
   - 💬 Chat izni
   - 📜 Scroll izni
3. İstenmeyen katılımcıları çıkarın

## 🏗️ Proje Yapısı

```
reelstogether-extension/
├── manifest.json           # Chrome eklentisi yapılandırması
├── popup.html             # Ana UI
├── popup.js               # UI mantığı
├── content.js             # Instagram sayfası entegrasyonu
├── background.js          # Socket.io bağlantı yönetimi
└── styles/
    ├── popup.css          # Popup stilleri
    └── content.css        # Overlay stilleri

reelstogether-server/
├── src/
│   ├── index.js           # Ana sunucu dosyası
│   ├── roomManager.js     # Oda yönetimi
│   └── socketHandlers.js  # Socket.io event handlers
├── config/
│   └── supabase.js        # Supabase yapılandırması
├── schema.sql             # Veritabanı şeması
├── package.json
└── .env                   # Ortam değişkenleri
```

## 🔧 Teknolojiler

### Chrome Eklentisi
- Manifest V3
- Vanilla JavaScript
- Socket.io Client
- Chrome Extension APIs

### Backend
- Node.js
- Express.js
- Socket.io
- Supabase (PostgreSQL)

## 📊 Veritabanı Şeması

### Tables
- **users**: Kullanıcı bilgileri
- **rooms**: Oda bilgileri
- **room_participants**: Oda katılımcıları ve izinleri
- **messages**: Chat mesajları
- **join_requests**: Katılım istekleri

## 🔐 Güvenlik

- Row Level Security (RLS) aktif
- Socket.io bağlantı doğrulaması
- Oda sahibi yetki kontrolü
- Maksimum katılımcı limiti
- Otomatik oda temizleme (2 saat)

## 🎨 UI/UX Özellikleri

- Modern, sade tasarım
- Gradient renkler (mor-mavi tonları)
- Hover animasyonları
- Responsive layout
- Smooth transitions
- Chat baloncukları
- Senkronizasyon göstergeleri

## 🐛 Bilinen Sorunlar ve Çözümler

### Eklenti yüklenmiyor
- Chrome'da Geliştirici modunun aktif olduğundan emin olun
- Eklenti klasörünün doğru seçildiğini kontrol edin

### Sunucuya bağlanılamıyor
- Sunucunun çalıştığından emin olun (`npm start`)
- `background.js` dosyasında SERVER_URL'in doğru olduğunu kontrol edin

### Senkronizasyon çalışmıyor
- Instagram Reels sayfasında olduğunuzdan emin olun
- Scroll izninin aktif olduğunu kontrol edin
- Sayfayı yenileyin ve tekrar deneyin

## 🚧 Gelecek Özellikler (v3.0)

- [ ] AI Watch Assistant (içerik analizi ve öneri)
- [ ] Kullanıcı profilleri ve avatarlar
- [ ] Oda geçmişi
- [ ] Favori odalar
- [ ] Emoji reaksiyonları
- [ ] Sesli sohbet
- [ ] Ekran paylaşımı
- [ ] Mobil uygulama

## 📝 Lisans

MIT License

## 👥 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce bir issue açın.

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**Not**: Bu proje eğitim amaçlıdır. Instagram'ın kullanım şartlarına uygun şekilde kullanın.
