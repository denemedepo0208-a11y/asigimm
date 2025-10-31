import { supabase } from '../config/supabase.js';

// In-memory cache for active rooms (for faster access)
const activeRooms = new Map();

// Generate room code
export function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create Room
export async function createRoom(roomData) {
  const code = generateRoomCode();
  const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const room = {
    id: roomId,
    code,
    name: roomData.name,
    type: roomData.type,
    category: roomData.category,
    max_participants: roomData.maxParticipants,
    owner_id: roomData.ownerId,
    owner_name: roomData.ownerName,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
  };
  
  // Save to Supabase
  const { data, error } = await supabase
    .from('rooms')
    .insert([room])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating room:', error);
    throw error;
  }
  
  // Add owner as participant
  await addParticipant(roomId, roomData.ownerId, roomData.ownerName, true);
  
  // Cache room
  activeRooms.set(roomId, {
    ...room,
    participants: new Map([[roomData.ownerId, {
      id: roomData.ownerId,
      username: roomData.ownerName,
      isOwner: true,
      permissions: { canChat: true, canScroll: true }
    }]])
  });
  
  return room;
}

// Get Room by Code
export async function getRoomByCode(code) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code)
    .single();
  
  if (error) {
    console.error('Error getting room:', error);
    return null;
  }
  
  return data;
}

// Get Room by ID
export async function getRoomById(roomId) {
  // Check cache first
  if (activeRooms.has(roomId)) {
    return activeRooms.get(roomId);
  }
  
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();
  
  if (error) {
    console.error('Error getting room:', error);
    return null;
  }
  
  return data;
}

// Add Participant
export async function addParticipant(roomId, userId, username, isOwner = false) {
  const participant = {
    room_id: roomId,
    user_id: userId,
    username,
    is_owner: isOwner,
    can_chat: true,
    can_scroll: !isOwner, // Owner always has scroll control
    joined_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('room_participants')
    .insert([participant])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding participant:', error);
    throw error;
  }
  
  // Update cache
  if (activeRooms.has(roomId)) {
    const room = activeRooms.get(roomId);
    room.participants.set(userId, {
      id: userId,
      username,
      isOwner,
      permissions: { canChat: true, canScroll: !isOwner }
    });
  }
  
  return data;
}

// Remove Participant
export async function removeParticipant(roomId, userId) {
  const { error } = await supabase
    .from('room_participants')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error removing participant:', error);
    throw error;
  }
  
  // Update cache
  if (activeRooms.has(roomId)) {
    const room = activeRooms.get(roomId);
    room.participants.delete(userId);
    
    // If no participants left, remove room
    if (room.participants.size === 0) {
      await deleteRoom(roomId);
    }
  }
}

// Get Room Participants
export async function getRoomParticipants(roomId) {
  const { data, error } = await supabase
    .from('room_participants')
    .select('*')
    .eq('room_id', roomId);
  
  if (error) {
    console.error('Error getting participants:', error);
    return [];
  }
  
  return data.map(p => ({
    id: p.user_id,
    username: p.username,
    isOwner: p.is_owner,
    permissions: {
      canChat: p.can_chat,
      canScroll: p.can_scroll
    }
  }));
}

// Update Participant Permission
export async function updateParticipantPermission(roomId, userId, permission) {
  const updateData = {};
  
  if (permission === 'canChat') {
    // Toggle chat permission
    const { data: current } = await supabase
      .from('room_participants')
      .select('can_chat')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single();
    
    updateData.can_chat = !current.can_chat;
  } else if (permission === 'canScroll') {
    // Toggle scroll permission
    const { data: current } = await supabase
      .from('room_participants')
      .select('can_scroll')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single();
    
    updateData.can_scroll = !current.can_scroll;
  }
  
  const { error } = await supabase
    .from('room_participants')
    .update(updateData)
    .eq('room_id', roomId)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
  
  // Update cache
  if (activeRooms.has(roomId)) {
    const room = activeRooms.get(roomId);
    const participant = room.participants.get(userId);
    if (participant) {
      participant.permissions = {
        ...participant.permissions,
        ...updateData
      };
    }
  }
  
  return updateData;
}

// Get Public Rooms
export async function getPublicRooms(search = '', category = '') {
  let query = supabase
    .from('rooms')
    .select('*, room_participants(count)')
    .eq('type', 'public');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error getting public rooms:', error);
    return [];
  }
  
  return data.map(room => ({
    id: room.id,
    name: room.name,
    category: room.category,
    participants: room.room_participants[0]?.count || 0,
    maxParticipants: room.max_participants
  }));
}

// Save Message
export async function saveMessage(roomId, userId, username, content, videoTime) {
  const message = {
    room_id: roomId,
    user_id: userId,
    username,
    content,
    video_time: videoTime,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }
  
  return data;
}

// Get Room Messages
export async function getRoomMessages(roomId, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error getting messages:', error);
    return [];
  }
  
  return data.reverse();
}

// Create Join Request
export async function createJoinRequest(roomId, userId, username) {
  const request = {
    room_id: roomId,
    user_id: userId,
    username,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('join_requests')
    .insert([request])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating join request:', error);
    throw error;
  }
  
  return data;
}

// Update Join Request Status
export async function updateJoinRequestStatus(requestId, status) {
  const { data, error } = await supabase
    .from('join_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating join request:', error);
    throw error;
  }
  
  return data;
}

// Delete Room
export async function deleteRoom(roomId) {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId);
  
  if (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
  
  // Remove from cache
  activeRooms.delete(roomId);
}

// Cleanup Expired Rooms
export async function cleanupExpiredRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select();
  
  if (error) {
    console.error('Error cleaning up rooms:', error);
    return;
  }
  
  // Remove from cache
  if (data) {
    data.forEach(room => activeRooms.delete(room.id));
  }
  
  console.log(`Cleaned up ${data?.length || 0} expired rooms`);
}

// Start cleanup interval (every 30 minutes)
setInterval(cleanupExpiredRooms, 30 * 60 * 1000);
