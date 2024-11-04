import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, FileText, Mail, AlertCircle, CheckCircle,
  Clock, ArrowUp, ArrowRight, Search, Bell, User
} from 'lucide-react';

export default function Overview() {
  const [searchQuery, setSearchQuery] = useState('');

  const teamHighlights = [
    { name: 'Sarah', avatar: 'https://ui-avatars.com/api/?name=Sarah&background=eef2ff&color=3b82f6', status: 'online' },
    { name: 'Michael', avatar: 'https://ui-avatars.com/api/?name=Michael&background=eef2ff&color=3b82f6' },
    { name: 'Emily', avatar: 'https://ui-avatars.com/api/?name=Emily&background=eef2ff&color=3b82f6', status: 'online' },
    { name: 'David', avatar: 'https://ui-avatars.com/api/?name=David&background=eef2ff&color=3b82f6' },
    { name: 'Jessica', avatar: 'https://ui-avatars.com/api/?name=Jessica&background=eef2ff&color=3b82f6', status: 'online' }
  ];

  const monthlyStats = {
    totalValue: '1250k',
    lowestValue: '210k',
    highestValue: '764k',
    averageValue: '250k',
    graphData: [300, 420, 380, 470, 600, 550, 680, 500, 450]
  };

  return (
    <div className="space-y-6 p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Team Highlights */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Team Highlights</h2>
        <div className="flex space-x-4">
          {teamHighlights.map((member, index) => (
            <div key={index} className="relative">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              {member.status === 'online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Graph */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Project Statistics</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg">Monthly</button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Annual</button>
          </div>
        </div>
        
        <div className="h-64 relative">
          {/* Graph visualization */}
          <div className="absolute inset-0 flex items-end justify-between px-4">
            {monthlyStats.graphData.map((value, index) => (
              <div
                key={index}
                className="w-8 bg-blue-500 rounded-t-lg opacity-80 hover:opacity-100 transition-all"
                style={{ height: `${(value / 700) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-xl font-bold text-blue-600">{monthlyStats.totalValue}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Lowest Value</p>
            <p className="text-xl font-bold text-red-500">{monthlyStats.lowestValue}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Highest Value</p>
            <p className="text-xl font-bold text-green-500">{monthlyStats.highestValue}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Value</p>
            <p className="text-xl font-bold text-gray-900">{monthlyStats.averageValue}</p>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Schedule</h2>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-sm text-gray-600">
              {day}
            </div>
          ))}
          {Array.from({ length: 7 }).map((_, index) => (
            <button
              key={index}
              className={`p-2 rounded-lg text-center ${
                index === 2 ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
              }`}
            >
              {index + 5}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        <button className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left">
          <FileText className="w-6 h-6 text-blue-500 mb-2" />
          <h3 className="font-semibold">New Project</h3>
          <p className="text-sm text-gray-600">Create a new project</p>
        </button>
        <button className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left">
          <Mail className="w-6 h-6 text-blue-500 mb-2" />
          <h3 className="font-semibold">Messages</h3>
          <p className="text-sm text-gray-600">Check your inbox</p>
        </button>
        <button className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left">
          <Activity className="w-6 h-6 text-blue-500 mb-2" />
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm text-gray-600">View detailed reports</p>
        </button>
      </div>
    </div>
  );
}