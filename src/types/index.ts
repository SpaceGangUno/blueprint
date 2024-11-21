// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Sourcing' | 'In Progress' | 'Under Review' | 'Completed' | 'On Hold';
  lastUpdated: string;  // Making this required since we always want to track when projects are updated
  tasks: Task[];
}

// Rest of the types remain the same...
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
  projectId?: string;
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

// User Types
export interface UserProfile {
  email: string;
  role: 'admin' | 'team_member';
  createdAt: string;
  updatedAt?: string;
  inviteId?: string;
  passwordUpdated?: boolean;
  displayName?: string;
  photoURL?: string;
  lastLogin?: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  read: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}
