export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Under Review' | 'Completed';
  deadline: string;
  moodboard: MoodboardItem[];
  comments: Comment[];
  tasks: Task[];
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
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  avatar?: string;
}
