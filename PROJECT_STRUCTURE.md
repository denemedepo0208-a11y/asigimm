# 📁 ReelsTogether v2.0 - Proje Yapısı

## 🗂️ Dizin Yapısı

```
/vercel/sandbox/
│
├── 📄 README.md                          # Ana proje dokümantasyonu
├── 📄 SETUP_GUIDE.md                     # Kurulum rehberi
├── 📄 FEATURES.md                        # Özellikler detayı
├── 📄 API_DOCUMENTATION.md               # API dokümantasyonu
├── 📄 PROJECT_STRUCTURE.md               # Bu dosya
│
├── 📁 reelstogether-extension/           # Chrome Extension
│   ├── 📄 manifest.json                  # Extension yapılandırması (Manifest V3)
│   ├── 📄 popup.html                     # Ana UI HTML
│   ├── 📄 popup.js                       # UI mantığı ve event handlers
│   ├── 📄 content.js                     # Instagram sayfası entegrasyonu
│   ├── 📄 background.js                  # Service worker, Socket.io yönetimi
│   │
│   ├── 📁 styles/
│   │   ├── 📄 popup.css                  # Popup stilleri
│   │   └── 📄 content.css                # Chat overlay stilleri
│   │
│   └── 📁 assets/
│       ├── 📄 README.md                  # İkon gereksinimleri
│       ├── 🖼️ icon16.png                 # 16x16 ikon (gerekli)
│       ├── 🖼️ icon48.png                 # 48x48 ikon (gerekli)
│       └── 🖼️ icon128.png                # 128x128 ikon (gerekli)
│
└── 📁 reelstogether-server/              # Node.js Backend
    ├── 📄 package.json                   # NPM bağımlılıkları
    ├── 📄 .env                           # Ortam değişkenleri
    ├── 📄 .gitignore                     # Git ignore kuralları
    ├── 📄 schema.sql                     # Supabase veritabanı şeması
    │
    ├── 📁 src/
    │   ├── 📄 index.js                   # Ana sunucu dosyası
    │   ├── 📄 roomManager.js             # Oda yönetimi fonksiyonları
    │   └── 📄 socketHandlers.js          # Socket.io event handlers
    │
    └── 📁 config/
        └── 📄 supabase.js                # Supabase client yapılandırması
```

## 📦 Dosya Açıklamaları

### Chrome Extension Dosyaları

#### manifest.json
- Chrome Extension yapılandırma dosyası
- Manifest V3 formatı
- İzinler: storage, tabs, activeTab
- Host izinleri: Instagram
- Content scripts ve background worker tanımları

#### popup.html
- Extension popup arayüzü
- 3 sekmeli yapı: Keşfet, Oda Oluştur, Koda Katıl
- Modal'lar: Oda ayarları, katılım istekleri
- Responsive tasarım

#### popup.js
- UI event handlers
- Form yönetimi
- Chrome storage API kullanımı
- Background script ile iletişim
- Oda oluşturma/katılma mantığı

#### content.js
- Instagram sayfasına enjekte edilir
- Video element detection
- Play/pause/seek event listeners
- Chat overlay oluşturma
- Senkronizasyon mantığı
- Background script ile iletişim

#### background.js
- Service worker (Manifest V3)
- Socket.io client bağlantısı
- Message routing (popup ↔ content)
- Event broadcasting
- Connection management

#### styles/popup.css
- Popup arayüz stilleri
- Gradient renkler
- Animasyonlar
- Responsive layout
- Modal stilleri

#### styles/content.css
- Chat overlay stilleri
- Baloncuk tasarımı
- Senkronizasyon göstergeleri
- Bildirim stilleri
- Minimize/maximize animasyonları

### Backend Dosyaları

#### src/index.js
- Express server kurulumu
- Socket.io yapılandırması
- CORS ayarları
- Health check endpoint
- Graceful shutdown

#### src/roomManager.js
- Oda CRUD işlemleri
- Katılımcı yönetimi
- İzin kontrolü
- Mesaj yönetimi
- Katılım isteği yönetimi
- In-memory caching
- Otomatik cleanup

#### src/socketHandlers.js
- Socket.io event handlers
- Room join/leave mantığı
- Sync event broadcasting
- Chat message handling
- Permission updates
- Participant management

#### config/supabase.js
- Supabase client oluşturma
- Database schema dokümantasyonu
- Connection yapılandırması

#### schema.sql
- PostgreSQL tablo tanımları
- Index'ler
- Foreign key constraints
- RLS policies
- Cleanup fonksiyonları

