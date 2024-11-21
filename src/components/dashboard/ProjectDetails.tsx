import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader,
  ArrowLeft,
  Plus
} from 'lucide-react';
import { Project } from '../../types';
import { 
  subscribeToProject,
  auth
} from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

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
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

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

    console.log('Setting up subscriptions:', { clientId, projectId });
    
    // Subscribe to project updates
    const unsubscribeProject = subscribeToProject(
      clientId,
      projectId,
      (projectData: Project | null) => {
        if (projectData) {
          console.log('Project data updated:', projectData);
          setProject(projectData);
          setLoading(false);
        } else {
          console.error('Project not found');
          setError('Project not found');
          setLoading(false);
        }
      },
      (error: Error) => {
        console.error('Error in project subscription:', error);
        setError('Error loading project');
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up subscriptions');
      unsubscribeProject();
    };
  }, [clientId, projectId, navigate]);

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
            onClick={() => navigate(`/dashboard/client/${clientId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900"
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

          {/* Tasks Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <div className="space-y-4">
              {project.tasks?.map(task => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
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
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal content */}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
