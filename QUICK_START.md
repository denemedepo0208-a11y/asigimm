# ⚡ ReelsTogether v2.0 - Hızlı Başlangıç

## 🎯 5 Dakikada Başla

### 1. Supabase Kurulumu (2 dakika)

```bash
# 1. https://supabase.com adresine git
# 2. Yeni proje oluştur
# 3. SQL Editor'de schema.sql dosyasını çalıştır
# 4. API anahtarlarını kopyala
```

### 2. Sunucu Başlatma (1 dakika)

```bash
cd reelstogether-server
npm install
npm start
```

### 3. Extension Yükleme (1 dakika)

```bash
# 1. Chrome'da chrome://extensions/ aç
# 2. Geliştirici modu aktif et
# 3. "Paketlenmemiş öğe yükle" → reelstogether-extension klasörünü seç
```

### 4. Test Et (1 dakika)

```bash
# 1. Extension ikonuna tıkla
# 2. Oda oluştur
# 3. Instagram Reels'e git
# 4. Chat overlay'i gör
```

## 🚀 Komutlar

### Sunucu
```bash
# Geliştirme modu (otomatik yeniden başlatma)
npm run dev

# Production modu
npm start

# Bağımlılıkları yükle
npm install
```

### Extension
```bash
# Yeniden yükle
chrome://extensions/ → Yenile butonu

# Console'u aç (debug için)
F12 → Console
```

## 📋 Kontrol Listesi

- [ ] Node.js yüklü (v16+)
- [ ] Supabase hesabı oluşturuldu
- [ ] Veritabanı şeması çalıştırıldı
- [ ] .env dosyası yapılandırıldı
- [ ] npm install çalıştırıldı
- [ ] Sunucu başlatıldı (port 3000)
- [ ] Extension yüklendi
- [ ] İkon dosyaları eklendi (opsiyonel)

## 🔗 Önemli Linkler

- Sunucu: http://localhost:3000
- Health Check: http://localhost:3000/health
- Status: http://localhost:3000/api/status
- Extensions: chrome://extensions/

## 🐛 Hızlı Sorun Giderme

### Sunucu başlamıyor
```bash
# Port kontrolü
lsof -i :3000

# .env dosyasını kontrol et
cat .env
```

### Extension çalışmıyor
```bash
# Console'da hata var mı?
F12 → Console

# Background script logları
chrome://extensions/ → Service Worker → Console
```

### Bağlantı yok
```bash
# Sunucu çalışıyor mu?
curl http://localhost:3000/health

# Socket.io bağlantısı
# Network sekmesinde ws:// bağlantısını kontrol et
```

## 📚 Daha Fazla Bilgi

- Detaylı kurulum: `SETUP_GUIDE.md`
- Özellikler: `FEATURES.md`
- API: `API_DOCUMENTATION.md`
- Yapı: `PROJECT_STRUCTURE.md`

## 💡 İpuçları

1. **Geliştirme**: `npm run dev` kullan (nodemon ile otomatik yeniden başlatma)
2. **Debug**: Chrome DevTools Console'u kullan (F12)
3. **Test**: İki farklı Chrome penceresi aç (veya Incognito)
4. **Loglar**: Sunucu terminal'inde tüm eventleri görebilirsin

## 🎉 İlk Odanı Oluştur

1. Extension popup'ını aç
2. "Oda Oluştur" sekmesine git
3. Bilgileri doldur:
   - Oda Adı: "İlk Odam"
   - Tip: Public
   - Kategori: Eğlence
   - Kişi: 5
4. "Oda Oluştur" butonuna tıkla
5. Oda kodunu not al
6. Instagram Reels'e git
7. Sağ tarafta chat overlay'i gör!

## 🔥 Hızlı Test Senaryosu

### Senaryo 1: Tek Kullanıcı
1. Oda oluştur
2. Instagram Reels'e git
3. Video oynat/durdur
4. Chat'e mesaj yaz

### Senaryo 2: İki Kullanıcı
1. Normal pencerede oda oluştur
2. Incognito pencerede aynı koda katıl
3. Bir pencerede video değiştir
4. Diğer pencerede senkronize olduğunu gör
5. Her iki pencerede mesajlaş

### Senaryo 3: Public Oda
1. Public oda oluştur
2. "Keşfet" sekmesinde odanı gör
3. Başka pencerede katılım isteği gönder
4. İsteği kabul et
5. Birlikte izle!

## 📊 Başarı Kriterleri

✅ Sunucu çalışıyor (http://localhost:3000/health)
✅ Extension yüklü (chrome://extensions/)
✅ Bağlantı kuruldu (popup'ta 🟢 Bağlı)
✅ Oda oluşturuldu (kod alındı)
✅ Chat overlay görünüyor (Instagram'da)
✅ Senkronizasyon çalışıyor (video kontrolü)
✅ Mesajlaşma çalışıyor (chat)

## 🎓 Öğrenme Yolu

1. **Gün 1**: Kurulum ve temel test
2. **Gün 2**: Tüm özellikleri keşfet
3. **Gün 3**: Kod yapısını incele
4. **Gün 4**: Özelleştirme yap
5. **Gün 5**: Production'a al

---

Başarılar! 🚀

Sorularınız için: GitHub Issues
