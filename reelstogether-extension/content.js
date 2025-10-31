// ReelsTogether Content Script - Instagram Reels Integration
let currentVideoElement = null;
let isOwner = false;
let canScroll = true;
let canChat = true;
let currentRoom = null;
let overlay = null;
let syncTimeout = null;

// Initialize
init();

function init() {
  console.log('ReelsTogether: Content script loaded');
  
  // Listen for messages from background
  chrome.runtime.onMessage.addListener(handleMessage);
  
  // Check if we're on Instagram Reels
  if (window.location.href.includes('instagram.com')) {
    observeReels();
    createOverlay();
  }
}

// Observe Reels
function observeReels() {
  // Watch for video elements
  const observer = new MutationObserver(() => {
    const videoElement = document.querySelector('video');
    if (videoElement && videoElement !== currentVideoElement) {
      attachVideoListeners(videoElement);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Initial check
  const videoElement = document.querySelector('video');
  if (videoElement) {
    attachVideoListeners(videoElement);
  }
}

// Attach Video Listeners
function attachVideoListeners(videoElement) {
  currentVideoElement = videoElement;
  console.log('ReelsTogether: Video element found');
  
  // Play event
  videoElement.addEventListener('play', () => {
    if (canScroll) {
      sendSyncEvent('play', {
        currentTime: videoElement.currentTime,
        url: window.location.href
      });
    }
  });
  
  // Pause event
  videoElement.addEventListener('pause', () => {
    if (canScroll) {
      sendSyncEvent('pause', {
        currentTime: videoElement.currentTime,
        url: window.location.href
      });
    }
  });
  
  // Time update (for seeking)
  let lastTime = 0;
  videoElement.addEventListener('timeupdate', () => {
    const timeDiff = Math.abs(videoElement.currentTime - lastTime);
    if (timeDiff > 1 && canScroll) {
      sendSyncEvent('seek', {
        currentTime: videoElement.currentTime,
        url: window.location.href
      });
    }
    lastTime = videoElement.currentTime;
  });
  
  // Volume change
  videoElement.addEventListener('volumechange', () => {
    if (canScroll) {
      sendSyncEvent('volume', {
        volume: videoElement.volume,
        muted: videoElement.muted
      });
    }
  });
  
  // Watch for URL changes (scroll to next/prev reel)
  let lastUrl = window.location.href;
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      if (canScroll) {
        sendSyncEvent('urlChange', {
          url: window.location.href
        });
      }
    }
  }, 500);
}

// Send Sync Event
function sendSyncEvent(eventType, data) {
  chrome.runtime.sendMessage({
    type: 'SYNC_EVENT',
    eventType,
    data
  });
  
  showSyncIndicator(eventType);
}

// Handle Messages from Background
function handleMessage(message, sender, sendResponse) {
  switch (message.type) {
    case 'ROOM_JOINED':
      handleRoomJoined(message.room);
      break;
      
    case 'ROOM_LEFT':
      handleRoomLeft();
      break;
      
    case 'SYNC_EVENT':
      handleSyncEvent(message.eventType, message.data);
      break;
      
    case 'CHAT_MESSAGE':
      handleChatMessage(message.message);
      break;
      
    case 'PERMISSIONS_UPDATED':
      handlePermissionsUpdated(message.permissions);
      break;
      
    case 'PARTICIPANT_JOINED':
      handleParticipantJoined(message.participant);
      break;
      
    case 'PARTICIPANT_LEFT':
      handleParticipantLeft(message.participant);
      break;
  }
}

// Handle Room Joined
function handleRoomJoined(room) {
  currentRoom = room;
  isOwner = room.isOwner;
  canScroll = room.permissions.canScroll;
  canChat = room.permissions.canChat;
  
  updateOverlay();
  showSystemMessage(`Odaya katıldınız: ${room.name}`);
}

// Handle Room Left
function handleRoomLeft() {
  currentRoom = null;
  isOwner = false;
  canScroll = true;
  canChat = true;
  
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}

// Handle Sync Event
function handleSyncEvent(eventType, data) {
  if (!currentVideoElement) return;
  
  // Clear previous sync timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  // Debounce sync events
  syncTimeout = setTimeout(() => {
    switch (eventType) {
      case 'play':
        if (Math.abs(currentVideoElement.currentTime - data.currentTime) > 0.3) {
          currentVideoElement.currentTime = data.currentTime;
        }
        currentVideoElement.play();
        if (data.url !== window.location.href) {
          window.location.href = data.url;
        }
        break;
        
      case 'pause':
        currentVideoElement.pause();
        if (Math.abs(currentVideoElement.currentTime - data.currentTime) > 0.3) {
          currentVideoElement.currentTime = data.currentTime;
        }
        break;
        
      case 'seek':
        currentVideoElement.currentTime = data.currentTime;
        break;
        
      case 'volume':
        currentVideoElement.volume = data.volume;
        currentVideoElement.muted = data.muted;
        break;
        
      case 'urlChange':
        if (data.url !== window.location.href) {
          window.location.href = data.url;
        }
        break;
    }
    
    showSyncIndicator(eventType);
  }, 100);
}

