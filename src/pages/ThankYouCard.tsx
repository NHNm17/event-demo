import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, RotateCcw, Check, Download, Sparkles, SwitchCamera } from "lucide-react";

type Stage = "camera" | "review" | "card";
type FacingMode = "user" | "environment";

const ThankYouCard = () => {
  const [stage, setStage] = useState<Stage>("camera");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("user");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);

  // Start camera when entering the "camera" stage or when facingMode changes
  useEffect(() => {
    if (stage !== "camera") return;

    let isCancelled = false;

    const startCamera = async () => {
      // Stop any existing stream before requesting a new one
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
  }, [stage, facingMode]);

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Only mirror for front camera — back camera should capture unmirrored
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setPhotoDataUrl(dataUrl);

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    setStage("review");
  };

  const handleRetake = () => {
    setPhotoDataUrl(null);
    setStage("camera");
  };

  const handleDone = async () => {
    if (!photoDataUrl) return;
    await composeCard(photoDataUrl);
    setStage("card");
  };

  const composeCard = async (visitorPhotoUrl: string) => {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;

    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    ctx.fillStyle = "#fdfaf3";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#e8c98a";
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    const visitorImg = await loadImage(visitorPhotoUrl);
    const visitorArea = { x: 32, y: 32, w: width - 64, h: 700 };
    drawImageCover(ctx, visitorImg, visitorArea.x, visitorArea.y, visitorArea.w, visitorArea.h);

    ctx.fillStyle = "#fdfaf3";
    ctx.fillRect(0, visitorArea.y + visitorArea.h, width, 8);

    ctx.textAlign = "left";
    ctx.fillStyle = "#ec8b04";
    ctx.font = "italic 36px Georgia, serif";
    const lastLineY = wrapText(ctx, "Thank you for coming to our wedding!", 48, 780, 380, 42);

    // Date line — smaller, non-italic, sits below the thank-you text
    ctx.font = "24px Georgia, serif";
    ctx.fillStyle = "#b78f53";
    ctx.fillText("Date: 08th Jan 2026", 48, lastLineY + 36);

    try {
      const coupleImg = await loadImage("/hero.jpg");
      const coupleSize = 350;
      const coupleX = width - coupleSize - 30;
      const coupleY = height - coupleSize - 30;

      ctx.save();
      ctx.beginPath();
      ctx.arc(coupleX + coupleSize / 2, coupleY + coupleSize / 2, coupleSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      drawImageCover(ctx, coupleImg, coupleX, coupleY, coupleSize, coupleSize);
      ctx.restore();

      ctx.strokeStyle = "#e8c98a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(coupleX + coupleSize / 2, coupleY + coupleSize / 2, coupleSize / 2, 0, Math.PI * 2);
      ctx.stroke();
    } catch {
      // hero.jpg failed to load — skip silently
    }

    setCardDataUrl(canvas.toDataURL("image/png"));
  };

  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const imgRatio = img.width / img.height;
    const boxRatio = w / h;
    let sx, sy, sw, sh;

    if (imgRatio > boxRatio) {
      sh = img.height;
      sw = sh * boxRatio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / boxRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  };

    const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
    ): number => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (const word of words) {
        const testLine = line + word + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && line !== "") {
        ctx.fillText(line, x, currentY);
        line = word + " ";
        currentY += lineHeight;
        } else {
        line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);

    return currentY;
    };

  const handleDownload = () => {
    if (!cardDataUrl) return;
    const link = document.createElement("a");
    link.href = cardDataUrl;
    link.download = "thank-you-card.png";
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(44_100%_95%),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(199_90%_92%),transparent_28%),linear-gradient(180deg,hsl(40_50%_98%),hsl(40_35%_95%))] px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-soft backdrop-blur transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-800">
          <Sparkles className="h-4 w-4" />
          Thank You Card
        </div>

        <div className="mt-6 w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur">
          {stage === "camera" && (
            <div className="flex flex-col items-center gap-4">
              {cameraError ? (
                <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{cameraError}</p>
              ) : (
                <div className="relative w-full overflow-hidden rounded-2xl bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full rounded-2xl ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
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
              <button
                onClick={handleCapture}
                disabled={!!cameraError}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-40"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </button>
            </div>
          )}

          {stage === "review" && photoDataUrl && (
            <div className="flex flex-col items-center gap-4">
              <img src={photoDataUrl} alt="Captured" className="w-full rounded-2xl" />
              <div className="flex gap-3">
                <button
                  onClick={handleRetake}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-transform hover:-translate-y-0.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retake
                </button>
                <button
                  onClick={handleDone}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-400 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
                >
                  <Check className="h-4 w-4" />
                  Done
                </button>
              </div>
            </div>
          )}

          {stage === "card" && cardDataUrl && (
            <div className="flex flex-col items-center gap-4">
              <img src={cardDataUrl} alt="Thank you card" className="w-full max-w-sm rounded-2xl shadow-elegant" />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCardDataUrl(null);
                    setPhotoDataUrl(null);
                    setStage("camera");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-transform hover:-translate-y-0.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Start Over
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" />
                  Download Card
                </button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={captureCanvasRef} className="hidden" />
        <canvas ref={cardCanvasRef} className="hidden" />
      </div>
    </main>
    <footer className="py-8 border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 text-center space-y-2">
            
            <p className="text-sm text-muted-foreground font-light">
            The Wedding of | Mr ❤︎ Mrs
            </p>

            {/* Created By */}
            <Link
                to="https://www.antwix.lk"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Developed By:</span>
            <img
                src="/logo-removebg.png"
                alt="Company Logo"
                className="h-10 w-10 opacity-80"
            />
            </div>
            </Link>
        </div>
    </footer>
    </div>
  );
};

export default ThankYouCard;