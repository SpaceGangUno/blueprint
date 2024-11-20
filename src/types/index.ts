export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Under Review' | 'Completed';
  deadline: string;
  clientId?: string;
  createdAt?: string;
  userId?: string;
  tasks: Task[];
  moodboard: MoodboardItem[];
  documents: DocumentItem[];
  comments: Comment[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Completed';
  miniTasks: MiniTask[];
}

export interface MiniTask {
  id: string;
  title: string;
  completed: boolean;
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  avatar?: string;
}
