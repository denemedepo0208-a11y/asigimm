# 🚀 ReelsTogether v2.0 - Kurulum Rehberi

Bu rehber, ReelsTogether projesini sıfırdan kurmak için adım adım talimatlar içerir.

## 📋 Gereksinimler

- Node.js (v16 veya üzeri)
- npm veya yarn
- Google Chrome tarayıcı
- Supabase hesabı (ücretsiz)

## 1️⃣ Supabase Kurulumu

### Adım 1: Proje Oluşturma

1. [Supabase](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub ile giriş yapın (veya email ile kayıt olun)
4. "New Project" butonuna tıklayın
5. Proje bilgilerini doldurun:
   - Name: `reelstogether`
   - Database Password: Güçlü bir şifre oluşturun
   - Region: Size en yakın bölgeyi seçin
6. "Create new project" butonuna tıklayın

### Adım 2: Veritabanı Şemasını Oluşturma

1. Sol menüden "SQL Editor" seçeneğine tıklayın
2. "New query" butonuna tıklayın
3. `reelstogether-server/schema.sql` dosyasının içeriğini kopyalayın
4. SQL Editor'e yapıştırın
5. "Run" butonuna tıklayın
6. Başarılı mesajını görmelisiniz

### Adım 3: API Anahtarlarını Alma

1. Sol menüden "Settings" > "API" seçeneğine gidin
2. Aşağıdaki bilgileri kopyalayın:
   - Project URL (örn: `https://xxxxx.supabase.co`)
   - `anon` `public` key

### Adım 4: .env Dosyasını Güncelleme

`reelstogether-server/.env` dosyasını açın ve bilgilerinizi güncelleyin:

```env
PORT=3000
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
```

## 2️⃣ Sunucu Kurulumu

### Adım 1: Bağımlılıkları Yükleme

```bash
cd reelstogether-server
npm install
```

### Adım 2: Sunucuyu Başlatma

Geliştirme modu (otomatik yeniden başlatma):
```bash
npm run dev
```

Veya normal mod:
```bash
npm start
```

Başarılı olursa şu çıktıyı görmelisiniz:
```
╔═══════════════════════════════════════╗
║   🎬 ReelsTogether Server v2.0       ║
║   Server running on port 3000        ║
║   Socket.io ready for connections     ║
╚═══════════════════════════════════════╝
```

### Adım 3: Sunucu Testı

Tarayıcınızda şu adresi açın:
```
http://localhost:3000/health
```

Şu yanıtı görmelisiniz:
```json
{
  "status": "ok",
  "message": "ReelsTogether Server is running"
}
```

## 3️⃣ Chrome Eklentisi Kurulumu

### Adım 1: İkon Dosyalarını Ekleme

`reelstogether-extension/assets/` klasörüne aşağıdaki dosyaları ekleyin:
- `icon16.png` (16x16 piksel)
- `icon48.png` (48x48 piksel)
- `icon128.png` (128x128 piksel)

**Hızlı Çözüm**: Geçici olarak herhangi bir PNG dosyasını bu isimlerle kopyalayabilirsiniz.

### Adım 2: Eklentiyi Chrome'a Yükleme

1. Chrome tarayıcısını açın
2. Adres çubuğuna `chrome://extensions/` yazın ve Enter'a basın
3. Sağ üst köşede "Geliştirici modu" (Developer mode) anahtarını açın
4. "Paketlenmemiş öğe yükle" (Load unpacked) butonuna tıklayın
5. `reelstogether-extension` klasörünü seçin
6. "Klasör Seç" butonuna tıklayın

### Adım 3: Eklenti Kontrolü

1. Chrome araç çubuğunda ReelsTogether ikonunu görmelisiniz
2. İkona tıklayın
3. Popup penceresi açılmalı
4. Alt kısımda "🟢 Bağlı" yazısını görmelisiniz

## 4️⃣ Test Etme

### Test 1: Oda Oluşturma

1. Eklenti popup'ını açın
2. "Oda Oluştur" sekmesine gidin
3. Oda bilgilerini doldurun:
   - Oda Adı: "Test Odası"
   - Oda Tipi: Public
   - Kategori: Eğlence
   - Maksimum Kişi: 5
4. "Oda Oluştur" butonuna tıklayın
5. Oda kodunu not edin (örn: 123456)

### Test 2: Odaya Katılma

1. Yeni bir Chrome penceresi açın (veya Incognito mode)
2. Eklenti popup'ını açın
3. "Koda Katıl" sekmesine gidin
4. Oda kodunu girin
5. "Odaya Katıl" butonuna tıklayın

### Test 3: Reels Senkronizasyonu

1. Her iki pencerede de Instagram'a gidin: `https://www.instagram.com/reels`
2. Herhangi bir Reels videosunu açın
3. Sağ tarafta chat overlay'i görmelisiniz
4. Bir pencerede videoyu oynatın/durdurun
5. Diğer pencerede de aynı işlemin gerçekleştiğini görün

### Test 4: Chat

1. Chat overlay'deki input alanına bir mesaj yazın
2. Enter'a basın veya gönder butonuna tıklayın
3. Mesajın her iki pencerede de göründüğünü kontrol edin

## 🔧 Sorun Giderme

### Sunucu başlamıyor

**Hata**: `Error: connect ECONNREFUSED`
**Çözüm**: 
- Supabase URL ve API key'in doğru olduğunu kontrol edin
- İnternet bağlantınızı kontrol edin

**Hata**: `Port 3000 is already in use`
**Çözüm**:
- `.env` dosyasında PORT değerini değiştirin (örn: 3001)
- Veya 3000 portunu kullanan uygulamayı kapatın

### Eklenti yüklenmiyor

**Hata**: "Manifest file is missing or unreadable"
**Çözüm**:
- Doğru klasörü seçtiğinizden emin olun
- `manifest.json` dosyasının `reelstogether-extension` klasöründe olduğunu kontrol edin

**Hata**: "Icon file is missing"
**Çözüm**:
- `assets` klasörüne icon dosyalarını ekleyin
- Veya `manifest.json` dosyasından icon referanslarını geçici olarak kaldırın

### Bağlantı kurulamıyor

**Sorun**: Popup'ta "🔴 Bağlantı yok" görünüyor
**Çözüm**:
1. Sunucunun çalıştığından emin olun
2. `background.js` dosyasında `SERVER_URL` değerini kontrol edin
3. CORS hatası varsa, sunucu loglarını kontrol edin
4. Eklentiyi yeniden yükleyin (chrome://extensions/ > Yenile butonu)

### Senkronizasyon çalışmıyor

**Sorun**: Videolar senkronize olmuyor
**Çözüm**:
1. Instagram Reels sayfasında olduğunuzdan emin olun
2. Sayfayı yenileyin (F5)
3. Console'u açın (F12) ve hata mesajlarını kontrol edin
4. Scroll izninin aktif olduğunu kontrol edin

## 📊 Veritabanı Kontrolü

Supabase Dashboard'da verileri kontrol etmek için:

1. Supabase Dashboard'a gidin
2. "Table Editor" sekmesine tıklayın
3. Tabloları görüntüleyin:
   - `rooms`: Oluşturulan odalar
   - `room_participants`: Katılımcılar
   - `messages`: Chat mesajları

## 🎯 Sonraki Adımlar

Kurulum tamamlandıktan sonra:

1. ✅ Farklı oda tiplerini test edin (Public/Private)
2. ✅ Katılım isteklerini test edin
3. ✅ Oda sahibi yetkilerini test edin
4. ✅ Chat ve senkronizasyon özelliklerini test edin
5. ✅ Keşfet sayfasını test edin

## 🚀 Production'a Alma

Production ortamı için:

1. **Sunucu**:
   - Heroku, Railway, veya DigitalOcean'da deploy edin
   - HTTPS kullanın
   - Environment variables'ı güvenli şekilde saklayın

2. **Eklenti**:
   - `background.js` dosyasında SERVER_URL'i production URL ile değiştirin
   - Chrome Web Store'da yayınlayın

3. **Güvenlik**:
   - Supabase RLS politikalarını güçlendirin
   - Rate limiting ekleyin
   - Input validation yapın

## 📚 Ek Kaynaklar

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Documentation](https://expressjs.com/)

## 💡 İpuçları

1. **Geliştirme sırasında**: `npm run dev` kullanın (otomatik yeniden başlatma)
2. **Debug için**: Chrome DevTools Console'u kullanın (F12)
3. **Network sorunları için**: Chrome DevTools Network sekmesini kontrol edin
4. **Socket.io sorunları için**: Sunucu loglarını kontrol edin

---

Başarılar! 🎉

Sorun yaşarsanız, projenin GitHub sayfasında issue açabilirsiniz.
