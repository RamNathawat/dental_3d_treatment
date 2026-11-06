-- Migration: Add ipr and doctor_notes JSONB columns to cases table
-- Provides resilient database persistence for IPR prescriptions and Doctor's Notes,
-- so they load instantly in the 3D viewer with zero cache delays and independently of storage bucket RLS.

ALTER TABLE cases ADD COLUMN IF NOT EXISTS ipr JSONB DEFAULT '[]'::jsonb;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS doctor_notes JSONB;

-- Index for cases with IPR planned
CREATE INDEX IF NOT EXISTS idx_cases_has_ipr ON cases USING gin (ipr);

