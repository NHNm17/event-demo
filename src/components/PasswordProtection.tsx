import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PasswordProtectionProps {
  onAuthenticated: () => void;
}

// Owner password - in a real app this would be stored securely
const OWNER_PASSWORD = "Plm";

const PasswordProtection = ({ onAuthenticated }: PasswordProtectionProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    setTimeout(() => {
      if (password === OWNER_PASSWORD) {
        localStorage.setItem("gallery_authenticated", "true");
        toast.success("Welcome! Access granted.");
        onAuthenticated();
      } else {
        toast.error("Incorrect password. Please try again.");
      }
      setIsChecking(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border/50 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
            Protected Gallery
          </h1>
          <p className="text-muted-foreground mb-6">
            Enter the password to view and manage photos
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border focus:border-primary focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              disabled={!password || isChecking}
              className="w-full h-12 bg-gradient-blue hover:opacity-90 text-primary-foreground font-semibold"
            >
              {isChecking ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Access Gallery"
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6">
            Contact the event organizer for access
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
