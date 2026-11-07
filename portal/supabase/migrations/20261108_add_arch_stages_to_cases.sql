-- Migration: Add upper_stages and lower_stages to cases table
-- Tracks the exact number of aligner stages/trays for upper and lower arches,
-- clearly distinguishing equal dual-arch treatments from unequal dual-arch cases.

ALTER TABLE cases ADD COLUMN IF NOT EXISTS upper_stages INTEGER;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS lower_stages INTEGER;

CREATE INDEX IF NOT EXISTS idx_cases_upper_stages ON cases(upper_stages);
CREATE INDEX IF NOT EXISTS idx_cases_lower_stages ON cases(lower_stages);

