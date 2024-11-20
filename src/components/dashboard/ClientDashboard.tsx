import { useState, useEffect, useMemo, useCallback, memo, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Plus, 
  ListTodo, 
  BarChart3,
  Folder,
  X,
  ChevronDown
} from 'lucide-react';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Interfaces moved to types file
interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
}

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  dueDate: string;
}

interface Client {
  id: string;
  name: string;
  description: string;
  status: string;
  lastActivity: string;
  userId: string;
}

// Loading Skeleton Components
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
  </div>
);

// Memoized Components
const Modal = memo(({ title, onClose, children }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      {children}
    </div>
  </div>
));

const TaskItem = memo(({ task, onToggle }: {
  task: Task;
  onToggle: (id: string) => void;
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        checked={task.status === 'completed'}
        onChange={() => onToggle(task.id)}
        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
        {task.title}
      </span>
    </div>
    <div className="text-sm text-gray-500">
      Due: {new Date(task.dueDate).toLocaleDateString()}
    </div>
  </div>
));

const ProjectCard = memo(({ project }: { project: Project }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-gray-900">{project.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
      </div>
      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        {project.status}
      </span>
    </div>
    <div className="mt-4 flex items-center text-sm text-gray-500">
      <Calendar className="w-4 h-4 mr-2" />
      <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
    </div>
  </div>
));

// Constants
const ITEMS_PER_PAGE = 5;

export default function ClientDashboard() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Form state
  const [newProject, setNewProject] = useState(() => ({
    title: '',
    description: '',
    deadline: ''
  }));

  const [newTask, setNewTask] = useState(() => ({
    title: '',
    dueDate: ''
  }));

  // Memoized values
  const completedTasksCount = useMemo(() => 
    tasks.filter(t => t.status === 'completed').length,
    [tasks]
  );

  const pendingTasksCount = useMemo(() => 
    tasks.filter(t => t.status === 'pending').length,
    [tasks]
  );

  // Load more data
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !clientId) return;

    try {
      setLoadingMore(true);
      const projectsQuery = query(
        collection(db, 'projects'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(ITEMS_PER_PAGE)
      );

      const snapshot = await getDocs(projectsQuery);
      
      if (snapshot.empty) {
        setHasMore(false);
        return;
      }

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      
      const newProjects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];

      setProjects(prev => [...prev, ...newProjects]);
    } catch (err) {
      console.error('Error loading more projects:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [clientId, hasMore, lastVisible, loadingMore]);

  // Callbacks
  const toggleTaskStatus = useCallback((taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task
      )
    );
  }, []);

  const handleNewProject = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const projectToAdd: Project = {
      id: (projects.length + 1).toString(),
      title: newProject.title,
      description: newProject.description,
      status: 'In Progress',
      deadline: newProject.deadline
    };
    setProjects(prev => [projectToAdd, ...prev]);
    setShowNewProjectModal(false);
    setNewProject({ title: '', description: '', deadline: '' });
  }, [projects.length, newProject]);

  const handleNewTask = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const taskToAdd: Task = {
      id: (tasks.length + 1).toString(),
      title: newTask.title,
      status: 'pending',
      dueDate: newTask.dueDate
    };
    setTasks(prev => [taskToAdd, ...prev]);
    setShowNewTaskModal(false);
    setNewTask({ title: '', dueDate: '' });
  }, [tasks.length, newTask]);

  // Initial data fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      if (user && clientId) {
        fetchInitialData();
      } else if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [clientId, navigate]);

  const fetchInitialData = async () => {
    if (!auth.currentUser || !clientId) return;

    try {
      setLoading(true);
      setError('');
      
      // Fetch client data
      const clientDoc = doc(db, 'clients', clientId);
      const clientSnap = await getDoc(clientDoc);
      
      if (!clientSnap.exists()) {
        setError('Client not found');
        return;
      }

      const clientData = {
        id: clientSnap.id,
        ...clientSnap.data()
      } as Client;

      if (clientData.userId !== auth.currentUser.uid) {
        setError('You do not have permission to view this client');
        return;
      }

      setClient(clientData);

      // Fetch initial projects
      const projectsQuery = query(
        collection(db, 'projects'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      );

      const projectsSnap = await getDocs(projectsQuery);
      const projectsData = projectsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];

      setProjects(projectsData);
      setLastVisible(projectsSnap.docs[projectsSnap.docs.length - 1]);
      setHasMore(projectsSnap.docs.length === ITEMS_PER_PAGE);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-600">Please sign in to view client details.</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !client) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || 'Client not found'}
      </div>
    );
  }

  return (
    <div>
      {/* Client Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-600">{client.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline-block mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Folder className="w-4 h-4 inline-block mr-2" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ListTodo className="w-4 h-4 inline-block mr-2" />
              Tasks
            </button>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Suspense fallback={<LoadingSkeleton />}>
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Client Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-600 mb-2">Active Projects</h3>
                  <p className="text-2xl font-bold text-blue-900">{projects.length}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-sm font-medium text-green-600 mb-2">Completed Tasks</h3>
                  <p className="text-2xl font-bold text-green-900">{completedTasksCount}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-600 mb-2">Pending Tasks</h3>
                  <p className="text-2xl font-bold text-yellow-900">{pendingTasksCount}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Projects</h2>
                <button 
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add Project
                </button>
              </div>
              <div className="space-y-4">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="w-full py-3 text-gray-600 hover:text-gray-900 flex items-center justify-center"
                  >
                    {loadingMore ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5 mr-2" />
                        Load More
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <button 
                  onClick={() => setShowNewTaskModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add Task
                </button>
              </div>
              <div className="space-y-2">
                {tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskStatus}
                  />
                ))}
              </div>
            </div>
          )}
        </Suspense>
      </div>

      {/* Modals */}
      {showNewProjectModal && (
        <Modal
          title="Add New Project"
          onClose={() => setShowNewProjectModal(false)}
        >
          <form onSubmit={handleNewProject}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showNewTaskModal && (
        <Modal
          title="Add New Task"
          onClose={() => setShowNewTaskModal(false)}
        >
          <form onSubmit={handleNewTask}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
