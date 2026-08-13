import { useState, useCallback } from "react";
import { Upload, Image, Camera, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhotoUploadProps {
  onUploadComplete: () => void;
  tableNumber?: string;
  eventType: 'wedding' | 'homecoming';
}

const PhotoUpload = ({ onUploadComplete, tableNumber, eventType }: PhotoUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [guestName, setGuestName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast.error("Only image files are allowed");
    }

    setSelectedFiles(prev => [...prev, ...imageFiles]);
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one photo");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload all files in parallel for faster performance
      const uploadPromises = selectedFiles.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${index}.${fileExt}`;
        const filePath = `${eventType}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('photos')
          .insert({
            file_name: file.name,
            file_path: filePath,
            table_number: tableNumber || null,
            guest_name: guestName || null,
            event_type: eventType
          });

        if (dbError) throw dbError;
        
        return filePath;
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      setUploadProgress(100);

      toast.success(
  "Photo uploaded successfully! 💍✨\nThank you for sharing your moment and for being part of our wedding day.",
  {
    position: "top-center",
    duration: 5000, // 5 seconds
    className: `
      !bg-black/90 backdrop-blur-md
      !text-white
      !border !border-white/20
      !rounded-2xl
      !shadow-[0_20px_40px_rgba(0,0,0,0.5)]
      text-center
      px-6 py-5
      max-w-md
    `,
    style: {
      marginTop: "35vh", // visually centered
      fontSize: "15px",
      fontWeight: "500",
      lineHeight: "1.6",
    },
  }
);

      setSelectedFiles([]);
      setPreviews([]);
      setGuestName("");
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload photos. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-display font-semibold text-foreground mb-2">
            Share Your Moments
          </h2>
          <p className="text-muted-foreground">
            Upload your favorite photos from today's celebration
          </p>
        </div>

        {/* Guest Name Input */}
        <div className="mb-6">
          <Label htmlFor="guestName" className="text-sm font-medium text-foreground mb-2 block">
            Your Name (Optional)
          </Label>
          <Input
            id="guestName"
            placeholder="Enter your name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="bg-background border-border focus:border-primary focus:ring-primary"
          />
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <label
  htmlFor="photo-upload"
  className="relative flex flex-col items-center justify-center w-full h-48 
             border-2 border-dashed border-yellow-400 
             rounded-xl bg-yellow-50/40 
             hover:bg-yellow-100/40 
             hover:border-yellow-500
             transition-all cursor-pointer group
             shadow-[0_0_12px_rgba(234,179,8,0.35)]"
>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <p className="mb-2 text-sm text-foreground">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, HEIC (Max 10MB each)</p>
            </div>
            <input
              id="photo-upload"
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Preview Grid */}
        {previews.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">
                {previews.length} photo{previews.length > 1 ? 's' : ''} selected
              </p>
              <button
                onClick={() => {
                  setSelectedFiles([]);
                  setPreviews([]);
                }}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden group animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-foreground/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-background" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || isUploading}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-elegant transition-all duration-300 disabled:opacity-50"
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Uploading...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Upload {selectedFiles.length > 0 ? `${selectedFiles.length} Photo${selectedFiles.length > 1 ? 's' : ''}` : 'Photos'}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PhotoUpload;
