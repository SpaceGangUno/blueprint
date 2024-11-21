// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Sourcing' | 'In Progress' | 'Under Review' | 'Completed' | 'On Hold';
  lastUpdated?: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Completed';
  createdAt: string;
  updatedAt: string;
  miniTasks: MiniTask[];
  documents: string[];
}

export interface MiniTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  files?: SubTaskFile[];
}

export interface SubTaskFile {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
}

// Client Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingEmail?: string;
  taxId?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Invoice Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;  // Optional since not all invoices might be tied to a project
  userId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  client?: Client;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}
