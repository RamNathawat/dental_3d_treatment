-- Migration: Add clinic_name and patient_id to cases table
-- Enables clinics to track unique patient IDs (preventing collision across patients with identical names)
-- and group/filter by clinic or practice name.

ALTER TABLE cases ADD COLUMN IF NOT EXISTS clinic_name TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS patient_id TEXT;

-- Create indexes for fast search across patient name, patient id, and clinic name
CREATE INDEX IF NOT EXISTS idx_cases_patient_name ON cases(patient_name);
CREATE INDEX IF NOT EXISTS idx_cases_patient_id ON cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_cases_clinic_name ON cases(clinic_name);

