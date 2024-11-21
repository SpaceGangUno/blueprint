import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  Download,
  Send,
  MoreHorizontal,
  DollarSign,
  Calendar,
  Building2
} from 'lucide-react';
import { Invoice, Client } from '../../types';
import { db, auth } from '../../config/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  DocumentData
} from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import NewInvoiceModal from './NewInvoiceModal';
import { downloadInvoicePDF } from '../../utils/generateInvoicePDF';

export default function Invoices() {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    // Subscribe to invoices
    const unsubscribe = onSnapshot(
      query(collection(db, 'invoices'), orderBy('createdAt', 'desc')),
      async (snapshot) => {
        const invoicesData: Invoice[] = [];
        const clientIds = new Set<string>();

        snapshot.forEach((doc) => {
          const invoice = { id: doc.id, ...doc.data() } as Invoice;
          invoicesData.push(invoice);
          if (invoice.clientId) {
            clientIds.add(invoice.clientId);
          }
        });

        // Fetch client details for all invoices
        const clientsData: { [key: string]: Client } = {};
        for (const clientId of clientIds) {
          try {
            const clientDoc = await getDoc(doc(db, 'clients', clientId));
            if (clientDoc.exists()) {
              clientsData[clientId] = { 
                id: clientDoc.id, 
                ...clientDoc.data() 
              } as Client;
            }
          } catch (err) {
            console.error('Error fetching client:', err);
          }
        }

        setInvoices(invoicesData);
        setClients(clientsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching invoices:', error);
        setError('Failed to load invoices');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleInvoiceCreated = () => {
    // The invoice list will automatically update through the onSnapshot listener
    console.log('Invoice created successfully');
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      setProcessingAction(invoice.id);
      const client = clients[invoice.clientId];
      if (!client) {
        throw new Error('Client not found');
      }
      await downloadInvoicePDF(invoice, client);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      setError('Failed to download invoice');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleSend = async (invoice: Invoice) => {
    try {
      setProcessingAction(invoice.id);
      const invoiceRef = doc(db, 'invoices', invoice.id);
      await updateDoc(invoiceRef, {
        status: 'sent',
        sentAt: new Date().toISOString()
      });
      // TODO: Implement email sending functionality
    } catch (err) {
      console.error('Error sending invoice:', err);
      setError('Failed to send invoice');
    } finally {
      setProcessingAction(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-gray-600 mt-1">Manage and track your invoices</p>
          </div>
          <button
            onClick={() => setShowNewInvoiceModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
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
                  Due Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {invoice.number}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {clients[invoice.clientId]?.name || 'Unknown Client'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {formatCurrency(invoice.total)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleDownload(invoice)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Download"
                        disabled={processingAction === invoice.id}
                      >
                        {processingAction === invoice.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-transparent"></div>
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                      </button>
                      {invoice.status === 'draft' && (
                        <button
                          onClick={() => handleSend(invoice)}
                          className="text-blue-400 hover:text-blue-500"
                          title="Send"
                          disabled={processingAction === invoice.id}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => {/* TODO: Show more options */}}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No invoices found. Create your first invoice to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Modal */}
      {showNewInvoiceModal && (
        <NewInvoiceModal
          onClose={() => setShowNewInvoiceModal(false)}
          onInvoiceCreated={handleInvoiceCreated}
          clients={clients}
        />
      )}
    </div>
  );
}
