import React, { useEffect, useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subscribeToAllClients, subscribeToAccessibleClients } from '../../config/firebase';
import { type Client } from '../../types';
import { useAuth } from '../../context/AuthContext';
import NewClientModal from './NewClientModal';
import EditClientModal from './EditClientModal';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = isAdmin
      ? subscribeToAllClients(
          (updatedClients: Client[]) => {
            setClients(updatedClients);
            setLoading(false);
          },
          (error: Error) => {
            console.error('Error fetching clients:', error);
            setError('Failed to load clients');
            setLoading(false);
          }
        )
      : subscribeToAccessibleClients(
          user.uid,
          (updatedClients: Client[]) => {
            setClients(updatedClients);
            setLoading(false);
          },
          (error: Error) => {
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

  const handleClientClick = (clientId: string) => {
    navigate(`/dashboard/clients/${clientId}`);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'All Clients' : 'Your Accessible Clients'}
        </h2>
        {isAdmin && (
          <button
            onClick={() => setShowNewClientModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Client
          </button>
        )}
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">
            {isAdmin 
              ? 'No clients found. Get started by adding your first client.'
              : 'No accessible clients found. Contact an admin to get access to projects.'}
          </h3>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {clients.map((client) => (
              <li 
                key={client.id}
                onClick={() => handleClientClick(client.id)}
                className="hover:bg-gray-50 cursor-pointer"
              >
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
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClient(client);
                          }}
                          className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                          title="Edit client"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

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
