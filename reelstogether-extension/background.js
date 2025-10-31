// ReelsTogether Background Service Worker
import { io } from 'https://cdn.socket.io/4.5.4/socket.io.esm.min.js';

const SERVER_URL = 'http://localhost:3000';
let socket = null;
let currentUser = null;
let currentRoom = null;

// Initialize
chrome.runtime.onInstalled.addListener(() => {
  console.log('ReelsTogether: Extension installed');
});

// Listen for messages from popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep channel open for async response
});

// Handle Messages
async function handleMessage(message, sender, sendResponse) {
  switch (message.type) {
    case 'CONNECT_SERVER':
      await connectToServer(message.userId, message.username);
      sendResponse({ success: true });
      break;
      
    case 'CREATE_ROOM':
      createRoom(message.room, sendResponse);
      break;
      
    case 'JOIN_ROOM':
      joinRoom(message.code, message.userId, message.username, sendResponse);
      break;
      
    case 'REQUEST_JOIN':
      requestJoin(message.roomId, message.userId, message.username, sendResponse);
      break;
      
    case 'ACCEPT_JOIN_REQUEST':
      acceptJoinRequest(message.requestId, sendResponse);
      break;
      
    case 'REJECT_JOIN_REQUEST':
      rejectJoinRequest(message.requestId, sendResponse);
      break;
      
    case 'LEAVE_ROOM':
      leaveRoom(message.roomId, message.userId, sendResponse);
      break;
      
    case 'GET_PUBLIC_ROOMS':
      getPublicRooms(message.search, message.category, sendResponse);
      break;
      
    case 'GET_ROOM_PARTICIPANTS':
      getRoomParticipants(message.roomId, sendResponse);
      break;
      
    case 'UPDATE_PERMISSION':
      updatePermission(message.roomId, message.userId, message.permission, sendResponse);
      break;
      
    case 'KICK_PARTICIPANT':
      kickParticipant(message.roomId, message.userId, sendResponse);
      break;
      
    case 'SYNC_EVENT':
      syncEvent(message.eventType, message.data, sendResponse);
      break;
      
    case 'SEND_MESSAGE':
      sendMessage(message.message, message.videoTime, sendResponse);
      break;
  }
}

// Connect to Server
async function connectToServer(userId, username) {
  if (socket && socket.connected) {
    return;
  }
  
  currentUser = { id: userId, username };
  
  socket = io(SERVER_URL, {
    query: {
      userId,
      username
    }
  });
  
  socket.on('connect', () => {
    console.log('ReelsTogether: Connected to server');
    notifyConnectionStatus(true);
  });
  
  socket.on('disconnect', () => {
    console.log('ReelsTogether: Disconnected from server');
    notifyConnectionStatus(false);
  });
  
  socket.on('roomJoined', (room) => {
    currentRoom = room;
    notifyRoomJoined(room);
  });
  
  socket.on('roomLeft', () => {
    currentRoom = null;
    notifyRoomLeft();
  });
  
  socket.on('joinRequest', (request) => {
    notifyJoinRequest(request);
  });
  
  socket.on('syncEvent', (eventType, data) => {
    notifySyncEvent(eventType, data);
  });
  
  socket.on('chatMessage', (message) => {
    notifyChatMessage(message);
  });
  
  socket.on('permissionsUpdated', (permissions) => {
    notifyPermissionsUpdated(permissions);
  });
  
  socket.on('participantJoined', (participant) => {
    notifyParticipantJoined(participant);
  });
  
  socket.on('participantLeft', (participant) => {
    notifyParticipantLeft(participant);
  });
}

// Create Room
function createRoom(roomData, sendResponse) {
  if (!socket || !socket.connected) {
    sendResponse({ success: false, error: 'Sunucuya bağlı değil' });
    return;
  }
  
  socket.emit('createRoom', roomData, (response) => {
    sendResponse(response);
  });
}

// Join Room
function joinRoom(code, userId, username, sendResponse) {
  if (!socket || !socket.connected) {
    sendResponse({ success: false, error: 'Sunucuya bağlı değil' });
    return;
  }
  
  socket.emit('joinRoom', { code, userId, username }, (response) => {
    sendResponse(response);
  });
}

// Request Join
function requestJoin(roomId, userId, username, sendResponse) {
  if (!socket || !socket.connected) {
    sendResponse({ success: false, error: 'Sunucuya bağlı değil' });
    return;
  }
  
  socket.emit('requestJoin', { roomId, userId, username }, (response) => {
    sendResponse(response);
  });
}

