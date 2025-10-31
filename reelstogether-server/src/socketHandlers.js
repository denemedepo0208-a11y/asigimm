import {
  createRoom,
  getRoomByCode,
  getRoomById,
  addParticipant,
  removeParticipant,
  getRoomParticipants,
  updateParticipantPermission,
  getPublicRooms,
  saveMessage,
  getRoomMessages,
  createJoinRequest,
  updateJoinRequestStatus
} from './roomManager.js';

// Store socket to room mapping
const socketRooms = new Map();
const roomSockets = new Map();

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    const username = socket.handshake.query.username;
    
    console.log(`User connected: ${username} (${userId})`);
    
    // Create Room
    socket.on('createRoom', async (roomData, callback) => {
      try {
        const room = await createRoom(roomData);
        
        // Join socket room
        socket.join(room.id);
        socketRooms.set(socket.id, room.id);
        
        if (!roomSockets.has(room.id)) {
          roomSockets.set(room.id, new Set());
        }
        roomSockets.get(room.id).add(socket.id);
        
        callback({
          success: true,
          room: {
            id: room.id,
            code: room.code,
            name: room.name,
            type: room.type,
            category: room.category,
            maxParticipants: room.max_participants,
            participants: 1,
            isOwner: true,
            permissions: { canChat: true, canScroll: true }
          }
        });
        
        // Emit to room
        socket.emit('roomJoined', {
          id: room.id,
          name: room.name,
          code: room.code,
          isOwner: true,
          permissions: { canChat: true, canScroll: true }
        });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });
    
    // Join Room
    socket.on('joinRoom', async ({ code, userId, username }, callback) => {
      try {
        const room = await getRoomByCode(code);
        
        if (!room) {
          callback({ success: false, error: 'Oda bulunamadı' });
          return;
        }
        
        // Check if room is full
        const participants = await getRoomParticipants(room.id);
        if (participants.length >= room.max_participants) {
          callback({ success: false, error: 'Oda dolu' });
          return;
        }
        
        // Add participant
        await addParticipant(room.id, userId, username);
        
        // Join socket room
        socket.join(room.id);
        socketRooms.set(socket.id, room.id);
        
        if (!roomSockets.has(room.id)) {
          roomSockets.set(room.id, new Set());
        }
        roomSockets.get(room.id).add(socket.id);
        
        const isOwner = room.owner_id === userId;
        
        callback({
          success: true,
          room: {
            id: room.id,
            code: room.code,
            name: room.name,
            type: room.type,
            category: room.category,
            maxParticipants: room.max_participants,
            participants: participants.length + 1,
            isOwner,
            permissions: { canChat: true, canScroll: !isOwner }
          }
        });
        
        // Emit to user
        socket.emit('roomJoined', {
          id: room.id,
          name: room.name,
          code: room.code,
          isOwner,
          permissions: { canChat: true, canScroll: !isOwner }
        });
        
        // Notify other participants
        socket.to(room.id).emit('participantJoined', {
          id: userId,
          username,
          isOwner
        });
        
        // Send chat history
        const messages = await getRoomMessages(room.id);
        messages.forEach(msg => {
          socket.emit('chatMessage', {
            author: msg.username,
            content: msg.content,
            timestamp: new Date(msg.created_at).getTime(),
            videoTime: msg.video_time,
            isOwn: msg.user_id === userId
          });
        });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });
    
    // Request Join (for public rooms)
    socket.on('requestJoin', async ({ roomId, userId, username }, callback) => {
      try {
        const room = await getRoomById(roomId);
        
        if (!room) {
          callback({ success: false, error: 'Oda bulunamadı' });
          return;
        }
        
        // Create join request
        const request = await createJoinRequest(roomId, userId, username);
        
        // Notify room owner
        const ownerSockets = Array.from(roomSockets.get(roomId) || []);
        ownerSockets.forEach(socketId => {
          io.to(socketId).emit('joinRequest', {
            id: request.id,
            roomId,
            userId,
            username
          });
        });
        
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });
    
    // Accept Join Request
    socket.on('acceptJoinRequest', async ({ requestId }, callback) => {
      try {
        const request = await updateJoinRequestStatus(requestId, 'accepted');
        
        // Add participant to room
        await addParticipant(request.room_id, request.user_id, request.username);
        
        // Notify requester (if online)
        io.emit('joinRequestAccepted', {
          requestId,
          roomId: request.room_id
        });
        
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });
    
    // Reject Join Request
    socket.on('rejectJoinRequest', async ({ requestId }, callback) => {
      try {
        await updateJoinRequestStatus(requestId, 'rejected');
        
        // Notify requester (if online)
        io.emit('joinRequestRejected', {
          requestId
        });
        
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });
    
    // Leave Room
    socket.on('leaveRoom', async ({ roomId, userId }, callback) => {
      try {
        await removeParticipant(roomId, userId);
        
        socket.leave(roomId);
        socketRooms.delete(socket.id);
        
        if (roomSockets.has(roomId)) {
          roomSockets.get(roomId).delete(socket.id);
        }
        
        // Notify other participants
        socket.to(roomId).emit('participantLeft', {
          id: userId,
          username
        });
        
        socket.emit('roomLeft');
        
        if (callback) callback({ success: true });
      } catch (error) {
        if (callback) callback({ success: false, error: error.message });
      }
    });
    
    // Get Public Rooms
    socket.on('getPublicRooms', async ({ search, category }, callback) => {
      try {
        const rooms = await getPublicRooms(search, category);
        callback({ success: true, rooms });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });
    
    // Get Room Participants
    socket.on('getRoomParticipants', async ({ roomId }, callback) => {
      try {
        const participants = await getRoomParticipants(roomId);
        callback({ success: true, participants });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });
    
    // Update Permission
    socket.on('updatePermission', async ({ roomId, userId, permission }, callback) => {
      try {
        const updatedPermissions = await updateParticipantPermission(roomId, userId, permission);
        
        // Notify affected user
        const targetSockets = Array.from(roomSockets.get(roomId) || []);
        targetSockets.forEach(socketId => {
          io.to(socketId).emit('permissionsUpdated', updatedPermissions);
        });
        
        if (callback) callback({ success: true });
      } catch (error) {
        if (callback) callback({ success: false, error: error.message });
      }
    });
    
    // Kick Participant
    socket.on('kickParticipant', async ({ roomId, userId }, callback) => {
      try {
        await removeParticipant(roomId, userId);
        
        // Find and disconnect the kicked user
        const targetSockets = Array.from(roomSockets.get(roomId) || []);
        targetSockets.forEach(socketId => {
          const targetSocket = io.sockets.sockets.get(socketId);
          if (targetSocket && targetSocket.handshake.query.userId === userId) {
            targetSocket.leave(roomId);
            targetSocket.emit('kicked');
            socketRooms.delete(socketId);
          }
        });
        
        // Notify other participants
        socket.to(roomId).emit('participantLeft', {
          id: userId,
          username: 'User'
        });
        
        if (callback) callback({ success: true });
      } catch (error) {
        if (callback) callback({ success: false, error: error.message });
      }
    });
    
    // Sync Event (play, pause, seek, etc.)
    socket.on('syncEvent', async ({ roomId, eventType, data }) => {
      // Broadcast to all other participants in the room
      socket.to(roomId).emit('syncEvent', eventType, data);
    });
    
    // Send Message
    socket.on('sendMessage', async ({ roomId, message, videoTime }) => {
      try {
        // Save message to database
        const savedMessage = await saveMessage(roomId, userId, username, message, videoTime);
        
        // Broadcast to all participants including sender
        io.to(roomId).emit('chatMessage', {
          author: username,
          content: message,
          timestamp: new Date(savedMessage.created_at).getTime(),
          videoTime,
          isOwn: false
        });
        
        // Send back to sender with isOwn flag
        socket.emit('chatMessage', {
          author: username,
          content: message,
          timestamp: new Date(savedMessage.created_at).getTime(),
          videoTime,
          isOwn: true
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });
    
    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${username} (${userId})`);
      
      const roomId = socketRooms.get(socket.id);
      if (roomId) {
        try {
          await removeParticipant(roomId, userId);
          
          // Notify other participants
          socket.to(roomId).emit('participantLeft', {
            id: userId,
            username
          });
          
          socketRooms.delete(socket.id);
          
          if (roomSockets.has(roomId)) {
            roomSockets.get(roomId).delete(socket.id);
          }
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      }
    });
  });
}
