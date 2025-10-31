import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Schema Setup
export async function setupDatabase() {
  console.log('Setting up database schema...');
  
  // Note: These tables should be created in Supabase dashboard or via SQL
  // This is just documentation of the schema
  
  /*
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  
  -- Rooms table
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('public', 'private')),
    category TEXT,
    max_participants INTEGER NOT NULL,
    owner_id TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
  );
  
  -- Room participants table
  CREATE TABLE IF NOT EXISTS room_participants (
    id SERIAL PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    is_owner BOOLEAN DEFAULT FALSE,
    can_chat BOOLEAN DEFAULT TRUE,
    can_scroll BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(room_id, user_id)
  );
  
  -- Messages table
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    video_time FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
  );
  
  -- Join requests table
  CREATE TABLE IF NOT EXISTS join_requests (
    id SERIAL PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT NOW()
  );
  
  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(type);
  CREATE INDEX IF NOT EXISTS idx_rooms_category ON rooms(category);
  CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON room_participants(room_id);
  CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
  CREATE INDEX IF NOT EXISTS idx_join_requests_room_id ON join_requests(room_id);
  */
  
  console.log('Database schema documentation ready. Please create tables in Supabase dashboard.');
}
