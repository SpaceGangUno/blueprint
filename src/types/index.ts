export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Sourcing' | 'In Progress' | 'Under Review' | 'Completed';
  deadline: string;
  clientId?: string;
  createdAt?: string;
  userId?: string;
  tasks: Task[];
  moodboard: MoodboardItem[];
  documents: DocumentItem[];
  comments: Comment[];
  lastUpdated?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Completed';
  createdAt?: string;
  updatedAt?: string;
  miniTasks: MiniTask[];
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  documents: DocumentItem[];
}

export interface MiniTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  files?: SubTaskFile[];
  isExpanded?: boolean;
}

export interface SubTaskFile {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size?: number;
}

export interface MoodboardItem {
  id: string;
  imageUrl: string;
  note: string;
  position: {
    x: number;
    y: number;
  };
}

export interface DocumentItem {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
}
