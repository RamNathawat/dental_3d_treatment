-- Migration: Add clinic_email to cases table
-- Allows storing the treating clinic or doctor email for 1-click dispatch of 3D progression links

ALTER TABLE cases ADD COLUMN IF NOT EXISTS clinic_email TEXT;

CREATE INDEX IF NOT EXISTS idx_cases_clinic_email ON cases(clinic_email);

