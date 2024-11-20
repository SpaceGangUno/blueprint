import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  FileText, 
  CheckSquare, 
  Plus, 
  X, 
  Edit2, 
  Save, 
  Trash2, 
  Upload,
  File as FileIcon,
  Send,
  Paperclip,
  UserPlus,
  Move,
  ListPlus,
  Loader
} from 'lucide-react';
import type { Project, Task, MiniTask, MoodboardItem, DocumentItem, Comment } from '../../types';
import { subscribeToTeamMembers, UserProfile } from '../../config/firebase';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

// Extend UserProfile to include id as it's added by subscribeToTeamMembers
type TeamMemberWithId = UserProfile & { id: string };

export default function ProjectDetails() {
  const { clientId, projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithId[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '',
    miniTasks: [] as { title: string }[],
    documents: [] as DocumentItem[]
  });
  const [newSubtask, setNewSubtask] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const [isDraggingMoodboard, setIsDraggingMoodboard] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const commentFileInputRef = useRef<HTMLInputElement>(null);
  const documentFileInputRef = useRef<HTMLInputElement>(null);
  const moodboardFileInputRef = useRef<HTMLInputElement>(null);
  const subtaskInputRef = useRef<HTMLInputElement>(null);
  const taskDocumentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (!clientId || !projectId) {
      setError('Invalid project URL');
      return;
    }

    // Subscribe to project updates
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

    // Subscribe to team members
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
      await updateDoc(projectRef, updates);
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project');
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    setNewTask(prev => ({
      ...prev,
      miniTasks: [...prev.miniTasks, { title: newSubtask }]
    }));
    setNewSubtask('');
    subtaskInputRef.current?.focus();
  };

  const removeSubtask = (index: number) => {
    setNewTask(prev => ({
      ...prev,
      miniTasks: prev.miniTasks.filter((_, i) => i !== index)
    }));
  };

  const handleTaskDocumentUpload = async (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!project || !e.target.files) return;

    const files = Array.from(e.target.files);
    
    const newDocuments: DocumentItem[] = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      uploadedBy: user?.email || 'Unknown User',
      uploadedAt: new Date().toISOString()
    }));

    if (editingTaskId) {
      setNewTask(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments]
      }));
    } else {
      const updatedTasks = project.tasks.map(task =>
        task.id === taskId
          ? { ...task, documents: [...(task.documents || []), ...newDocuments] }
          : task
      );

      await updateProject({ tasks: updatedTasks });
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description,
      miniTasks: task.miniTasks.map(mt => ({ title: mt.title })),
      documents: task.documents || []
    });
    setShowAddTask(true);
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!project || !e.target.files) return;

    const files = Array.from(e.target.files);
    
    const newDocuments: DocumentItem[] = files.map(file => ({
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      uploadedBy: user?.email || 'Unknown User',
      uploadedAt: new Date().toISOString()
    }));

    await updateProject({
      documents: [...(project.documents || []), ...newDocuments]
    });
  };

  const handleMoodboardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!project || !e.target.files) return;

    const files = Array.from(e.target.files);
    
    const newMoodboardItems: MoodboardItem[] = files.map(file => ({
      id: Date.now().toString(),
      imageUrl: URL.createObjectURL(file),
      note: '',
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400
      }
    }));

    await updateProject({
      moodboard: [...(project.moodboard || []), ...newMoodboardItems]
    });
  };

  const handleMoodboardDragStart = (itemId: string) => {
    setIsDraggingMoodboard(true);
    setDraggedItemId(itemId);
  };

  const handleMoodboardDragEnd = async (e: React.DragEvent, itemId: string) => {
    if (!project) return;

    setIsDraggingMoodboard(false);
    setDraggedItemId(null);

    const moodboardContainer = document.getElementById('moodboard-container');
    if (!moodboardContainer) return;

    const rect = moodboardContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updatedMoodboard = project.moodboard.map(item => 
      item.id === itemId
        ? { ...item, position: { x, y } }
        : item
    );

    await updateProject({ moodboard: updatedMoodboard });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || (!newComment.trim() && commentAttachments.length === 0)) return;

    const attachments = commentAttachments.map(file => ({
      type: file.type.startsWith('image/') ? 'image' : 'document' as 'image' | 'document',
      url: URL.createObjectURL(file),
      name: file.name
    }));

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user?.email || 'Unknown User',
      content: newComment,
      timestamp: new Date().toISOString(),
      attachments
    };

    await updateProject({
      comments: [...(project.comments || []), comment]
    });

    setNewComment('');
    setCommentAttachments([]);
  };

  const handleCommentAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCommentAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const addTask = async () => {
    if (!project || !newTask.title.trim()) return;
    
    const task: Task = {
      id: editingTaskId || Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'Todo',
      miniTasks: newTask.miniTasks.map(st => ({
        id: Date.now().toString() + Math.random(),
        title: st.title,
        completed: false
      })),
      documents: newTask.documents
    };

    const updatedTasks = editingTaskId
      ? project.tasks.map(t => t.id === editingTaskId ? task : t)
      : [...project.tasks, task];

    await updateProject({ tasks: updatedTasks });

    setNewTask({ title: '', description: '', miniTasks: [], documents: [] });
    setShowAddTask(false);
    setEditingTaskId(null);
  };

  const assignTask = async (taskId: string, member: TeamMemberWithId) => {
    if (!project) return;

    const updatedTasks = project.tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            assignee: {
              id: member.id,
              name: member.email.split('@')[0],
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.email.split('@')[0])}`
            }
          }
        : task
    );

    await updateProject({ tasks: updatedTasks });
    setShowAssigneeModal(false);
    setSelectedTaskId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || 'Project not found'}
      </div>
    );
  }

  // Rest of the JSX remains the same...
  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
            project.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ... Rest of the sections (Tasks, Moodboard, Documents, Comments) remain the same ... */}
      </div>

      {/* Assignee Modal */}
      {showAssigneeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Assign Task</h2>
              <button
                onClick={() => {
                  setShowAssigneeModal(false);
                  setSelectedTaskId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              {teamMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => selectedTaskId && assignTask(selectedTaskId, member)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.email.split('@')[0])}`}
                    alt={member.email}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-grow text-left">
                    <p className="font-medium">{member.email.split('@')[0]}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
