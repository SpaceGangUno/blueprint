import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db, type Client, subscribeToAllClients, subscribeToUserClients } from '../../config/firebase';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, isAdmin } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !userProfile) {
      navigate('/login');
      return;
    }

    const callback = (clientData: Client[]) => {
      setClients(clientData);
      setLoading(false);
    };

    const errorCallback = (error: Error) => {
      console.error('Error fetching clients:', error);
      setError('Failed to load clients');
      setLoading(false);
    };

    // Subscribe to clients based on user role
    const unsubscribe = isAdmin
      ? subscribeToAllClients(callback, errorCallback)
      : subscribeToUserClients(user.uid, callback, errorCallback);

    return () => unsubscribe();
  }, [user, userProfile, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Client Dashboard</h2>
        <button
          onClick={() => navigate('/clients/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Client
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/clients/${client.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                client.status === 'Active' ? 'bg-green-100 text-green-800' :
                client.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {client.status}
              </span>
            </div>
            {client.description && (
              <p className="text-gray-600 mb-4">{client.description}</p>
            )}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{client.email}</p>
              {client.phone && (
                <p className="text-sm text-gray-600">{client.phone}</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Projects: {client.projectCount || 0}</span>
                <span>Last Updated: {new Date(client.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No clients yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first client
          </p>
          <button
            onClick={() => navigate('/clients/new')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Client
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
