import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  Layout, Grid, MessageSquare, Users, Settings, LogOut,
  Activity
} from 'lucide-react';
import Overview from '../components/dashboard/Overview';
import ClientBoard from '../components/dashboard/ClientBoard';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import ProjectDetails from '../components/dashboard/ProjectDetails';
import Messages from '../components/dashboard/Messages';
import TeamView from '../components/dashboard/TeamView';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isAdmin = true; // In a real app, this would come from auth context

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm fixed w-full z-40">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-900"
            >
              <Layout className="w-6 h-6" />
            </button>
            <div className="ml-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">BS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="flex flex-col h-full p-4">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Activity className="w-5 h-5" />
            <span>Overview</span>
          </Link>
          <Link
            to="/dashboard/clients"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Grid className="w-5 h-5" />
            <span>Clients</span>
          </Link>
          <Link
            to="/dashboard/messages"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </Link>
          {isAdmin && (
            <Link
              to="/dashboard/team"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Users className="w-5 h-5" />
              <span>Team</span>
            </Link>
          )}
          <div className="flex-grow" />
          <Link
            to="/dashboard/settings"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <button className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-200 ease-in-out`}>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/clients" element={<ClientBoard />} />
            <Route path="/client/:clientId" element={<ClientDashboard />} />
            <Route path="/client/:clientId/project/:projectId/*" element={<ProjectDetails />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/team" element={<TeamView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
