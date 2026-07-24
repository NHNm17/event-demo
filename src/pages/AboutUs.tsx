import { Link } from "react-router-dom";
import { Mail, Phone, Linkedin } from "lucide-react";

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="relative max-w-3xl w-full bg-card border border-border/50 rounded-2xl p-8 shadow-soft">

        {/* Profile Photo (Right Corner) */}
        <img
          src="/Profile.jpg"
          alt="Profile"
          className="absolute top-6 right-6 h-24 w-24 rounded-full object-cover border border-border/50"
        />

        {/* Company Logo */}
        <img
          src="/company-logo-h.jpg"
          alt="Company Logo"
          className="h-20 mb-6 opacity-90"
        />

        {/* Name & Occupation */}
        <h1 className="text-2xl font-semibold text-foreground">
          Hiran Mendis
        </h1>
        <p className="text-muted-foreground mb-2">
          Full Stack Web Developer | UI/UX Designer
        </p>
        <p className="text-muted-foreground mb-6">
          Undergraduate student at SLIIT
        </p>

        {/* Contact Details */}
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+94 72 499 8153</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>projectsolution66@gmail.com</span>
          </div>

          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            <a
              href="https://www.linkedin.com/in/hiran-mendis-10270929a/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              LinkedIn Profile
            </a>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-8">
          <Link
            to="/"
            className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
