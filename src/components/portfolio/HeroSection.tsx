interface HeroSectionProps {
  title: string;
  subtitle: string;
  image: string;
}

export default function HeroSection({ title, subtitle, image }: HeroSectionProps) {
  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt="Portfolio hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-600/50" />
      </div>
      
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
        <p className="text-xl text-blue-50 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}