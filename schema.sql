-- Supabase Database Schema for Islamic Scholar Graph

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Scholars table
CREATE TABLE IF NOT EXISTS scholars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  birth_year INTEGER,
  death_year INTEGER,
  generation TEXT NOT NULL DEFAULT 'scholars',
  madhhab TEXT,
  region TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relationships table
CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES scholars(id) ON DELETE CASCADE,
  student_id UUID REFERENCES scholars(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'teacher' CHECK (type IN ('teacher', 'influence')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, student_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scholars_generation ON scholars(generation);
CREATE INDEX IF NOT EXISTS idx_scholars_madhhab ON scholars(madhhab);
CREATE INDEX IF NOT EXISTS idx_scholars_birth_year ON scholars(birth_year);
CREATE INDEX IF NOT EXISTS idx_relationships_teacher ON relationships(teacher_id);
CREATE INDEX IF NOT EXISTS idx_relationships_student ON relationships(student_id);

-- Insert sample data (core imams)
INSERT INTO scholars (name, birth_year, death_year, generation, madhhab) VALUES
  ('Abu Hanifa', 699, 767, 'imams', 'hanafi'),
  ('Malik ibn Anas', 711, 795, 'imams', 'maliki'),
  ('Al-Shafi''i', 767, 820, 'imams', 'shafii'),
  ('Ahmad ibn Hanbal', 780, 855, 'imams', 'hanbali')
ON CONFLICT DO NOTHING;

-- Insert relationships between imams
-- First get the IDs
WITH 
  abu_hanifa AS (SELECT id FROM scholars WHERE name = 'Abu Hanifa'),
  malik AS (SELECT id FROM scholars WHERE name = 'Malik ibn Anas'),
  al_shafii AS (SELECT id FROM scholars WHERE name = 'Al-Shafi''i'),
  ahmad AS (SELECT id FROM scholars WHERE name = 'Ahmad ibn Hanbal')
INSERT INTO relationships (teacher_id, student_id, type)
SELECT 
  malik.id,
  al_shafii.id,
  'teacher'
FROM malik, al_shafii
WHERE NOT EXISTS (
  SELECT 1 FROM relationships r 
  WHERE r.teacher_id = malik.id AND r.student_id = al_shafii.id
);

INSERT INTO relationships (teacher_id, student_id, type)
SELECT 
  al_shafii.id,
  ahmad.id,
  'teacher'
FROM al_shafii, ahmad
WHERE NOT EXISTS (
  SELECT 1 FROM relationships r 
  WHERE r.teacher_id = al_shafii.id AND r.student_id = ahmad.id
);