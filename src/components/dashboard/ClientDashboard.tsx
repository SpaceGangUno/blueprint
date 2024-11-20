import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Plus, 
  RefreshCcw,
  X,
  ArrowRight
} from 'lucide-react';
import { doc, collection, query, orderBy, limit, getDocs, addDoc, setDoc } from 'firebase/firestore';
import { db, type Client, subscribeToClient } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
  clientId: string;
  createdAt: string;
  userId: string;
  tasks: any[];
}

interface NewProjectForm {
  title: string;
  description: string;
  status: string;
  deadline: string;
}

// Project Card Component
const ProjectCard = ({ project, clientId }: { project: Project; clientId: string }) => {
  const navigate = useNavigate();
  const completedTasks = project.tasks?.filter(t => t.status === 'Completed').length || 0;
  const totalTasks = project.tasks?.length || 0;

  return (
    <div 
      onClick={() => navigate(`/dashboard/client/${clientId}/project/${project.id}`)}
      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{project.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{project.description}</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {project.status}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span>{completedTasks} / {totalTasks} tasks completed</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="animate-pulse bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <div className="text-red-600 mb-4">{error}</div>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      <RefreshCcw className="w-4 h-4 mr-2" />
      Retry
    </button>
  </div>
);

export default function ClientDashboard() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProject, setNewProject] = useState<NewProjectForm>({
    title: '',
    description: '',
    status: 'In Progress',
    deadline: new Date().toISOString().split('T')[0]
  });

  const fetchData = useCallback(async () => {
    if (!user || !clientId) return;

    try {
      setLoading(true);
      setError('');

      // Subscribe to client data
      const unsubscribeClient = subscribeToClient(
        clientId,
        async (clientData) => {
          if (!clientData) {
            setError('Client not found');
            setLoading(false);
            return;
          }

          // Check access permissions
          if (!isAdmin && user.role !== 'team_member' && clientData.userId !== user.id) {
            setError('You do not have permission to access this client');
            setLoading(false);
            return;
          }

          setClient(clientData);

          // Fetch projects using nested collection
          const projectsQuery = query(
            collection(db, `clients/${clientId}/projects`),
            orderBy('createdAt', 'desc'),
            limit(20)
          );

          const projectsSnap = await getDocs(projectsQuery);
          const projectsData = projectsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Project));

          setProjects(projectsData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching client:', error);
          setError(error.message || 'Failed to load client data');
          setLoading(false);
        }
      );

      return unsubscribeClient;
    } catch (err: any) {
      console.error('Error fetching data:', err);
      if (err.code === 'permission-denied') {
        setError('You do not have permission to access this data');
      } else {
        setError(err.message || 'Failed to load data');
      }
      setLoading(false);
    }
  }, [clientId, user, isAdmin]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else {
        fetchData().then(unsub => {
          unsubscribe = unsub;
        });
      }
    }

    return () => {
      unsubscribe?.();
    };
  }, [user, authLoading, navigate, fetchData]);

  const handleNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !clientId) {
      setError('Authentication required');
      return;
    }

    setSubmitting(true);
    
    try {
      // Use nested collection path
      const projectsCollection = collection(db, `clients/${clientId}/projects`);
      const projectData = {
        ...newProject,
        clientId,
        userId: user.id,
        createdAt: new Date().toISOString(),
        tasks: []
      };
      
      await addDoc(projectsCollection, projectData);
      
      // Update client's lastActivity
      await setDoc(doc(db, 'clients', clientId), {
        lastActivity: new Date().toISOString()
      }, { merge: true });
      
      // Refresh data
      fetchData();
      
      setShowNewProjectModal(false);
      setNewProject({
        title: '',
        description: '',
        status: 'In Progress',
        deadline: new Date().toISOString().split('T')[0]
      });
    } catch (err: any) {
      console.error('Error adding project:', err);
      setError('Failed to add project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-600">Please sign in to view client details.</p>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchData} />;
  }

  if (!client) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Client not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
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
          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Projects</h2>
        <div className="space-y-4">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} clientId={clientId!} />
          ))}
          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No projects found. Create your first project to get started.
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Project</h2>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={submitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
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
                    disabled={submitting}
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
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={submitting}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
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
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Adding...
                    </>
                  ) : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
