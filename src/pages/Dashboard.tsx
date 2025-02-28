import React from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import ClientDetailsDashboard from '../components/dashboard/ClientDetailsDashboard';
import TeamView from '../components/dashboard/TeamView';
import Overview from '../components/dashboard/Overview';
import Invoices from '../components/dashboard/Invoices';
import PermissionsManager from '../components/dashboard/PermissionsManager';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/clients/')) return 'clients';
    if (path.includes('/team')) return 'team';
    if (path.includes('/invoices')) return 'invoices';
    if (path.includes('/permissions')) return 'permissions';
    if (path === '/dashboard') return 'overview';
    return '';
  };

  const activeTab = getActiveTab();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Dashboard | Blueprint Studios</title>
        <meta name="description" content="Access your Blueprint Studios client dashboard. Manage projects, view team updates, track invoices, and collaborate with our creative team." />
      </Helmet>
      <nav className="bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-[#FF6B00]">Blueprint Studios</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className={`${
                    activeTab === 'overview'
                      ? 'border-[#FF6B00] text-white'
                      : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Overview
                </Link>
                <Link
                  to="/dashboard/clients"
                  className={`${
                    activeTab === 'clients'
                      ? 'border-[#FF6B00] text-white'
                      : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Clients
                </Link>
                <Link
                  to="/dashboard/team"
                  className={`${
                    activeTab === 'team'
                      ? 'border-[#FF6B00] text-white'
                      : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Team
                </Link>
                <Link
                  to="/dashboard/invoices"
                  className={`${
                    activeTab === 'invoices'
                      ? 'border-[#FF6B00] text-white'
                      : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Invoices
                </Link>
                {isAdmin && (
                  <Link
                    to="/dashboard/permissions"
                    className={`${
                      activeTab === 'permissions'
                        ? 'border-[#FF6B00] text-white'
                        : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Permissions
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  // Handle logout
                  navigate('/login');
                }}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF6B00] hover:bg-[#E05A00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/clients" element={<ClientDashboard />} />
            <Route path="/clients/:clientId" element={<ClientDetailsDashboard />} />
            <Route path="/team" element={<TeamView />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/permissions" element={<PermissionsManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
