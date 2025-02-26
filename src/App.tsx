import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import TeamInvite from './pages/TeamInvite';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col relative overflow-hidden">
          {/* Global animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-blue-400/30 animate-float"
                style={{
                  width: `${Math.random() * 200 + 50}px`,
                  height: `${Math.random() * 200 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 20 + 15}s`,
                  animationDelay: `${Math.random() * 10}s`
                }}
              />
            ))}
          </div>
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/team-invite" element={<TeamInvite />} />
            <Route
              path="/*"
              element={
                <>
                  <Navigation />
                  <main className="flex-grow relative z-10">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/contact" element={<Contact />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
