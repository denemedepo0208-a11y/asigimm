# 📡 ReelsTogether API Documentation

## Socket.io Events

### Client → Server Events

#### 1. createRoom
Yeni bir oda oluşturur.

**Payload:**
```javascript
{
  name: string,           // Oda adı
  type: 'public' | 'private',
  category: string,       // Sadece public için
  maxParticipants: number,
  ownerId: string,
  ownerName: string
}
```

**Response:**
```javascript
{
  success: boolean,
  room: {
    id: string,
    code: string,
    name: string,
    type: string,
    category: string,
    maxParticipants: number,
    participants: number,
    isOwner: boolean,
    permissions: {
      canChat: boolean,
      canScroll: boolean
    }
  },
  error?: string
}
```

#### 2. joinRoom
Kod ile odaya katılır.

**Payload:**
```javascript
{
  code: string,
  userId: string,
  username: string
}
```

**Response:**
```javascript
{
  success: boolean,
  room: {
    id: string,
    code: string,
    name: string,
    type: string,
    category: string,
    maxParticipants: number,
    participants: number,
    isOwner: boolean,
    permissions: {
      canChat: boolean,
      canScroll: boolean
    }
  },
  error?: string
}
```

#### 3. requestJoin
Public odaya katılım isteği gönderir.

**Payload:**
```javascript
{
  roomId: string,
  userId: string,
  username: string
}
```

**Response:**
```javascript
{
  success: boolean,
  error?: string
}
```

#### 4. acceptJoinRequest
Katılım isteğini kabul eder (sadece oda sahibi).

**Payload:**
```javascript
{
  requestId: number
}
```

**Response:**
```javascript
{
  success: boolean,
  error?: string
}
```

#### 5. rejectJoinRequest
Katılım isteğini reddeder (sadece oda sahibi).

**Payload:**
```javascript
{
  requestId: number
}
```

**Response:**
```javascript
{
  success: boolean,
  error?: string
}
```

#### 6. leaveRoom
Odadan ayrılır.

**Payload:**
```javascript
{
  roomId: string,
  userId: string
}
```

**Response:**
```javascript
{
  success: boolean,
  error?: string
}
```

#### 7. getPublicRooms
Public odaları listeler.

**Payload:**
```javascript
{
  search?: string,
  category?: string
}
```

**Response:**
```javascript
{
  success: boolean,
  rooms: [
    {
      id: string,
      name: string,
      category: string,
      participants: number,
      maxParticipants: number
    }
  ],
  error?: string
}
```

#### 8. getRoomParticipants
Oda katılımcılarını listeler.

**Payload:**
```javascript
{
  roomId: string
}
```

**Response:**
```javascript
{
  success: boolean,
  participants: [
    {
      id: string,
      username: string,
      isOwner: boolean,
      permissions: {
        canChat: boolean,
        canScroll: boolean
      }
    }
  ],
  error?: string
}
```

#### 9. updatePermission
Katılımcı iznini günceller (sadece oda sahibi).

**Payload:**
```javascript
{
  roomId: string,
  userId: string,
  permission: 'canChat' | 'canScroll'
}
```

**Response:**
```javascript
{
  success: boolean,
  error?: string
}
```

#### 10. kickParticipant
Katılımcıyı odadan atar (sadece oda sahibi).

**Payload:**
```javascript
{
  roomId: string,
  userId: string
}
```

**Response:**
```javascript
{
  success: boolean,
  error?: string
}
```

#### 11. syncEvent
Video senkronizasyon eventi gönderir.

**Payload:**
```javascript
{
  roomId: string,
  eventType: 'play' | 'pause' | 'seek' | 'volume' | 'urlChange',
  data: {
    currentTime?: number,
    url?: string,
    volume?: number,
    muted?: boolean
  }
}
```

**No Response** (broadcast event)

#### 12. sendMessage
Chat mesajı gönderir.

**Payload:**
```javascript
{
  roomId: string,
  message: string,
  videoTime: number
}
```

**No Response** (broadcast event)

---

### Server → Client Events

#### 1. roomJoined
Odaya başarıyla katıldığında tetiklenir.

**Payload:**
```javascript
{
  id: string,
  name: string,
  code: string,
  isOwner: boolean,
  permissions: {
    canChat: boolean,
    canScroll: boolean
  }
}
```

#### 2. roomLeft
Odadan ayrıldığında tetiklenir.

**No Payload**

#### 3. joinRequest
Katılım isteği geldiğinde tetiklenir (sadece oda sahibine).

**Payload:**
```javascript
{
  id: number,
  roomId: string,
  userId: string,
  username: string
}
```

#### 4. joinRequestAccepted
Katılım isteği kabul edildiğinde tetiklenir.

**Payload:**
```javascript
{
  requestId: number,
  roomId: string
}
```

#### 5. joinRequestRejected
Katılım isteği reddedildiğinde tetiklenir.

**Payload:**
```javascript
{
  requestId: number
}
```

#### 6. syncEvent
Video senkronizasyon eventi alındığında tetiklenir.

