-- Add event_type column to photos table
ALTER TABLE public.photos 
ADD COLUMN event_type text NOT NULL DEFAULT 'wedding';

-- Add check constraint for valid event types
ALTER TABLE public.photos 
ADD CONSTRAINT valid_event_type CHECK (event_type IN ('wedding', 'homecoming'));