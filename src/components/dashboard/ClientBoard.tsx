import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calendar, ArrowRight, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { addClient, getClients } from '../../config/firebase';

interface Client {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'On Hold' | 'Completed';
  lastActivity: string;
  projectCount: number;
}

type ClientStatus = 'Active' | 'On Hold' | 'Completed';

interface NewClientForm {
  name: string;
  description: string;
  status: ClientStatus;
}

export default function ClientBoard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClient, setNewClient] = useState<NewClientForm>({
    name: '',
    description: '',
    status: 'Active'
  });
  const [filterStatus, setFilterStatus] = useState<'all' | ClientStatus>('all');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const fetchedClients = await getClients();
      setClients(fetchedClients as Client[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addClient(newClient);
      if (result.success) {
        await fetchClients(); // Refresh the client list
        setShowNewClientModal(false);
        setNewClient({ name: '', description: '', status: 'Active' });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredClients = filterStatus === 'all' 
    ? clients 
    : clients.filter(client => client.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Overview</h1>
          <p className="text-gray-600 mt-1">Manage and track your client relationships</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | ClientStatus)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <option value="all">All Clients</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
          <button 
            onClick={() => setShowNewClientModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            New Client
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
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

      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Client</h2>
              <button
                onClick={() => setShowNewClientModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleNewClient}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newClient.description}
                    onChange={(e) => setNewClient({...newClient, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newClient.status}
                    onChange={(e) => setNewClient({...newClient, status: e.target.value as ClientStatus})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
