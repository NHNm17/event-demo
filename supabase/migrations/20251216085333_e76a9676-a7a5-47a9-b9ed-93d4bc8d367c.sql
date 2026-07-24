-- Allow anyone to delete files from event-photos bucket
CREATE POLICY "Anyone can delete event photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'event-photos');