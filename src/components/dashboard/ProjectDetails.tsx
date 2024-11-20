import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  ListPlus
} from 'lucide-react';
import type { Project, Task, MiniTask, MoodboardItem, DocumentItem, Comment } from '../../types';
import { subscribeToTeamMembers, UserProfile } from '../../config/firebase';
import { auth } from '../../config/firebase';

// Extend UserProfile to include id as it's added by subscribeToTeamMembers
type TeamMemberWithId = UserProfile & { id: string };

export default function ProjectDetails() {
  const { clientId, projectId } = useParams();
  const [project, setProject] = useState<Project>({
    id: projectId || '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'In Progress',
    deadline: '2024-04-01',
    moodboard: [],
    comments: [],
    tasks: [],
    documents: []
  });

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
    if (!auth.currentUser) return;

    const unsubscribe = subscribeToTeamMembers(
      (members) => {
        setTeamMembers(members as TeamMemberWithId[]);
      },
      (error) => {
        console.error('Error fetching team members:', error);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

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
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const newDocuments: DocumentItem[] = files.map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString()
      }));

      if (editingTaskId) {
        setNewTask(prev => ({
          ...prev,
          documents: [...prev.documents, ...newDocuments]
        }));
      } else {
        setProject({
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId
              ? { ...task, documents: [...task.documents, ...newDocuments] }
              : task
          )
        });
      }
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description,
      miniTasks: task.miniTasks.map(mt => ({ title: mt.title })),
      documents: task.documents
    });
    setShowAddTask(true);
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const newDocuments: DocumentItem[] = files.map(file => ({
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString()
      }));

      setProject({
        ...project,
        documents: [...project.documents, ...newDocuments]
      });
    }
  };

  const handleMoodboardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
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

      setProject({
        ...project,
        moodboard: [...project.moodboard, ...newMoodboardItems]
      });
    }
  };

  const handleMoodboardDragStart = (itemId: string) => {
    setIsDraggingMoodboard(true);
    setDraggedItemId(itemId);
  };

  const handleMoodboardDragEnd = (e: React.DragEvent, itemId: string) => {
    setIsDraggingMoodboard(false);
    setDraggedItemId(null);

    const moodboardContainer = document.getElementById('moodboard-container');
    if (!moodboardContainer) return;

    const rect = moodboardContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setProject({
      ...project,
      moodboard: project.moodboard.map(item => 
        item.id === itemId
          ? { ...item, position: { x, y } }
          : item
      )
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && commentAttachments.length === 0) return;

    const attachments = commentAttachments.map(file => ({
      type: file.type.startsWith('image/') ? 'image' : 'document' as 'image' | 'document',
      url: URL.createObjectURL(file),
      name: file.name
    }));

    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'Current User',
      content: newComment,
      timestamp: new Date().toISOString(),
      attachments
    };

    setProject({
      ...project,
      comments: [...project.comments, comment]
    });

    setNewComment('');
    setCommentAttachments([]);
  };

  const handleCommentAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCommentAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
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

    setProject({
      ...project,
      tasks: editingTaskId
        ? project.tasks.map(t => t.id === editingTaskId ? task : t)
        : [...project.tasks, task]
    });

    setNewTask({ title: '', description: '', miniTasks: [], documents: [] });
    setShowAddTask(false);
    setEditingTaskId(null);
  };

  const assignTask = (taskId: string, member: TeamMemberWithId) => {
    setProject({
      ...project,
      tasks: project.tasks.map(task =>
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
      )
    });
    setShowAssigneeModal(false);
    setSelectedTaskId(null);
  };

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
        {/* ... All previous sections (Tasks, Moodboard, Documents, Comments) remain the same ... */}
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