// Handle Chat Message
function handleChatMessage(message) {
  if (!overlay) return;
  
  const messagesContainer = overlay.querySelector('.rt-messages');
  const messageEl = createMessageElement(message);
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle Permissions Updated
function handlePermissionsUpdated(permissions) {
  canScroll = permissions.canScroll;
  canChat = permissions.canChat;
  
  updateOverlay();
  showSystemMessage(`İzinleriniz güncellendi`);
}

// Handle Participant Joined
function handleParticipantJoined(participant) {
  showSystemMessage(`${participant.username} odaya katıldı`);
  updateParticipantsList();
}

// Handle Participant Left
function handleParticipantLeft(participant) {
  showSystemMessage(`${participant.username} odadan ayrıldı`);
  updateParticipantsList();
}

// Create Overlay
function createOverlay() {
  if (overlay) return;
  
  overlay = document.createElement('div');
  overlay.id = 'reelstogether-overlay';
  overlay.innerHTML = `
    <div class="rt-header">
      <div class="rt-header-title">
        🎬 ReelsTogether
      </div>
      <div class="rt-header-actions">
        <button class="rt-header-btn" id="rt-minimize">−</button>
      </div>
    </div>
    <div class="rt-participants">
      <div>Katılımcılar:</div>
      <div class="rt-participants-list" id="rt-participants-list"></div>
    </div>
    <div class="rt-messages" id="rt-messages"></div>
    <div class="rt-input-container">
      <div class="rt-input-wrapper">
        <input type="text" class="rt-input" id="rt-input" placeholder="Mesaj yaz..." />
        <button class="rt-send-btn" id="rt-send">➤</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Setup event listeners
  document.getElementById('rt-minimize').addEventListener('click', toggleOverlay);
  document.getElementById('rt-send').addEventListener('click', sendMessage);
  document.getElementById('rt-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  // Initially hide if no room
  if (!currentRoom) {
    overlay.style.display = 'none';
  }
}

// Update Overlay
function updateOverlay() {
  if (!overlay) return;
  
  if (currentRoom) {
    overlay.style.display = 'flex';
    updateParticipantsList();
    
    const input = document.getElementById('rt-input');
    const sendBtn = document.getElementById('rt-send');
    
    if (canChat) {
      input.disabled = false;
      sendBtn.disabled = false;
      input.placeholder = 'Mesaj yaz...';
    } else {
      input.disabled = true;
      sendBtn.disabled = true;
      input.placeholder = 'Chat izniniz yok';
    }
  } else {
    overlay.style.display = 'none';
  }
}

// Update Participants List
function updateParticipantsList() {
  if (!currentRoom) return;
  
  chrome.runtime.sendMessage({
    type: 'GET_ROOM_PARTICIPANTS',
    roomId: currentRoom.id
  }, (response) => {
    if (response.success) {
      const participantsList = document.getElementById('rt-participants-list');
      participantsList.innerHTML = response.participants.map(p => `
        <div class="rt-participant ${p.isOwner ? 'owner' : ''}">
          ${p.isOwner ? '👑' : '👤'} ${p.username}
        </div>
      `).join('');
    }
  });
}

// Toggle Overlay
function toggleOverlay() {
  overlay.classList.toggle('minimized');
}

// Send Message
function sendMessage() {
  const input = document.getElementById('rt-input');
  const message = input.value.trim();
  
  if (!message || !canChat) return;
  
  chrome.runtime.sendMessage({
    type: 'SEND_MESSAGE',
    message,
    videoTime: currentVideoElement ? currentVideoElement.currentTime : 0
  });
  
  input.value = '';
}

// Create Message Element
function createMessageElement(message) {
  const messageEl = document.createElement('div');
  messageEl.className = `rt-message ${message.isOwn ? 'own' : ''} ${message.isSystem ? 'system' : ''}`;
  
  if (message.isSystem) {
    messageEl.innerHTML = `
      <div class="rt-message-content">${message.content}</div>
    `;
  } else {
    messageEl.innerHTML = `
      <div class="rt-message-header">
        <div class="rt-message-author">${message.author}</div>
        <div class="rt-message-time">${formatTime(message.timestamp)}</div>
      </div>
      <div class="rt-message-content">${message.content}</div>
    `;
  }
  
  return messageEl;
}

// Show System Message
function showSystemMessage(text) {
  handleChatMessage({
    content: text,
    isSystem: true,
    timestamp: Date.now()
  });
}

// Show Sync Indicator
function showSyncIndicator(eventType) {
  let indicator = document.getElementById('rt-sync-indicator');
  
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'rt-sync-indicator';
    indicator.className = 'rt-sync-indicator';
    document.body.appendChild(indicator);
  }
  
  const eventNames = {
    play: '▶️ Oynatılıyor',
    pause: '⏸️ Duraklatıldı',
    seek: '⏩ İleri sarıldı',
    volume: '🔊 Ses değişti',
    urlChange: '📜 Video değişti'
  };
  
  indicator.textContent = eventNames[eventType] || 'Senkronize ediliyor...';
  indicator.classList.add('show');
  
  setTimeout(() => {
    indicator.classList.remove('show');
  }, 2000);
}

// Format Time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
