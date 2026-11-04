-- Migration: Add seller2_email column to shared_links
-- This column stores an optional secondary seller email address.
-- The ALTER TABLE was already run directly on the Supabase instance;
-- this file exists for version-control / local dev parity.

ALTER TABLE shared_links ADD COLUMN IF NOT EXISTS seller2_email TEXT;
