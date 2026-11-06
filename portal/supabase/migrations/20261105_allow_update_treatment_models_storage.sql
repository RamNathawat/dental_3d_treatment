-- Migration: Allow authenticated users (doctors) to update files in treatment-models bucket
-- This enables updating manifest.json when saving IPR prescriptions or Doctor's Notes & Remarks.
-- Run this in the Supabase Dashboard -> SQL Editor for your project (yrjulcwnabnhgtqebrtn).

-- 1. Enable UPDATE on storage.objects for authenticated users on 'treatment-models'
CREATE POLICY "Allow authenticated updates on treatment-models"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'treatment-models')
WITH CHECK (bucket_id = 'treatment-models');

