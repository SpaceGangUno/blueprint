import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Download,
  Send,
  Check,
  Clock,
  Ban,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import { Invoice, Client } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { db, subscribeToAllClients } from '../../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import NewInvoiceModal from './NewInvoiceModal';
import { downloadInvoicePDF } from '../../utils/generateInvoicePDF';

const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, isAdmin } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !userProfile) {
      navigate('/login');
      return;
    }

    // Subscribe to invoices
    const invoicesQuery = query(
      collection(db, 'invoices'),
      isAdmin ? orderBy('createdAt', 'desc') : where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeInvoices = onSnapshot(
      invoicesQuery,
      (snapshot) => {
        const invoiceData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Invoice[];
        setInvoices(invoiceData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching invoices:', err);
        setError('Failed to load invoices');
        setLoading(false);
      }
    );

    // Subscribe to clients
    const unsubscribeClients = subscribeToAllClients(
      (clientsList) => {
        const clientsMap = clientsList.reduce<{ [key: string]: Client }>((acc, client) => {
          acc[client.id] = client;
          return acc;
        }, {});
        setClients(clientsMap);
      },
      (err) => {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients');
      }
    );

    return () => {
      unsubscribeInvoices();
      unsubscribeClients();
    };
  }, [user, userProfile, isAdmin, navigate]);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (invoiceId: string, newStatus: Invoice['status']) => {
    try {
      const invoiceRef = doc(db, 'invoices', invoiceId);
      await updateDoc(invoiceRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'paid' ? { paidAt: new Date().toISOString() } : {})
      });
    } catch (err) {
      console.error('Error updating invoice status:', err);
      setError('Failed to update invoice status');
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'invoices', invoiceId));
    } catch (err) {
      console.error('Error deleting invoice:', err);
      setError('Failed to delete invoice');
    }
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      await downloadInvoicePDF(invoice);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      setError('Failed to download invoice');
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button
          onClick={() => setShowNewInvoiceModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Invoice
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg pl-10"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {clients[invoice.clientId]?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${invoice.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleDownload(invoice)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Download PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    {invoice.status === 'draft' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(invoice.id, 'sent')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Sent"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {invoice.status === 'sent' && (
                      <button
                        onClick={() => handleStatusUpdate(invoice.id, 'paid')}
                        className="text-green-600 hover:text-green-900"
                        title="Mark as Paid"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    {invoice.status === 'sent' && (
                      <button
                        onClick={() => handleStatusUpdate(invoice.id, 'overdue')}
                        className="text-red-600 hover:text-red-900"
                        title="Mark as Overdue"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    )}
                    {(invoice.status === 'draft' || invoice.status === 'sent') && (
                      <button
                        onClick={() => handleStatusUpdate(invoice.id, 'cancelled')}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Cancel Invoice"
                      >
                        <Ban className="w-5 h-5" />
                      </button>
                    )}
                    {invoice.status === 'draft' && (
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNewInvoiceModal && (
        <NewInvoiceModal
          clients={clients}
          onClose={() => setShowNewInvoiceModal(false)}
          onInvoiceCreated={() => setShowNewInvoiceModal(false)}
        />
      )}
    </div>
  );
};

export default Invoices;
