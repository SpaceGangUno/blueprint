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
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">BS</span>
          </div>
          <span className="text-white font-semibold text-2xl">Blueprint Studios</span>
        </div>

        {/* Newsletter - Moved up */}
        <div className="mb-10">
          <h3 className="text-white font-bold text-xl mb-4">Stay Updated</h3>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white text-base"
            />
            <button
              type="submit"
              className="w-full px-4 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-base font-semibold"
            >
              Subscribe to Newsletter
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <h3 className="text-white font-bold text-xl mb-4">Contact</h3>
          <div className="space-y-4">
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
        </div>

        {/* Social Links - Moved up */}
        <div className="flex justify-center space-x-8 mb-10">
          <a href="#" className="hover:text-blue-400 transition-colors p-3">
            <Facebook className="w-7 h-7" />
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors p-3">
            <Twitter className="w-7 h-7" />
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors p-3">
            <Linkedin className="w-7 h-7" />
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors p-3">
            <Instagram className="w-7 h-7" />
          </a>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid gap-8">
            {/* Services */}
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Services</h3>
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
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Company</h3>
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
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Legal</h3>
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
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          © {currentYear} Blueprint Studios. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
