-- Allow anyone to delete photos (for uploaders to remove their photos)
CREATE POLICY "Anyone can delete photos"
ON public.photos
FOR DELETE
USING (true);