-- Migration: Add expires_at and is_revoked to cases table
-- Milestone 3: Private patient links, configurable expiry, and access controls

ALTER TABLE cases ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS is_revoked BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_cases_expires_at ON cases(expires_at);
CREATE INDEX IF NOT EXISTS idx_cases_is_revoked ON cases(is_revoked);

