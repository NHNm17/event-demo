const hearts = "/heart.png";
const petals = "/petal.png";
const sparkles = "/sparkle.png";

const WeddingDecorations = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 💖 Hearts */}
      {[...Array(10)].map((_, i) => (
        <img
          key={`heart-${i}`}
          src={hearts}
          className="heart absolute w-10 opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 6}s`,
          }}
        />
      ))}

      {/* 🌸 Petals */}
      {[...Array(10)].map((_, i) => (
        <img
          key={`petal-${i}`}
          src={petals}
          className="petal absolute w-10 opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 6}s`,
          }}
        />
      ))}

      {/* ✨ Sparkles */}
      {[...Array(14)].map((_, i) => (
        <img
          key={`sparkle-${i}`}
          src={sparkles}
          className="sparkle absolute w-4 opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
};

export default WeddingDecorations;