// Accept Join Request
function acceptJoinRequest(requestId, sendResponse) {
  if (!socket || !socket.connected) {
    sendResponse({ success: false, error: 'Sunucuya bağlı değil' });
    return;
  }
  
  socket.emit('acceptJoinRequest', { requestId }, (response) => {
    sendResponse(response);
  });
}

// Reject Join Request
function rejectJoinRequest(requestId, sendResponse) {
  if (!socket || !socket.connected) {
    sendResponse({ success: false, error: 'Sunucuya bağlı değil' });
    return;
  }
  
  socket.emit('rejectJoinRequest', { requestId }, (response) => {
    sendResponse(response);
  });
}

// Leave Room
function leaveRoom(roomId, userId, sendResponse) {
  if (!socket || !socket.connected) {
    sendResponse({ success: false, error: 'Sunucuya bağlı değil' });
    return;
  }
  
  socket.emit('leaveRoom', { roomId, userId }, (response) => {
    sendResponse(response);
  });
}

// Get Public Rooms
function getPublicRooms(search, category, sendResponse) {
  if (!socket || !socket.connected) {
    sendResponse({ success: false, error: 'Sunucuya bağlı değil' });
    return;
  }
  
  socket.emit('getPublicRooms', { search, category }, (response) => {
    sendResponse(response);
  });
}

// Get Room Participants
function getRoomParticipants(roomId, sendResponse) {
  if (!socket || !socket.connected) {
    sendResponse({ success: false, error: 'Sunucuya bağlı değil' });
    return;
  }
  
  socket.emit('getRoomParticipants', { roomId }, (response) => {
    sendResponse(response);
  });
}

// Update Permission
function updatePermission(roomId, userId, permission, sendResponse) {
  if (!socket || !socket.connected) {
    sendResponse({ success: false, error: 'Sunucuya bağlı değil' });
    return;
  }
  
  socket.emit('updatePermission', { roomId, userId, permission }, (response) => {
    sendResponse(response);
  });
}

// Kick Participant
function kickParticipant(roomId, userId, sendResponse) {
  if (!socket || !socket.connected) {
    sendResponse({ success: false, error: 'Sunucuya bağlı değil' });
    return;
  }
  
  socket.emit('kickParticipant', { roomId, userId }, (response) => {
    sendResponse(response);
  });
}

// Sync Event
function syncEvent(eventType, data, sendResponse) {
  if (!socket || !socket.connected || !currentRoom) {
    return;
  }
  
  socket.emit('syncEvent', {
    roomId: currentRoom.id,
    eventType,
    data
  });
}

// Send Message
function sendMessage(message, videoTime, sendResponse) {
  if (!socket || !socket.connected || !currentRoom) {
    return;
  }
  
  socket.emit('sendMessage', {
    roomId: currentRoom.id,
    message,
    videoTime
  });
}

// Notification Functions
function notifyConnectionStatus(connected) {
  chrome.runtime.sendMessage({
    type: 'CONNECTION_STATUS',
    connected
  });
}

function notifyRoomJoined(room) {
  chrome.runtime.sendMessage({
    type: 'ROOM_JOINED',
    room
  });
  
  // Notify content script
  chrome.tabs.query({ url: 'https://www.instagram.com/*' }, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'ROOM_JOINED',
        room
      });
    });
  });
}

function notifyRoomLeft() {
  chrome.runtime.sendMessage({
    type: 'ROOM_LEFT'
  });
  
  // Notify content script
  chrome.tabs.query({ url: 'https://www.instagram.com/*' }, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'ROOM_LEFT'
      });
    });
  });
}

function notifyJoinRequest(request) {
  chrome.runtime.sendMessage({
    type: 'JOIN_REQUEST',
    request
  });
}

function notifySyncEvent(eventType, data) {
  // Notify content script
  chrome.tabs.query({ url: 'https://www.instagram.com/*' }, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'SYNC_EVENT',
        eventType,
        data
      });
    });
  });
}

function notifyChatMessage(message) {
  // Notify content script
  chrome.tabs.query({ url: 'https://www.instagram.com/*' }, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'CHAT_MESSAGE',
        message
      });
    });
  });
}

function notifyPermissionsUpdated(permissions) {
  // Notify content script
  chrome.tabs.query({ url: 'https://www.instagram.com/*' }, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'PERMISSIONS_UPDATED',
        permissions
      });
    });
  });
}

function notifyParticipantJoined(participant) {
  // Notify content script
  chrome.tabs.query({ url: 'https://www.instagram.com/*' }, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'PARTICIPANT_JOINED',
        participant
      });
    });
  });
}

function notifyParticipantLeft(participant) {
  // Notify content script
  chrome.tabs.query({ url: 'https://www.instagram.com/*' }, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'PARTICIPANT_LEFT',
        participant
      });
    });
  });
}
