import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader,
  X,
  Plus,
  Check,
  ChevronDown,
  ChevronRight,
  Calendar,
  FileText,
  Paperclip,
  Edit2,
  Save
} from 'lucide-react';
import type { Project, Task, MiniTask, SubTaskFile } from '../../types';
import { subscribeToTeamMembers, UserProfile } from '../../config/firebase';
import { auth, db } from '../../config/firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';

type TeamMemberWithId = UserProfile & { id: string };

export default function ProjectDetails() {
  const { clientId, projectId } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithId[]>([]);
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [expandedSubTasks, setExpandedSubTasks] = useState<string[]>([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [addingSubTaskToId, setAddingSubTaskToId] = useState<string | null>(null);
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editingSubTaskText, setEditingSubTaskText] = useState('');
  const [editingSubTaskNotes, setEditingSubTaskNotes] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (!clientId || !projectId) {
      setError('Invalid project URL');
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, `clients/${clientId}/projects/${projectId}`),
      (doc) => {
        if (doc.exists()) {
          setProject({
            id: doc.id,
            ...doc.data()
          } as Project);
          setLoading(false);
        } else {
          setError('Project not found');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error fetching project:', error);
        setError('Error loading project');
        setLoading(false);
      }
    );

    const teamUnsubscribe = subscribeToTeamMembers(
      (members) => {
        setTeamMembers(members as TeamMemberWithId[]);
      },
      (error) => {
        console.error('Error fetching team members:', error);
      }
    );

    return () => {
      unsubscribe();
      teamUnsubscribe();
    };
  }, [clientId, projectId, navigate]);

  const updateProject = async (updates: Partial<Project>) => {
    if (!clientId || !projectId || !project) return;

    try {
      const projectRef = doc(db, `clients/${clientId}/projects/${projectId}`);
      await updateDoc(projectRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project');
    }
  };

  const addTask = async () => {
    if (!project || !newTaskTitle.trim()) return;

    const now = new Date().toISOString();
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      status: 'Todo',
      createdAt: now,
      updatedAt: now,
      miniTasks: [],
      documents: []
    };

    const updatedTasks = [...project.tasks, newTask];
    await updateProject({ 
      tasks: updatedTasks,
      lastUpdated: now
    });
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowNewTaskModal(false);
  };

  const addSubTask = async (taskId: string) => {
    if (!project || !newSubTaskTitle.trim()) return;

    const now = new Date().toISOString();
    const newSubTask: MiniTask = {
      id: Date.now().toString(),
      title: newSubTaskTitle.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
      notes: '',
      files: []
    };

    const updatedTasks = project.tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            miniTasks: [...task.miniTasks, newSubTask],
            updatedAt: now
          }
        : task
    );

    await updateProject({ 
      tasks: updatedTasks,
      lastUpdated: now
    });
    setNewSubTaskTitle('');
    setAddingSubTaskToId(null);
  };

  const assignTask = async (taskId: string, member: TeamMemberWithId) => {
    if (!project) return;

    const now = new Date().toISOString();
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            updatedAt: now,
            assignee: {
              id: member.id,
              name: member.email.split('@')[0],
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.email.split('@')[0])}`
            }
          }
        : task
    );

    await updateProject({ 
      tasks: updatedTasks,
      lastUpdated: now
    });
    setShowAssigneeModal(false);
    setSelectedTaskId(null);
  };

  // ... rest of the component remains the same ...

  return (
    // ... existing JSX ...
    <div>Component JSX here</div>
  );
}
