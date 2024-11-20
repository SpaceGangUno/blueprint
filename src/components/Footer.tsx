import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const column1Links = [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' }
  ];

  const column2Links = [
    { label: 'Project Consulting', href: '/services#consulting' },
    { label: 'Creative Design', href: '/services#design' },
    { label: 'Tech Integration', href: '/services#tech' },
    { label: 'Digital Innovation', href: '/services#innovation' }
  ];

  const column3Links = [
    { label: 'Careers', href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">BS</span>
              </div>
              <span className="text-white font-semibold">Blueprint Studios</span>
            </div>
            <ul className="space-y-2">
              {column1Links.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {column2Links.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm mb-4">
              <a href="mailto:contact@blueprintstudios.com" className="block hover:text-blue-400">
                <Mail className="w-4 h-4 inline mr-2" />
                contact@blueprintstudios.com
              </a>
              <a href="tel:+1-929-413-2940" className="block hover:text-blue-400">
                <Phone className="w-4 h-4 inline mr-2" />
                (929) 413-2940
              </a>
              <div className="flex">
                <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <span>85 Broad Street, New York, NY 10004</span>
              </div>
            </div>
            <ul className="space-y-2">
              {column3Links.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter and Social */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full sm:max-w-md">
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-gray-400">
          © {currentYear} Blueprint Studios. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
