import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo and Tagline */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">BS</span>
            </div>
            <span className="text-white font-semibold text-2xl">Blueprint Studios</span>
          </div>
          <p className="text-lg text-gray-300">
            Full-service consulting and creative studio focused on transforming ideas into exceptional digital experiences
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h3 className="text-white font-bold text-2xl mb-6">Quick Links</h3>
          <nav className="flex flex-col space-y-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-xl hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div className="mb-12">
          <h3 className="text-white font-bold text-2xl mb-6">Contact</h3>
          <div className="space-y-4">
            <div className="flex justify-center">
              <MapPin className="w-6 h-6 mr-2" />
              <span className="text-lg">85 Broad Street, New York, NY 10004</span>
            </div>
            <a 
              href="mailto:contact@blueprintstudios.com"
              className="flex justify-center items-center hover:text-blue-400 transition-colors"
            >
              <Mail className="w-6 h-6 mr-2" />
              <span className="text-lg">contact@blueprintstudios.com</span>
            </a>
            <a 
              href="tel:+1-929-413-2940"
              className="flex justify-center items-center hover:text-blue-400 transition-colors"
            >
              <Phone className="w-6 h-6 mr-2" />
              <span className="text-lg">(929) 413-2940</span>
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-8">
          <h3 className="text-white font-bold text-2xl mb-6">Follow Us</h3>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-blue-400 transition-colors p-2">
              <Facebook className="w-8 h-8" />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors p-2">
              <Twitter className="w-8 h-8" />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors p-2">
              <Linkedin className="w-8 h-8" />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors p-2">
              <Instagram className="w-8 h-8" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-gray-400 text-base">
          © {currentYear} Blueprint Studios. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
