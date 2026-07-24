import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Images, X, ChevronLeft, ChevronRight, Trash2, Archive, CheckCircle2, Circle, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import JSZip from "jszip";

interface Photo {
  id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
  table_number: string | null;
  guest_name: string | null;
  event_type: string;
}

interface PhotoGalleryProps {
  refreshTrigger: number;
  eventType: 'wedding' | 'homecoming';
}

const PhotoGallery = ({ refreshTrigger, eventType }: PhotoGalleryProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Multi-select state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [deletingSelected, setDeletingSelected] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('event_type', eventType)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [refreshTrigger, eventType]);

  // Reset selection when event type changes
  useEffect(() => {
    setSelectMode(false);
    setSelectedPhotos(new Set());
  }, [eventType]);

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage.from('event-photos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDownload = async (photo: Photo) => {
    try {
      const { data, error } = await supabase.storage
        .from('event-photos')
        .download(photo.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = photo.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Photo downloaded!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download photo");
    }
  };

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;
    
    setDownloadingAll(true);
    const toastId = toast.loading(`Preparing ${photos.length} photos for download...`);
    
    try {
      const zip = new JSZip();
      
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        toast.loading(`Downloading ${i + 1} of ${photos.length}...`, { id: toastId });
        
        const { data, error } = await supabase.storage
          .from('event-photos')
          .download(photo.file_path);

        if (error) {
          console.error(`Failed to download ${photo.file_name}:`, error);
          continue;
        }

        zip.file(photo.file_name, data);
      }

      toast.loading("Creating ZIP file...", { id: toastId });
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eventType}-memories.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("All photos downloaded!", { id: toastId });
    } catch (error) {
      console.error('Download all error:', error);
      toast.error("Failed to download photos", { id: toastId });
    } finally {
      setDownloadingAll(false);
    }
  };

  const handleDelete = async (photo: Photo, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this photo?")) return;
    
    setDeletingId(photo.id);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('event-photos')
        .remove([photo.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;

      setPhotos(photos.filter(p => p.id !== photo.id));
      
      if (selectedPhoto?.id === photo.id) {
        closeLightbox();
      }
      
      toast.success("Photo deleted");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete photo");
    } finally {
      setDeletingId(null);
    }
  };

  // Multi-select functions
  const handleLongPressStart = useCallback((photoId: string) => {
    longPressTimer.current = setTimeout(() => {
      setSelectMode(true);
      setSelectedPhotos(new Set([photoId]));
    }, 500); // 500ms for long press
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const togglePhotoSelection = (photoId: string) => {
    if (!selectMode) return;
    
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map(p => p.id)));
    }
  };

  const cancelSelection = () => {
    setSelectMode(false);
    setSelectedPhotos(new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedPhotos.size === 0) return;
    
    const count = selectedPhotos.size;
    if (!confirm(`Are you sure you want to delete ${count} photo${count > 1 ? 's' : ''}? This action cannot be undone.`)) return;
    
    setDeletingSelected(true);
    const toastId = toast.loading(`Deleting ${count} photos...`);
    
    try {
      const photosToDelete = photos.filter(p => selectedPhotos.has(p.id));
      const filePaths = photosToDelete.map(p => p.file_path);
      const photoIds = photosToDelete.map(p => p.id);
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('event-photos')
        .remove(filePaths);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .in('id', photoIds);

      if (dbError) throw dbError;

      setPhotos(photos.filter(p => !selectedPhotos.has(p.id)));
      setSelectedPhotos(new Set());
      setSelectMode(false);
      
      toast.success(`${count} photos deleted!`, { id: toastId });
    } catch (error) {
      console.error('Delete selected error:', error);
      toast.error("Failed to delete photos", { id: toastId });
    } finally {
      setDeletingSelected(false);
    }
  };

  const openLightbox = (photo: Photo, index: number) => {
    if (selectMode) {
      togglePhotoSelection(photo.id);
      return;
    }
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (selectedIndex - 1 + photos.length) % photos.length
      : (selectedIndex + 1) % photos.length;
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="w-full py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
          <Images className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          No Photos Yet
        </h3>
        <p className="text-muted-foreground">
          Be the first to share a moment from the celebration!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-display font-semibold text-foreground">
              Captured Moments
            </h2>
            <p className="text-muted-foreground text-sm">
              {photos.length} photo{photos.length !== 1 ? 's' : ''} shared
              {selectMode && ` • ${selectedPhotos.size} selected`}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectMode ? (
              <>
                <Button
                  onClick={handleSelectAll}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  {selectedPhotos.size === photos.length ? "Deselect All" : "Select All"}
                </Button>
                <Button
                  onClick={handleDeleteSelected}
                  disabled={selectedPhotos.size === 0 || deletingSelected}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deletingSelected ? "Deleting..." : `Delete (${selectedPhotos.size})`}
                </Button>
                <Button
                  onClick={cancelSelection}
                  variant="ghost"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setSelectMode(true)}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Select
                </Button>
                <Button
                  onClick={handleDownloadAll}
                  disabled={downloadingAll}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {downloadingAll ? "Preparing..." : "Download All"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`relative aspect-square rounded-xl overflow-hidden group cursor-pointer animate-fade-in shadow-soft hover:shadow-elegant transition-all duration-300 ${
                selectMode && selectedPhotos.has(photo.id) ? 'ring-4 ring-primary' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => openLightbox(photo, index)}
              onMouseDown={() => handleLongPressStart(photo.id)}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={() => handleLongPressStart(photo.id)}
              onTouchEnd={handleLongPressEnd}
            >
              <img
                src={getPublicUrl(photo.file_path)}
                alt={photo.file_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Selection indicator */}
              {selectMode && (
                <div className="absolute top-2 left-2 z-10">
                  {selectedPhotos.has(photo.id) ? (
                    <CheckCircle2 className="w-6 h-6 text-primary fill-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-white/80" />
                  )}
                </div>
              )}
              
              {/* Delete button - only show when not in select mode */}
              {!selectMode && (
                <button
                  onClick={(e) => handleDelete(photo, e)}
                  disabled={deletingId === photo.id}
                  className="absolute top-2 right-2 w-8 h-8 bg-destructive/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-destructive"
                >
                  <Trash2 className="w-4 h-4 text-destructive-foreground" />
                </button>
              )}
              
              {!selectMode && (
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.guest_name && (
                    <span className="text-xs text-cream font-medium truncate max-w-[60%]">
                      {photo.guest_name}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(photo);
                    }}
                    className="w-8 h-8 bg-cream/90 rounded-full flex items-center justify-center hover:bg-cream transition-colors ml-auto"
                  >
                    <Download className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-cream/10 hover:bg-cream/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-6 h-6 text-cream" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('prev');
                }}
                className="absolute left-4 w-12 h-12 bg-cream/10 hover:bg-cream/20 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-cream" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('next');
                }}
                className="absolute right-4 w-12 h-12 bg-cream/10 hover:bg-cream/20 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-cream" />
              </button>
            </>
          )}

          <div 
            className="max-w-5xl max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getPublicUrl(selectedPhoto.file_path)}
              alt={selectedPhoto.file_name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent rounded-b-lg">
              <div className="flex items-center justify-between">
                <div>
                  {selectedPhoto.guest_name && (
                    <p className="text-cream font-medium">{selectedPhoto.guest_name}</p>
                  )}
                  <p className="text-cream/60 text-sm">
                    {new Date(selectedPhoto.uploaded_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDelete(selectedPhoto)}
                    disabled={deletingId === selectedPhoto.id}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    onClick={() => handleDownload(selectedPhoto)}
                    variant="secondary"
                    size="sm"
                    className="bg-cream/90 hover:bg-cream text-foreground"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
