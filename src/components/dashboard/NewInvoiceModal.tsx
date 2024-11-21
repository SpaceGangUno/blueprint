import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Client, Invoice, InvoiceItem, Project } from '../../types';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

interface NewInvoiceModalProps {
  onClose: () => void;
  onInvoiceCreated: () => void;
  clients: { [key: string]: Client };
}

export default function NewInvoiceModal({ onClose, onInvoiceCreated, clients }: NewInvoiceModalProps) {
  const { user } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [terms, setTerms] = useState<string>(
    'Payment is due within 30 days of invoice date.'
  );
  const [taxRate, setTaxRate] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedClientId) {
      // Fetch projects for selected client
      const fetchProjects = async () => {
        try {
          const projectsRef = collection(db, `clients/${selectedClientId}/projects`);
          const projectsSnap = await getDocs(projectsRef);
          const projectsData = projectsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Project[];
          setProjects(projectsData);
        } catch (err) {
          console.error('Error fetching projects:', err);
        }
      };
      fetchProjects();
    }
  }, [selectedClientId]);

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const updateItemAmount = (index: number, quantity: number, rate: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      quantity,
      rate,
      amount: quantity * rate
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to create invoices');
      return;
    }

    if (!selectedClientId) {
      setError('Please select a client');
      return;
    }

    if (items.some(item => !item.description || item.rate <= 0)) {
      setError('Please fill in all item details');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate invoice number (YYYY-MM-DD-XXXXX format)
      const now = new Date();
      const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      const newInvoice: Omit<Invoice, 'id'> = {
        number: invoiceNumber,
        clientId: selectedClientId,
        projectId: selectedProjectId || undefined,
        status: 'draft',
        issueDate: new Date().toISOString(),
        dueDate: new Date(dueDate).toISOString(),
        items: items.map((item, index) => ({
          ...item,
          id: `item-${index + 1}`
        })),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        notes: notes || undefined,
        terms: terms || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.uid // Add the userId to the invoice
      };

      await addDoc(collection(db, 'invoices'), newInvoice);
      onInvoiceCreated();
      onClose();
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Invoice</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Client and Project Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Client</option>
                  {Object.values(clients).map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project (Optional)
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={!selectedClientId}
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items
              </label>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index] = { ...item, description: e.target.value };
                        setItems(newItems);
                      }}
                      placeholder="Description"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const quantity = parseFloat(e.target.value) || 0;
                        updateItemAmount(index, quantity, item.rate);
                      }}
                      placeholder="Qty"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => {
                        const rate = parseFloat(e.target.value) || 0;
                        updateItemAmount(index, item.quantity, rate);
                      }}
                      placeholder="Rate"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="w-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addItem}
                className="mt-2 flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </button>
            </div>

            {/* Tax Rate */}
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-end text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="ml-4 text-gray-900">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-end text-sm">
                <span className="text-gray-600">Tax ({taxRate}%):</span>
                <span className="ml-4 text-gray-900">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-end text-lg font-medium">
                <span className="text-gray-600">Total:</span>
                <span className="ml-4 text-gray-900">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Additional notes to the client"
              />
            </div>

            {/* Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms
              </label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Invoice'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
