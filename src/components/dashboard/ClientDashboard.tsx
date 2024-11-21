import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { type Client, subscribeToAllClients, subscribeToUserClients } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import NewClientModal from './NewClientModal';

const ClientDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

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
                    <div className="ml-4 flex-shrink-0">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          client.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {client.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">Projects:</span>
                      <span className="font-medium">{client.projectCount}</span>
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
    </div>
  );
};

export default ClientDashboard;
