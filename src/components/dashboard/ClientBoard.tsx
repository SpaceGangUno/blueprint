import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calendar, ArrowRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'On Hold' | 'Completed';
  lastActivity: string;
  projectCount: number;
}

export default function ClientBoard() {
  const [clients] = useState<Client[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      description: 'Global technology and innovation company',
      status: 'Active',
      lastActivity: '2024-03-15',
      projectCount: 2
    },
    {
      id: '2',
      name: 'Stellar Industries',
      description: 'Manufacturing and industrial solutions provider',
      status: 'On Hold',
      lastActivity: '2024-03-10',
      projectCount: 1
    }
  ]);

  const statusIcons = {
    'Active': <Clock className="w-5 h-5 text-blue-500" />,
    'On Hold': <AlertCircle className="w-5 h-5 text-yellow-500" />,
    'Completed': <CheckCircle className="w-5 h-5 text-green-500" />
  };

  const statusColors = {
    'Active': 'bg-blue-100 text-blue-800 border-blue-200',
    'On Hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Completed': 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Overview</h1>
          <p className="text-gray-600 mt-1">Manage and track your client relationships</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Filter
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
            New Client
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <Link
            key={client.id}
            to={`/dashboard/client/${client.id}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group-hover:border-blue-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-6 h-6 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {client.name}
                    </h3>
                  </div>
                  {statusIcons[client.status]}
                </div>
                <p className="text-gray-600 mb-6 line-clamp-2">{client.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Last active: {new Date(client.lastActivity).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    statusColors[client.status]
                  }`}>
                    {client.status}
                  </span>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {client.projectCount} {client.projectCount === 1 ? 'Project' : 'Projects'}
                </span>
                <span className="text-sm text-blue-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  View Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
