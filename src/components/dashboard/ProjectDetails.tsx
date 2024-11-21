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
  Save
} from 'lucide-react';
import type { Project, Task, MiniTask, SubTaskFile } from '../../types';
import { subscribeToTeamMembers, UserProfile, storage } from '../../config/firebase';
import { auth, db } from '../../config/firebase';
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  serverTimestamp, 
  getDoc,
  DocumentData,
  DocumentSnapshot 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';

type TeamMemberWithId = UserProfile & { id: string };

export default function ProjectDetails() {
  const { clientId, projectId } = useParams<{ clientId: string; projectId: string }>();
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
      console.log('No authenticated user, redirecting to login');
      navigate('/login');
      return;
    }

    if (!clientId || !projectId) {
      console.error('Missing clientId or projectId');
      setError('Invalid project URL');
      return;
    }

    console.log('Fetching project:', { clientId, projectId });
    
    // First, try to get the project document directly
    const fetchProject = async () => {
      try {
        const projectRef = doc(db, `clients/${clientId}/projects/${projectId}`);
        const projectDoc = await getDoc(projectRef);
        
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          console.log('Project data:', projectData);
          
          // Ensure tasks array exists
          const tasks = projectData.tasks || [];
          console.log('Project tasks:', tasks);

          setProject({
            id: projectDoc.id,
            ...projectData,
            tasks
          } as Project);
          setLoading(false);
        } else {
          console.error('Project document does not exist');
          setError('Project not found');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Error loading project');
        setLoading(false);
      }
    };

    fetchProject();

    // Then set up real-time updates
    const unsubscribe = onSnapshot(
      doc(db, `clients/${clientId}/projects/${projectId}`),
      (docSnapshot: DocumentSnapshot<DocumentData>) => {
        if (docSnapshot.exists()) {
          const projectData = docSnapshot.data();
          console.log('Project update:', projectData);
          
          // Ensure tasks array exists
          const tasks = projectData.tasks || [];
          console.log('Updated project tasks:', tasks);

          setProject({
            id: docSnapshot.id,
            ...projectData,
            tasks
          } as Project);
          setLoading(false);
        } else {
          console.error('Project not found in snapshot');
          setError('Project not found');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error in project snapshot:', error);
        setError('Error loading project');
        setLoading(false);
      }
    );

    const teamUnsubscribe = subscribeToTeamMembers(
      (members) => {
        console.log('Team members loaded:', members);
        setTeamMembers(members as TeamMemberWithId[]);
      },
      (error) => {
        console.error('Error fetching team members:', error);
      }
    );

    return () => {
      console.log('Cleaning up subscriptions');
      unsubscribe();
      teamUnsubscribe();
    };
  }, [clientId, projectId, navigate]);

  const updateProject = async (updates: Partial<Project>) => {
    if (!clientId || !projectId || !project) {
      console.error('Missing required data for update:', { clientId, projectId, hasProject: !!project });
      return;
    }

    try {
      console.log('Updating project with:', updates);
      const projectRef = doc(db, `clients/${clientId}/projects/${projectId}`);
      await updateDoc(projectRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });
      console.log('Project updated successfully');
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project');
    }
  };

  const addTask = async () => {
    if (!project || !newTaskTitle.trim()) {
      console.error('Cannot add task: missing project or title');
      return;
    }

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

    console.log('Adding new task:', newTask);
    const updatedTasks = [...(project.tasks || []), newTask];
    await updateProject({ 
      tasks: updatedTasks,
      lastUpdated: now
    });
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowNewTaskModal(false);
  };

  const toggleSubTaskExpansion = (subTaskId: string) => {
    setExpandedSubTasks(prev =>
      prev.includes(subTaskId)
        ? prev.filter(id => id !== subTaskId)
        : [...prev, subTaskId]
    );
  };

  if (authLoading || loading) {
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

  return (
    <div className="space-y-6">
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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'Sourcing' ? 'bg-purple-100 text-purple-800' :
              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
              project.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
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

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <div className="space-y-4">
          {project.tasks?.map(task => (
            <div key={task.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  task.status === 'Todo' ? 'bg-gray-100 text-gray-800' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
          {(!project.tasks || project.tasks.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No tasks yet. Create your first task to get started.
            </div>
          )}
        </div>
      </div>

      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Task</h2>
              <button
                onClick={() => {
                  setShowNewTaskModal(false);
                  setNewTaskTitle('');
                  setNewTaskDescription('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowNewTaskModal(false);
                    setNewTaskTitle('');
                    setNewTaskDescription('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!newTaskTitle.trim()}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
