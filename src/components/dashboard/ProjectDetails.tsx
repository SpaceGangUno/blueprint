import { useState, useEffect, useRef } from 'react';
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
  serverTimestamp
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

export default function ProjectDetails() {
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

  const handleBack = () => {
    if (clientId) {
      navigate(`/dashboard/client/${clientId}`);
    } else {
      navigate('/dashboard/clients');
    }
  };

  // Previous useEffect and functions remain the same...

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Project not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto p-4">
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Client</span>
          </button>

          {/* Project Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{project.title}</h1>
                <p className="text-gray-600 mt-1">{project.description}</p>
                {project.lastUpdated && (
                  <p className="text-sm text-gray-500 mt-2">
                    Last updated: {new Date(project.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <button
                  onClick={() => setShowNewTaskModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </button>
              </div>
            </div>
          </div>

          {/* Rest of the component remains the same... */}
          {/* Previous tasks list and modals remain the same... */}
        </div>
      </div>
    </div>
  );
}
