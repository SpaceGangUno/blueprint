import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader,
  X,
  Plus,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Paperclip,
  Edit2,
  Save,
  ArrowLeft
} from 'lucide-react';
import type { Project, Task, MiniTask, SubTaskFile } from '../../types';
import { 
  subscribeToTeamMembers, 
  subscribeToProject,
  UserProfile, 
  storage,
  auth, 
  db 
} from '../../config/firebase';
import { 
  doc, 
  updateDoc, 
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';

type TeamMemberWithId = UserProfile & { id: string };

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'Sourcing':
      return 'bg-purple-100 text-purple-800';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Under Review':
      return 'bg-yellow-100 text-yellow-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'On Hold':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ProjectDetails: React.FC = () => {
  const { clientId, projectId } = useParams<{ clientId: string; projectId: string }>();
  const navigate = useNavigate();
  const { loading: authLoading, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithId[]>([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [expandedSubTasks, setExpandedSubTasks] = useState<string[]>([]);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [addingSubTaskToId, setAddingSubTaskToId] = useState<string | null>(null);
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editingSubTaskText, setEditingSubTaskText] = useState('');
  const [editingSubTaskNotes, setEditingSubTaskNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

  const toggleSubTaskExpansion = (subTaskId: string): void => {
    setExpandedSubTasks((prev: string[]) =>
      prev.includes(subTaskId)
        ? prev.filter((id: string) => id !== subTaskId)
        : [...prev, subTaskId]
    );
  };

  // Rest of the component implementation remains the same...
  
  return (
    // Existing JSX remains the same...
    <div>Existing JSX</div>
  );
};

export default ProjectDetails;
