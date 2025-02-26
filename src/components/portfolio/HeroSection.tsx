interface HeroSectionProps {
  title: string;
  subtitle: string;
  image: string;
  imageAlt?: string;
}

export default function HeroSection({ title, subtitle, image, imageAlt }: HeroSectionProps) {
  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 opacity-30">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/30 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt={imageAlt || `${title} - ${subtitle}`}
          className="w-full h-full object-cover scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-600/60 animate-gradient" />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-slide-down">
          {title.split('').map((char, index) => (
            <span 
              key={index} 
              className="inline-block"
              style={{ 
                animationDelay: `${index * 0.05}s`,
                animationDuration: '0.5s',
                animationFillMode: 'both',
                animationName: 'slideDown'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        <p className="text-xl text-blue-50 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.5s' }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}
