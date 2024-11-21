import React from 'react';
import { Activity, FileText, Mail, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Overview: React.FC = () => {
  const { userProfile } = useAuth();

  const stats = [
    {
      title: 'Active Projects',
      value: '12',
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      change: '+2 this month'
    },
    {
      title: 'Documents',
      value: '34',
      icon: <FileText className="w-6 h-6 text-green-500" />,
      change: '+5 this week'
    },
    {
      title: 'Messages',
      value: '8',
      icon: <Mail className="w-6 h-6 text-yellow-500" />,
      change: '3 unread'
    },
    {
      title: 'Team Members',
      value: '6',
      icon: <User className="w-6 h-6 text-purple-500" />,
      change: '+1 this week'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {userProfile?.displayName || 'User'}</h2>
          <p className="text-gray-600">Here's what's happening with your projects today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
              <span className="text-sm text-gray-500">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm">New project created: Website Redesign</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm">Document uploaded: Project Timeline</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm">New message from Client</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mobile App Development</p>
                <p className="text-sm text-gray-500">Phase 1 Completion</p>
              </div>
              <span className="text-sm text-red-500">2 days left</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Client Presentation</p>
                <p className="text-sm text-gray-500">Project Review</p>
              </div>
              <span className="text-sm text-yellow-500">5 days left</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Website Launch</p>
                <p className="text-sm text-gray-500">Final Testing</p>
              </div>
              <span className="text-sm text-green-500">2 weeks left</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
