import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Target, Award, Briefcase, Heart, Coffee, Code, Zap, Sparkles } from 'lucide-react';

export default function About() {
  // Meta description for the About page
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const team = [
    {
      name: "Isaac Mazile",
      role: "Founder & Creative Director",
      bio: "With over 15 years of experience in digital design and strategy, Isaac leads our creative vision and innovation initiatives.",
      superpower: "Turning visions into reality",
      icon: Code
    },
    {
      name: "Juan Bayala-Cruz",
      role: "Marketing Director",
      bio: "A strategic thinker with expertise in digital marketing and brand growth, Juan drives our marketing initiatives and client success.",
      superpower: "Reading clients' minds",
      icon: Zap
    },
    {
      name: "Jasmine Zephyer",
      role: "Brand & Project Director",
      bio: "Bringing strategic vision and creative leadership to every project, Jasmine ensures exceptional brand experiences and project success.",
      superpower: "Making deadlines disappear",
      icon: Sparkles
    }
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Vision",
      description: "Transforming ideas into exceptional digital experiences that drive business growth and user engagement."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Excellence",
      description: "Committed to delivering the highest quality solutions through innovation and attention to detail."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaboration",
      description: "Working closely with our clients to understand their needs and exceed their expectations."
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Expertise",
      description: "Bringing years of industry experience and technical knowledge to every project."
    }
  ];

  const funFacts = [
    { number: 1337, label: "Cups of Coffee" },
    { number: 42, label: "Happy Clients" },
    { number: 73, label: "Projects Launched" },
    { number: 365, label: "Pizza Slices" }
  ];

  return (
    <div className="pt-16">
      <Helmet>
        <title>About Us | Blueprint Studios</title>
        <meta name="description" content="Meet the team behind Blueprint Studios. We're passionate creators, innovators, and problem solvers dedicated to bringing your digital vision to life through design and development." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-black/90 to-[#1E0B2C]">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.1
              }}
            >
              {i % 2 === 0 ? (
                <Heart className="w-6 h-6 text-white" />
              ) : (
                <Coffee className="w-6 h-6 text-white" />
              )}
            </div>
          ))}
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            We're Blueprint Studios
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            A team of passionate creators, innovators, and problem solvers dedicated to bringing your digital vision to life.
          </p>
        </div>
      </section>

      {/* Fun Facts Counter */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {funFacts.map((fact, index) => (
              <div
                key={index}
                className="text-center group"
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <div className="text-4xl md:text-5xl font-bold text-[#00E0FF] mb-2 transition-all duration-500">
                  {hoveredValue === index ? (
                    <span className="animate-bounce inline-block">🎉</span>
                  ) : fact.number}
                </div>
                <p className="text-gray-300">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[#1E0B2C]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="bg-gray-900 rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="relative">
                    <div className="w-24 h-24 bg-[#FF6B00]/10 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-all duration-300">
                      <member.icon className="w-12 h-12 text-[#FF6B00]" />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#FF6B00] rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2 text-white">{member.name}</h3>
                  <p className="text-[#FF6B00] text-center mb-4">{member.role}</p>
                  <p className="text-gray-300 text-center mb-4">{member.bio}</p>
                  <div className="text-center">
                    <span className="inline-block px-4 py-2 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full text-sm">
                      Superpower: {member.superpower}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group cursor-pointer"
              >
                <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-8 transition-all duration-300 hover:border-[#00E0FF] hover:shadow-xl">
                  <div className="w-16 h-16 bg-[#00E0FF]/10 rounded-xl flex items-center justify-center text-[#00E0FF] mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black via-black/90 to-[#1E0B2C] relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.1
              }}
            >
              <Heart className="w-8 h-8 text-white" />
            </div>
          ))}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to Start Your Project?
          </h2>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-[#FF6B00] text-white font-semibold rounded-xl hover:bg-[#E05A00] transition-all duration-300 transform hover:scale-105"
          >
            Let's Create Together
          </a>
        </div>
      </section>
    </div>
  );
}