## 🔄 Veri Akışı

### 1. Oda Oluşturma Akışı
```
popup.js (UI)
    ↓ chrome.runtime.sendMessage
background.js
    ↓ socket.emit('createRoom')
Server (socketHandlers.js)
    ↓ roomManager.createRoom()
Supabase (rooms table)
    ↓ callback
background.js
    ↓ chrome.runtime.sendMessage
popup.js (UI güncelleme)
```

### 2. Video Senkronizasyon Akışı
```
content.js (video event)
    ↓ chrome.runtime.sendMessage
background.js
    ↓ socket.emit('syncEvent')
Server (socketHandlers.js)
    ↓ socket.to(roomId).emit('syncEvent')
background.js (diğer kullanıcılar)
    ↓ chrome.tabs.sendMessage
content.js (video kontrolü)
```

### 3. Chat Mesajı Akışı
```
content.js (mesaj gönder)
    ↓ chrome.runtime.sendMessage
background.js
    ↓ socket.emit('sendMessage')
Server (socketHandlers.js)
    ↓ roomManager.saveMessage()
Supabase (messages table)
    ↓ io.to(roomId).emit('chatMessage')
background.js (tüm kullanıcılar)
    ↓ chrome.tabs.sendMessage
content.js (mesaj göster)
```

## 🗄️ Veritabanı İlişkileri

```
users
  └── (referenced by room_participants)

rooms
  ├── room_participants (1:N)
  ├── messages (1:N)
  └── join_requests (1:N)

room_participants
  └── rooms (N:1)

messages
  └── rooms (N:1)

join_requests
  └── rooms (N:1)
```

## 🔌 Socket.io Event Akışı

### Client Events
```
createRoom
joinRoom
requestJoin
acceptJoinRequest
rejectJoinRequest
leaveRoom
getPublicRooms
getRoomParticipants
updatePermission
kickParticipant
syncEvent
sendMessage
```

### Server Events
```
roomJoined
roomLeft
joinRequest
joinRequestAccepted
joinRequestRejected
syncEvent
chatMessage
permissionsUpdated
participantJoined
participantLeft
kicked
```

## 📊 State Management

### Chrome Storage (Local)
```javascript
{
  userId: string,
  username: string,
  currentRoom: {
    id: string,
    name: string,
    code: string,
    isOwner: boolean,
    permissions: object
  }
}
```

### In-Memory Cache (Server)
```javascript
activeRooms: Map<roomId, {
  ...roomData,
  participants: Map<userId, participantData>
}>

socketRooms: Map<socketId, roomId>
roomSockets: Map<roomId, Set<socketId>>
```

## 🎯 Önemli Dosya İlişkileri

### Extension İçi İletişim
```
popup.js ←→ background.js ←→ content.js
    ↓           ↓              ↓
Chrome Storage API    Socket.io    Instagram DOM
```

### Server İçi İletişim
```
index.js
    ↓
socketHandlers.js
    ↓
roomManager.js
    ↓
supabase.js
    ↓
Supabase Database
```

## 📝 Kod Organizasyonu

### Extension
- **UI Layer**: popup.html, popup.css
- **Logic Layer**: popup.js, content.js
- **Communication Layer**: background.js
- **Style Layer**: styles/*.css

### Server
- **Entry Point**: src/index.js
- **Business Logic**: src/roomManager.js
- **Event Handling**: src/socketHandlers.js
- **Database**: config/supabase.js

## 🔧 Yapılandırma Dosyaları

### Extension
- `manifest.json`: Chrome Extension config
- Chrome Storage: Runtime config

### Server
- `.env`: Environment variables
- `package.json`: Dependencies
- `schema.sql`: Database schema

## 📚 Dokümantasyon Dosyaları

- `README.md`: Genel bakış ve hızlı başlangıç
- `SETUP_GUIDE.md`: Detaylı kurulum talimatları
- `FEATURES.md`: Özellik listesi ve açıklamaları
- `API_DOCUMENTATION.md`: API referansı
- `PROJECT_STRUCTURE.md`: Proje yapısı (bu dosya)

## 🚀 Deployment Yapısı

### Development
```
localhost:3000 (Server)
chrome://extensions/ (Extension)
```

### Production
```
https://api.reelstogether.app (Server)
Chrome Web Store (Extension)
Supabase Cloud (Database)
```

---

Bu yapı, ReelsTogether v2.0 projesinin tüm bileşenlerini ve ilişkilerini göstermektedir.
