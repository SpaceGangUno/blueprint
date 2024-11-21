import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Client, Invoice, InvoiceItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface NewInvoiceModalProps {
  clients: { [key: string]: Client };
  onClose: () => void;
  onInvoiceCreated: () => void;
}

interface InvoiceItemInput {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  clients,
  onClose,
  onInvoiceCreated
}) => {
  const { user } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [items, setItems] = useState<InvoiceItemInput[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [terms, setTerms] = useState<string>('Payment is due within 30 days of invoice date.');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateAmount = (quantity: number, rate: number): number => {
    return quantity * rate;
  };

  const handleItemUpdate = (index: number, field: keyof InvoiceItemInput, value: string | number) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      const item = { ...newItems[index] };

      if (field === 'quantity' || field === 'rate') {
        const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
        item[field] = numValue;
        item.amount = calculateAmount(
          field === 'quantity' ? numValue : item.quantity,
          field === 'rate' ? numValue : item.rate
        );
      } else if (field === 'description') {
        item.description = value as string;
      }

      newItems[index] = item;
      return newItems;
    });
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const calculateSubtotal = (): number => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = (subtotal: number): number => {
    return subtotal * (taxRate / 100);
  };

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!selectedClientId) {
      setError('Please select a client');
      return;
    }

    if (!dueDate) {
      setError('Please set a due date');
      return;
    }

    if (items.some(item => !item.description || item.amount === 0)) {
      setError('Please fill in all item details');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const invoiceNumber = `INV-${Date.now()}`;
      const subtotal = calculateSubtotal();
      const tax = calculateTax(subtotal);
      const total = calculateTotal();

      const newInvoice: Omit<Invoice, 'id'> = {
        invoiceNumber,
        clientId: selectedClientId,
        projectId: selectedProjectId || undefined,
        userId: user.uid,
        status: 'draft',
        issueDate: now,
        dueDate,
        items: items.map((item, index) => ({
          id: `item-${index + 1}`,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        })),
        subtotal,
        tax,
        total,
        notes: notes.trim(),
        terms: terms.trim(),
        createdAt: now,
        updatedAt: now,
        client: clients[selectedClientId]
      };

      await addDoc(collection(db, 'invoices'), newInvoice);
      onInvoiceCreated();
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a client</option>
              {Object.values(clients).map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Items
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </button>
            </div>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex space-x-4 items-start">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemUpdate(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemUpdate(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemUpdate(index, 'rate', e.target.value)}
                      placeholder="Rate"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={item.amount}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.01"
              className="w-32 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax ({taxRate}%):</span>
                <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Additional notes for the client"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terms & Conditions
            </label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Terms and conditions"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInvoiceModal;
