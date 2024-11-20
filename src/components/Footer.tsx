import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' }
  ];

  const serviceLinks = [
    { label: 'Project Consulting', href: '/services#consulting' },
    { label: 'Creative Design', href: '/services#design' },
    { label: 'Tech Integration', href: '/services#tech' },
    { label: 'Digital Innovation', href: '/services#innovation' }
  ];

  const legalLinks = [
    { label: 'Careers', href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">BS</span>
          </div>
          <span className="text-white font-semibold text-xl">Blueprint Studios</span>
        </div>

        {/* Contact Info */}
        <div className="mb-8 space-y-3">
          <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
          <a 
            href="mailto:contact@blueprintstudios.com" 
            className="flex items-center hover:text-blue-400 py-2"
          >
            <Mail className="w-5 h-5 mr-3" />
            <span className="text-base">contact@blueprintstudios.com</span>
          </a>
          <a 
            href="tel:+1-929-413-2940" 
            className="flex items-center hover:text-blue-400 py-2"
          >
            <Phone className="w-5 h-5 mr-3" />
            <span className="text-base">(929) 413-2940</span>
          </a>
          <div className="flex items-start py-2">
            <MapPin className="w-5 h-5 mr-3 mt-1" />
            <span className="text-base">85 Broad Street<br />New York, NY 10004</span>
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
          <ul className="space-y-3">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  to={link.href}
                  className="block text-base hover:text-blue-400 py-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-3">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  to={link.href}
                  className="block text-base hover:text-blue-400 py-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
          <ul className="space-y-3">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  to={link.href}
                  className="block text-base hover:text-blue-400 py-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Stay Updated</h3>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-base"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="hover:text-blue-400 transition-colors p-3">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors p-3">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors p-3">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors p-3">
            <Instagram className="w-6 h-6" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          © {currentYear} Blueprint Studios. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