**Payload:**
```javascript
eventType: 'play' | 'pause' | 'seek' | 'volume' | 'urlChange',
data: {
  currentTime?: number,
  url?: string,
  volume?: number,
  muted?: boolean
}
```

#### 7. chatMessage
Yeni chat mesajı geldiğinde tetiklenir.

**Payload:**
```javascript
{
  author: string,
  content: string,
  timestamp: number,
  videoTime: number,
  isOwn: boolean
}
```

#### 8. permissionsUpdated
İzinler güncellendiğinde tetiklenir.

**Payload:**
```javascript
{
  canChat?: boolean,
  canScroll?: boolean
}
```

#### 9. participantJoined
Yeni katılımcı odaya katıldığında tetiklenir.

**Payload:**
```javascript
{
  id: string,
  username: string,
  isOwner: boolean
}
```

#### 10. participantLeft
Katılımcı odadan ayrıldığında tetiklenir.

**Payload:**
```javascript
{
  id: string,
  username: string
}
```

#### 11. kicked
Odadan atıldığında tetiklenir.

**No Payload**

---

## REST API Endpoints

### GET /health
Sunucu sağlık kontrolü.

**Response:**
```javascript
{
  status: 'ok',
  message: 'ReelsTogether Server is running'
}
```

### GET /api/status
Sunucu durumu ve istatistikleri.

**Response:**
```javascript
{
  status: 'online',
  version: '2.0.0',
  connections: number
}
```

---

## Database Schema

### users
```sql
id TEXT PRIMARY KEY
username TEXT NOT NULL
created_at TIMESTAMP DEFAULT NOW()
```

### rooms
```sql
id TEXT PRIMARY KEY
code TEXT UNIQUE NOT NULL
name TEXT NOT NULL
type TEXT NOT NULL CHECK (type IN ('public', 'private'))
category TEXT
max_participants INTEGER NOT NULL
owner_id TEXT NOT NULL
owner_name TEXT NOT NULL
created_at TIMESTAMP DEFAULT NOW()
expires_at TIMESTAMP
```

### room_participants
```sql
id SERIAL PRIMARY KEY
room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE
user_id TEXT NOT NULL
username TEXT NOT NULL
is_owner BOOLEAN DEFAULT FALSE
can_chat BOOLEAN DEFAULT TRUE
can_scroll BOOLEAN DEFAULT TRUE
joined_at TIMESTAMP DEFAULT NOW()
UNIQUE(room_id, user_id)
```

### messages
```sql
id SERIAL PRIMARY KEY
room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE
user_id TEXT NOT NULL
username TEXT NOT NULL
content TEXT NOT NULL
video_time FLOAT
created_at TIMESTAMP DEFAULT NOW()
```

### join_requests
```sql
id SERIAL PRIMARY KEY
room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE
user_id TEXT NOT NULL
username TEXT NOT NULL
status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected'))
created_at TIMESTAMP DEFAULT NOW()
```

---

## Error Codes

### Socket.io Errors
- `Sunucuya bağlı değil`: Socket bağlantısı yok
- `Oda bulunamadı`: Geçersiz oda kodu/ID
- `Oda dolu`: Maksimum katılımcı sayısına ulaşıldı
- `İzin yok`: Yetkisiz işlem

### Database Errors
- `UNIQUE constraint failed`: Duplicate entry
- `FOREIGN KEY constraint failed`: İlişkili kayıt bulunamadı
- `CHECK constraint failed`: Geçersiz değer

---

## Rate Limiting

Şu anda rate limiting yok. Production için önerilir:
- 100 request/minute per user
- 10 room creation/hour per user
- 50 message/minute per room

---

## WebSocket Connection

### Connection URL
```
ws://localhost:3000
```

### Query Parameters
```javascript
{
  userId: string,
  username: string
}
```

### Example Connection
```javascript
const socket = io('http://localhost:3000', {
  query: {
    userId: 'user123',
    username: 'JohnDoe'
  }
});
```

---

## Chrome Extension Messages

### Background ↔ Popup

#### CONNECT_SERVER
```javascript
{
  type: 'CONNECT_SERVER',
  userId: string,
  username: string
}
```

#### CONNECTION_STATUS
```javascript
{
  type: 'CONNECTION_STATUS',
  connected: boolean
}
```

#### CREATE_ROOM
```javascript
{
  type: 'CREATE_ROOM',
  room: RoomData
}
```

#### JOIN_ROOM
```javascript
{
  type: 'JOIN_ROOM',
  code: string,
  userId: string,
  username: string
}
```

### Background ↔ Content Script

#### ROOM_JOINED
```javascript
{
  type: 'ROOM_JOINED',
  room: RoomData
}
```

#### SYNC_EVENT
```javascript
{
  type: 'SYNC_EVENT',
  eventType: string,
  data: object
}
```

#### CHAT_MESSAGE
```javascript
{
  type: 'CHAT_MESSAGE',
  message: MessageData
}
```

---

Bu dokümantasyon, ReelsTogether API'sinin tüm endpoint'lerini ve event'lerini kapsamaktadır.
