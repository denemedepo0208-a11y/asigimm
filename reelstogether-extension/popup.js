// ReelsTogether Popup Script
const SERVER_URL = 'http://localhost:3000';

let currentUser = null;
let currentRoom = null;
let socket = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await initializeUser();
  setupTabs();
  setupForms();
  setupEventListeners();
  connectToServer();
  loadPublicRooms();
});

// Initialize User
async function initializeUser() {
  const result = await chrome.storage.local.get(['userId', 'username']);
  
  if (!result.userId) {
    const userId = generateId();
    const username = `User${Math.floor(Math.random() * 10000)}`;
    await chrome.storage.local.set({ userId, username });
    currentUser = { id: userId, username };
  } else {
    currentUser = { id: result.userId, username: result.username };
  }
  
  document.getElementById('username').textContent = currentUser.username;
}

// Setup Tabs
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(tabName).classList.add('active');
      
      if (tabName === 'discover') {
        loadPublicRooms();
      }
    });
  });
}

// Setup Forms
function setupForms() {
  // Room Type Toggle
  const roomTypeRadios = document.querySelectorAll('input[name="roomType"]');
  const publicOptions = document.getElementById('publicOptions');
  
  roomTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'public') {
        publicOptions.style.display = 'block';
      } else {
        publicOptions.style.display = 'none';
      }
    });
  });
  
  // Create Room Form
  document.getElementById('createRoomForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await createRoom();
  });
  
  // Join Room Form
  document.getElementById('joinRoomForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await joinRoomByCode();
  });
}

// Setup Event Listeners
function setupEventListeners() {
  document.getElementById('copyRoomLink')?.addEventListener('click', copyRoomLink);
  document.getElementById('leaveRoom')?.addEventListener('click', leaveRoom);
  document.getElementById('roomSettings')?.addEventListener('click', openRoomSettings);
  document.getElementById('closeSettings')?.addEventListener('click', closeRoomSettings);
  
  // Search and Filter
  document.getElementById('searchRooms')?.addEventListener('input', filterRooms);
  document.getElementById('categoryFilter')?.addEventListener('change', filterRooms);
}

// Connect to Server
function connectToServer() {
  // This will be handled by background.js
  chrome.runtime.sendMessage({ 
    type: 'CONNECT_SERVER',
    userId: currentUser.id,
    username: currentUser.username
  });
  
  // Listen for connection status
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'CONNECTION_STATUS') {
      updateConnectionStatus(message.connected);
    } else if (message.type === 'ROOM_JOINED') {
      handleRoomJoined(message.room);
    } else if (message.type === 'JOIN_REQUEST') {
      showJoinRequest(message.request);
    }
  });
  
  // Check current room
  checkCurrentRoom();
}

// Update Connection Status
function updateConnectionStatus(connected) {
  const statusEl = document.getElementById('connectionStatus');
  if (connected) {
    statusEl.textContent = '🟢 Bağlı';
    statusEl.style.color = '#10b981';
  } else {
    statusEl.textContent = '🔴 Bağlantı yok';
    statusEl.style.color = '#ef4444';
  }
}

// Create Room
async function createRoom() {
  const roomName = document.getElementById('roomName').value;
  const roomType = document.querySelector('input[name="roomType"]:checked').value;
  const category = document.getElementById('roomCategory').value;
  const maxParticipants = parseInt(document.getElementById('maxParticipants').value);
  
  const roomData = {
    name: roomName,
    type: roomType,
    category: roomType === 'public' ? category : null,
    maxParticipants,
    ownerId: currentUser.id,
    ownerName: currentUser.username
  };
  
  chrome.runtime.sendMessage({
    type: 'CREATE_ROOM',
    room: roomData
  }, (response) => {
    if (response.success) {
      alert(`Oda oluşturuldu! Kod: ${response.room.code}`);
      currentRoom = response.room;
      showCurrentRoom();
    } else {
      alert('Oda oluşturulamadı: ' + response.error);
    }
  });
}

// Join Room by Code
async function joinRoomByCode() {
  const code = document.getElementById('roomCode').value;
  
  chrome.runtime.sendMessage({
    type: 'JOIN_ROOM',
    code,
    userId: currentUser.id,
    username: currentUser.username
  }, (response) => {
    if (response.success) {
      currentRoom = response.room;
      showCurrentRoom();
    } else {
      alert('Odaya katılınamadı: ' + response.error);
    }
  });
}

// Load Public Rooms
function loadPublicRooms() {
  chrome.runtime.sendMessage({ type: 'GET_PUBLIC_ROOMS' }, (response) => {
    if (response.success) {
      displayRooms(response.rooms);
    }
  });
}

// Display Rooms
function displayRooms(rooms) {
  const roomsList = document.getElementById('roomsList');
  
  if (rooms.length === 0) {
    roomsList.innerHTML = '<div class="loading">Henüz aktif oda yok</div>';
    return;
  }
  
  roomsList.innerHTML = rooms.map(room => `
    <div class="room-card" data-room-id="${room.id}">
      <div class="room-card-header">
        <div class="room-card-name">${room.name}</div>
        <div class="room-card-category">${getCategoryName(room.category)}</div>
      </div>
      <div class="room-card-info">
        <div class="room-card-participants">
          👥 ${room.participants}/${room.maxParticipants}
        </div>
        <button class="room-card-btn" onclick="requestJoinRoom('${room.id}')" 
          ${room.participants >= room.maxParticipants ? 'disabled' : ''}>
          ${room.participants >= room.maxParticipants ? 'Dolu' : 'Katıl'}
        </button>
      </div>
    </div>
  `).join('');
}

