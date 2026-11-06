-- Migration: Add patient_age and patient_sex to cases table
-- Records patient age (in years) and biological sex / gender for basic clinical orthodontic record-keeping.

ALTER TABLE cases ADD COLUMN IF NOT EXISTS patient_age INTEGER;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS patient_sex TEXT;

-- Create indexes for filtering if needed
CREATE INDEX IF NOT EXISTS idx_cases_patient_age ON cases(patient_age);
CREATE INDEX IF NOT EXISTS idx_cases_patient_sex ON cases(patient_sex);

