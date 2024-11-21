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
  Building2,
  Loader
} from 'lucide-react';
import { Invoice, Client } from '../../types';
import { db } from '../../config/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  DocumentData,
  where,
  Query
} from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import NewInvoiceModal from './NewInvoiceModal';
import { downloadInvoicePDF } from '../../utils/generateInvoicePDF';

export default function Invoices() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      console.log('No authenticated user, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('Setting up invoice subscription for user:', user.email);

    // Create query based on user role
    let invoicesQuery: Query;
    if (isAdmin) {
      // Admins can see all invoices
      invoicesQuery = query(
        collection(db, 'invoices'),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Team members can only see their own invoices
      invoicesQuery = query(
        collection(db, 'invoices'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
    }

    // Subscribe to invoices
    const unsubscribe = onSnapshot(
      invoicesQuery,
      {
        next: async (snapshot) => {
          console.log('Received invoice snapshot');
          const invoicesData: Invoice[] = [];
          const clientIds = new Set<string>();

          snapshot.forEach((doc) => {
            const invoice = { id: doc.id, ...doc.data() } as Invoice;
            invoicesData.push(invoice);
            if (invoice.clientId) {
              clientIds.add(invoice.clientId);
            }
          });

          console.log('Fetched invoices:', invoicesData.length);

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
          setError(null);
        },
        error: (err) => {
          console.error('Error fetching invoices:', err);
          setError('Failed to load invoices. Please try again.');
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('Cleaning up invoice subscription');
      unsubscribe();
    };
  }, [user, authLoading, navigate, isAdmin]);

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
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Invoices</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-gray-600 mt-1">
              {isAdmin ? 'Manage all invoices' : 'Manage your invoices'}
            </p>
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
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(invoice.total)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
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

      {showNewInvoiceModal && (
        <NewInvoiceModal
          onClose={() => setShowNewInvoiceModal(false)}
          onInvoiceCreated={() => setShowNewInvoiceModal(false)}
          clients={clients}
        />
      )}
    </div>
  );
}