// Request Join Room
window.requestJoinRoom = function(roomId) {
  chrome.runtime.sendMessage({
    type: 'REQUEST_JOIN',
    roomId,
    userId: currentUser.id,
    username: currentUser.username
  }, (response) => {
    if (response.success) {
      alert('Katılım isteği gönderildi. Oda sahibinin onayını bekleyin.');
    } else {
      alert('İstek gönderilemedi: ' + response.error);
    }
  });
};

// Filter Rooms
function filterRooms() {
  const searchTerm = document.getElementById('searchRooms').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  
  chrome.runtime.sendMessage({ 
    type: 'GET_PUBLIC_ROOMS',
    search: searchTerm,
    category
  }, (response) => {
    if (response.success) {
      displayRooms(response.rooms);
    }
  });
}

// Show Current Room
function showCurrentRoom() {
  document.getElementById('currentRoom').style.display = 'block';
  document.getElementById('currentRoomName').textContent = currentRoom.name;
  document.getElementById('currentRoomCode').textContent = `Kod: ${currentRoom.code}`;
  document.getElementById('currentRoomParticipants').textContent = 
    `${currentRoom.participants}/${currentRoom.maxParticipants} kişi`;
  
  // Save to storage
  chrome.storage.local.set({ currentRoom });
}

// Check Current Room
async function checkCurrentRoom() {
  const result = await chrome.storage.local.get(['currentRoom']);
  if (result.currentRoom) {
    currentRoom = result.currentRoom;
    showCurrentRoom();
  }
}

// Copy Room Link
function copyRoomLink() {
  const link = `reelstogether.app/join?code=${currentRoom.code}`;
  navigator.clipboard.writeText(link).then(() => {
    alert('Bağlantı kopyalandı!');
  });
}

// Leave Room
function leaveRoom() {
  if (confirm('Odadan ayrılmak istediğinize emin misiniz?')) {
    chrome.runtime.sendMessage({
      type: 'LEAVE_ROOM',
      roomId: currentRoom.id,
      userId: currentUser.id
    });
    
    currentRoom = null;
    chrome.storage.local.remove('currentRoom');
    document.getElementById('currentRoom').style.display = 'none';
  }
}

// Open Room Settings
function openRoomSettings() {
  if (currentRoom.ownerId !== currentUser.id) {
    alert('Sadece oda sahibi ayarları değiştirebilir.');
    return;
  }
  
  chrome.runtime.sendMessage({
    type: 'GET_ROOM_PARTICIPANTS',
    roomId: currentRoom.id
  }, (response) => {
    if (response.success) {
      displayParticipants(response.participants);
      document.getElementById('settingsModal').style.display = 'flex';
    }
  });
}

// Close Room Settings
function closeRoomSettings() {
  document.getElementById('settingsModal').style.display = 'none';
}

// Display Participants
function displayParticipants(participants) {
  const participantsList = document.getElementById('participantsList');
  
  participantsList.innerHTML = participants.map(p => `
    <div class="participant-card">
      <div class="participant-header">
        <div class="participant-name">${p.username}</div>
        ${p.id === currentRoom.ownerId ? '<div class="participant-role">👑 Sahip</div>' : ''}
      </div>
      ${p.id !== currentRoom.ownerId ? `
        <div class="participant-permissions">
          <div class="permission-toggle">
            <span>💬 Chat</span>
            <div class="toggle-switch ${p.permissions.canChat ? 'active' : ''}" 
              onclick="togglePermission('${p.id}', 'canChat')"></div>
          </div>
          <div class="permission-toggle">
            <span>📜 Scroll</span>
            <div class="toggle-switch ${p.permissions.canScroll ? 'active' : ''}" 
              onclick="togglePermission('${p.id}', 'canScroll')"></div>
          </div>
          <button class="btn btn-danger" onclick="kickParticipant('${p.id}')">
            🚪 Çıkar
          </button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// Toggle Permission
window.togglePermission = function(userId, permission) {
  chrome.runtime.sendMessage({
    type: 'UPDATE_PERMISSION',
    roomId: currentRoom.id,
    userId,
    permission
  });
};

// Kick Participant
window.kickParticipant = function(userId) {
  if (confirm('Bu kullanıcıyı odadan çıkarmak istediğinize emin misiniz?')) {
    chrome.runtime.sendMessage({
      type: 'KICK_PARTICIPANT',
      roomId: currentRoom.id,
      userId
    });
  }
};

// Show Join Request
function showJoinRequest(request) {
  document.getElementById('requesterName').textContent = request.username;
  document.getElementById('joinRequestModal').style.display = 'flex';
  
  document.getElementById('acceptRequest').onclick = () => {
    chrome.runtime.sendMessage({
      type: 'ACCEPT_JOIN_REQUEST',
      requestId: request.id
    });
    document.getElementById('joinRequestModal').style.display = 'none';
  };
  
  document.getElementById('rejectRequest').onclick = () => {
    chrome.runtime.sendMessage({
      type: 'REJECT_JOIN_REQUEST',
      requestId: request.id
    });
    document.getElementById('joinRequestModal').style.display = 'none';
  };
}

// Helper Functions
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getCategoryName(category) {
  const categories = {
    'eglence': 'Eğlence',
    'ask': 'Aşk',
    'komedi': 'Komedi',
    'muzik': 'Müzik',
    'spor': 'Spor'
  };
  return categories[category] || category;
}
