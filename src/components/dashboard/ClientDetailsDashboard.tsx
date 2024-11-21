import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import Calendar from 'react-calendar';
import type { Value } from 'react-calendar/dist/cjs/shared/types';
import 'react-calendar/dist/Calendar.css';
import { subscribeToClient } from '../../config/firebase';
import { type Client, type Project } from '../../types';

const ClientDetailsDashboard: React.FC = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [date, setDate] = useState<Value>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock projects data - replace with actual data from Firebase
  const projects: Project[] = [
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website',
      status: 'In Progress',
      lastUpdated: new Date().toISOString(),
      tasks: []
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'New mobile app for client services',
      status: 'Sourcing',
      lastUpdated: new Date().toISOString(),
      tasks: []
    }
  ];

  useEffect(() => {
    if (!clientId) return;

    const unsubscribe = subscribeToClient(
      clientId,
      (updatedClient) => {
        setClient(updatedClient);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching client:', error);
        setError('Failed to load client details');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading client details...</div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Client not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/clients')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-sm font-semibold rounded-full
          ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 
            client.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'}`}>
          {client.status}
        </span>
      </div>

      {/* Calendar Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Calendar</h3>
          <CalendarIcon className="w-5 h-5 text-gray-500" />
        </div>
        <Calendar
          onChange={(value: Value) => setDate(value)}
          value={date}
          className="w-full border-0"
        />
      </div>

      {/* Projects Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Projects</h2>
        </div>
        <div className="p-6">
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects yet</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-sm font-medium rounded-full
                      ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'Sourcing' ? 'bg-purple-100 text-purple-800' :
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Last Updated: {new Date(project.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsDashboard;
