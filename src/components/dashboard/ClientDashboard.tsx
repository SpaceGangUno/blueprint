import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Calendar as CalendarIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import type { Value } from 'react-calendar/dist/cjs/shared/types';
import 'react-calendar/dist/Calendar.css';
import { type Client, subscribeToAllClients, subscribeToUserClients } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import NewClientModal from './NewClientModal';
import EditClientModal from './EditClientModal';

interface Project {
  id: string;
  name: string;
  status: string;
  dueDate: string;
  description?: string;
}

const ClientDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [date, setDate] = useState<Value>(new Date());

  // Mock projects data - replace with actual data from Firebase
  const mockProjects: { [clientId: string]: Project[] } = {
    'client1': [
      {
        id: '1',
        name: 'Website Redesign',
        status: 'In Progress',
        dueDate: '2024-03-01',
        description: 'Complete overhaul of company website'
      },
      {
        id: '2',
        name: 'Mobile App Development',
        status: 'Planning',
        dueDate: '2024-04-15',
        description: 'New mobile app for client services'
      }
    ]
  };

  useEffect(() => {
    if (!user) return;

    const unsubscribe = isAdmin
      ? subscribeToAllClients(
          (updatedClients) => {
            setClients(updatedClients);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching clients:', error);
            setError('Failed to load clients');
            setLoading(false);
          }
        )
      : subscribeToUserClients(
          user.uid,
          (updatedClients) => {
            setClients(updatedClients);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching clients:', error);
            setError('Failed to load clients');
            setLoading(false);
          }
        );

    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleClientCreated = () => {
    setShowNewClientModal(false);
  };

  const handleClientUpdated = () => {
    setSelectedClient(null);
  };

  const handleDateChange = (value: Value) => {
    setDate(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Calendar</h3>
          <CalendarIcon className="w-5 h-5 text-gray-500" />
        </div>
        <Calendar
          onChange={handleDateChange}
          value={date}
          className="w-full border-0"
        />
      </div>

      {/* Clients Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
          <button
            onClick={() => setShowNewClientModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Client
          </button>
        </div>

        {clients.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first client.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {clients.map((client) => (
                <li key={client.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {client.name}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{client.email}</span>
                          {client.phone && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{client.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-3">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            client.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {client.status}
                        </span>
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                          title="Edit client"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Projects Section */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Projects</h4>
                      {mockProjects[client.id] ? (
                        <div className="space-y-3">
                          {mockProjects[client.id].map((project) => (
                            <div key={project.id} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900">{project.name}</h5>
                                  <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full
                                  ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                    project.status === 'Planning' ? 'bg-purple-100 text-purple-800' :
                                    project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                                  {project.status}
                                </span>
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Due: {new Date(project.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No projects yet</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showNewClientModal && (
        <NewClientModal
          onClose={() => setShowNewClientModal(false)}
          onClientCreated={handleClientCreated}
        />
      )}

      {selectedClient && (
        <EditClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onClientUpdated={handleClientUpdated}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
