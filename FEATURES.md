# 🎬 ReelsTogether v2.0 - Özellikler Detayı

## 🏗️ Mimari Genel Bakış

```
┌─────────────────────────────────────────────────────────────┐
│                    Instagram Web Page                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Content Script (content.js)                           │ │
│  │  - Video element detection                             │ │
│  │  - Event listeners (play, pause, seek)                 │ │
│  │  - Chat overlay injection                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Chrome Extension (Manifest V3)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Background Service Worker (background.js)             │ │
│  │  - Socket.io connection management                     │ │
│  │  - Message routing                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Popup UI (popup.html/js/css)                          │ │
│  │  - Room creation/joining                               │ │
│  │  - Room discovery                                      │ │
│  │  - Settings management                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ Socket.io
┌─────────────────────────────────────────────────────────────┐
│                   Node.js Server                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express + Socket.io                                   │ │
│  │  - Real-time event handling                            │ │
│  │  - Room management                                     │ │
│  │  - Permission control                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                     │
│  - Rooms, Participants, Messages, Join Requests             │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Özellik Listesi

### 1. 🏠 Oda Yönetimi

#### 1.1 Oda Oluşturma
- **Public Odalar**
  - Keşfet sayfasında görünür
  - Kategori seçimi (Eğlence, Aşk, Komedi, Müzik, Spor)
  - Katılım isteği sistemi
  - Maksimum katılımcı limiti (2-10)
  
- **Private Odalar**
  - 6 haneli benzersiz kod
  - Sadece kod ile erişim
  - Keşfet sayfasında görünmez
  - Bağlantı paylaşımı özelliği

#### 1.2 Oda Özellikleri
- Otomatik oda kodu oluşturma
- Oda sahibi ataması
- Katılımcı sayısı takibi
- 2 saat sonra otomatik kapanma
- Oda bilgilerini görüntüleme

### 2. 👥 Katılımcı Yönetimi

#### 2.1 Katılma Yöntemleri
- **Kod ile katılma**: 6 haneli kod girişi
- **Keşfet ile katılma**: Public odalar listesinden
- **Link ile katılma**: `reelstogether.app/join?code=123456`

#### 2.2 Katılım İsteği Sistemi
- Public odalar için onay mekanizması
- Oda sahibine bildirim
- Kabul/Reddetme seçenekleri
- İstek durumu takibi

#### 2.3 Katılımcı Listesi
- Aktif katılımcıları görüntüleme
- Oda sahibi işaretlemesi (👑)
- Kullanıcı adları
- Katılım zamanı

### 3. 👑 Oda Sahibi Yetkileri

#### 3.1 İzin Yönetimi
- **Chat İzni**
  - Mesaj gönderme yetkisi
  - Kullanıcı bazlı açma/kapama
  - Anlık güncelleme
  
- **Scroll İzni**
  - Video kontrolü yetkisi
  - Play/pause/seek kontrolü
  - Video değiştirme yetkisi

#### 3.2 Katılımcı Kontrolü
- Katılımcı atma
- İzin değiştirme
- Katılım isteklerini onaylama/reddetme

### 4. 💬 Chat Sistemi

#### 4.1 Mesajlaşma
- Gerçek zamanlı mesaj gönderimi
- Mesaj geçmişi (son 50 mesaj)
- Kullanıcı adı gösterimi
- Zaman damgası

#### 4.2 Chat Overlay
- Instagram sayfasında sağ üst köşe
- Baloncuk tasarımlı mesajlar
- Minimize/maximize özelliği
- Scroll edilebilir mesaj listesi
- Otomatik scroll (yeni mesajda)

#### 4.3 Özel Mesaj Tipleri
- Kullanıcı mesajları
- Sistem mesajları (katılım/ayrılma)
- Kendi mesajlarını ayırt etme

#### 4.4 Video Zaman Damgası
- Mesajlar video zamanı ile kaydedilir
- İleride "bu anı tekrar izle" özelliği için

### 5. 🎥 Reels Senkronizasyonu

#### 5.1 Video Kontrol Senkronizasyonu
- **Play/Pause**: Tüm katılımcılarda aynı anda
- **Seek**: İleri/geri sarma senkronizasyonu
- **Volume**: Ses seviyesi değişiklikleri
- **URL Change**: Video değiştirme (scroll)

#### 5.2 Smart Watch Mode
- ±0.3 saniye tolerans
- Otomatik zaman düzeltme
- Gecikme telafisi
- Debounce mekanizması (100ms)

#### 5.3 Senkronizasyon Göstergeleri
- Ekran üstünde bildirim
- Event tipi gösterimi
- 2 saniye otomatik kapanma
- Animasyonlu geçişler

### 6. 🔍 Keşfet Sistemi

#### 6.1 Oda Listesi
- Public odaları görüntüleme
- Oda adı, kategori, katılımcı sayısı
- Dolu/boş durumu
- Gerçek zamanlı güncelleme

#### 6.2 Filtreleme
- **Arama**: Oda adına göre
- **Kategori**: 5 farklı kategori
- Anlık filtreleme
- Sonuç sayısı gösterimi

#### 6.3 Oda Kartları
- Modern kart tasarımı
- Hover efektleri
- Kategori badge'leri
- Katılım butonu
- Dolu odalar için disabled durum

### 7. 🎨 Kullanıcı Arayüzü

#### 7.1 Popup Arayüzü
- **3 Sekmeli Yapı**
  - 🏠 Keşfet
  - ➕ Oda Oluştur
  - 🔑 Koda Katıl

- **Tasarım Özellikleri**
  - Gradient renkler (mor-mavi)
  - Rounded corners
  - Smooth transitions
  - Hover animasyonları
  - Responsive layout

#### 7.2 Chat Overlay
- Şeffaf arka plan (backdrop blur)
- Modern baloncuk tasarımı
- Minimize özelliği
- Katılımcı listesi
- Input alanı

#### 7.3 Modal'lar
- Oda ayarları modal'ı
- Katılım isteği modal'ı
- Smooth açılma/kapanma
- Overlay ile arka plan karartma

### 8. 🔐 Güvenlik ve İzinler

#### 8.1 Chrome Extension İzinleri
- `storage`: Kullanıcı verilerini saklama
- `tabs`: Sekme yönetimi
- `activeTab`: Aktif sekme erişimi
- Instagram host izinleri

#### 8.2 Supabase Güvenlik
- Row Level Security (RLS)
- Public access policies
- Cascade delete
- Index optimizasyonu

#### 8.3 Veri Güvenliği
- Kullanıcı ID'leri hash'lenmeli (gelecek)
- Oda kodları benzersiz
- Otomatik oda temizleme
- Expired room cleanup

### 9. 📊 Veri Yönetimi

#### 9.1 Veritabanı Tabloları
- **users**: Kullanıcı bilgileri
- **rooms**: Oda bilgileri
- **room_participants**: Katılımcılar ve izinler
- **messages**: Chat mesajları
- **join_requests**: Katılım istekleri

#### 9.2 Caching
- In-memory room cache
- Socket-room mapping
- Hızlı erişim için Map kullanımı

#### 9.3 Cleanup
- 30 dakikada bir expired room kontrolü
- Cascade delete ile ilişkili verileri temizleme
- Boş odaları otomatik silme

### 10. 🔔 Bildirim Sistemi

#### 10.1 Bildirim Tipleri
- Katılım istekleri
- Katılımcı katıldı/ayrıldı
- İzin değişiklikleri
- Odadan atılma
- Senkronizasyon durumu

#### 10.2 Bildirim Gösterimi
- Toast notifications
- Modal notifications
- Overlay notifications
- Status bar updates

### 11. 🌐 Socket.io Events

#### 11.1 Client → Server
- `createRoom`: Oda oluştur
- `joinRoom`: Odaya katıl
- `requestJoin`: Katılım isteği gönder
- `leaveRoom`: Odadan ayrıl
- `syncEvent`: Senkronizasyon eventi
- `sendMessage`: Mesaj gönder
- `updatePermission`: İzin güncelle
- `kickParticipant`: Katılımcı at

#### 11.2 Server → Client
- `roomJoined`: Odaya katıldı
- `roomLeft`: Odadan ayrıldı
- `joinRequest`: Katılım isteği
- `syncEvent`: Senkronizasyon eventi
- `chatMessage`: Chat mesajı
- `permissionsUpdated`: İzinler güncellendi
- `participantJoined`: Katılımcı katıldı
- `participantLeft`: Katılımcı ayrıldı

### 12. 🎯 Performans Optimizasyonları

#### 12.1 Frontend
- Debounce mekanizması
- Event throttling
- Lazy loading
- Efficient DOM manipulation

#### 12.2 Backend
- In-memory caching
- Database indexing
- Connection pooling
- Efficient queries

#### 12.3 Network
- Socket.io binary support
- Compression
- Reconnection logic
- Heartbeat mechanism

### 13. 🐛 Hata Yönetimi

#### 13.1 Error Handling
- Try-catch blokları
- Error callbacks
- User-friendly error messages
- Console logging

#### 13.2 Fallback Mekanizmaları
- Reconnection attempts
- Offline mode detection
- Graceful degradation

### 14. 📱 Responsive Tasarım

#### 14.1 Popup
- 400px sabit genişlik
- Dinamik yükseklik
- Scroll support
- Mobile-friendly

#### 14.2 Overlay
- Ekran boyutuna göre ayarlama
- Minimize özelliği
- Touch-friendly (gelecek)

## 🚀 Gelecek Özellikler (v3.0)

### AI Watch Assistant
- İçerik analizi
- Benzer Reels önerileri
- Trend takibi
- Otomatik kategori önerisi

### Kullanıcı Profilleri
- Avatar sistemi
- Profil kartları
- İstatistikler
- Rozet sistemi

### Gelişmiş Chat
- Emoji reaksiyonları
- GIF desteği
- Mention sistemi
- Thread'ler

### Sosyal Özellikler
- Arkadaş listesi
- Favori odalar
- Oda geçmişi
- Paylaşım özellikleri

### Mobil Uygulama
- React Native
- iOS ve Android
- Push notifications
- Daha iyi performans

---

Bu dokümantasyon, ReelsTogether v2.0'ın tüm özelliklerini detaylı şekilde açıklamaktadır.
