import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, Image, Camera, X, Check, SwitchCamera, RotateCcw } from "lucide-react";
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

type FacingMode = "user" | "environment";

const PhotoUpload = ({ onUploadComplete, tableNumber, eventType }: PhotoUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [guestName, setGuestName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);

  // Start/stop camera whenever the camera panel opens or facing mode changes
  useEffect(() => {
    if (!isCameraOpen) return;

    let isCancelled = false;

    const startCamera = async () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraError(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setCameraError("Camera access denied or unavailable. Please allow camera permissions.");
      }
    };

    startCamera();

    return () => {
      isCancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [isCameraOpen, facingMode]);

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

  const openCamera = () => {
    setCameraError(null);
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror only for front camera, matching the mirrored preview
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" });

      setSelectedFiles(prev => [...prev, file]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }, "image/jpeg", 0.92);

    // Keep camera open so guests can snap multiple photos in a row
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

        {/* Camera panel (shown when open) */}
        {isCameraOpen && (
          <div className="mb-6 rounded-xl border border-border/50 bg-black/5 p-3">
            {cameraError ? (
              <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{cameraError}</p>
            ) : (
              <div className="relative w-full overflow-hidden rounded-lg bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full rounded-lg ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
                />
                <button
                  onClick={handleFlipCamera}
                  className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/70"
                >
                  <SwitchCamera className="h-4 w-4" />
                  Flip
                </button>
              </div>
            )}

            <div className="mt-3 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeCamera}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button
                type="button"
                onClick={handleCapturePhoto}
                disabled={!!cameraError}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>
        )}

        {/* Upload options — 2 column grid: gallery upload + camera capture */}
        {!isCameraOpen && (
          <div className="mb-6 grid grid-cols-2 gap-3">
            <label
              htmlFor="photo-upload"
              className="relative flex flex-col items-center justify-center h-40
                         border-2 border-dashed border-yellow-400
                         rounded-xl bg-yellow-50/40
                         hover:bg-yellow-100/40
                         hover:border-yellow-500
                         transition-all cursor-pointer group
                         shadow-[0_0_12px_rgba(234,179,8,0.35)]"
            >
              <div className="flex flex-col items-center justify-center px-3 text-center">
                <Upload className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Choose Photos</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, HEIC (Max 10MB)</p>
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

            <button
              type="button"
              onClick={openCamera}
              disabled={isUploading}
              className="relative flex flex-col items-center justify-center h-40
                         border-2 border-dashed border-sky-400
                         rounded-xl bg-sky-50/40
                         hover:bg-sky-100/40
                         hover:border-sky-500
                         transition-all cursor-pointer group
                         shadow-[0_0_12px_rgba(56,189,248,0.35)]
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center justify-center px-3 text-center">
                <Camera className="w-8 h-8 text-sky-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Take a Photo</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Use your camera</p>
              </div>
            </button>
          </div>
        )}

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

        {/* Hidden canvas used only for camera capture */}
        <canvas ref={captureCanvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default PhotoUpload;