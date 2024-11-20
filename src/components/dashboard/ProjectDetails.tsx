import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader,
  X
} from 'lucide-react';
import type { Project } from '../../types';
import { subscribeToTeamMembers, UserProfile } from '../../config/firebase';
import { auth, db } from '../../config/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

// Extend UserProfile to include id as it's added by subscribeToTeamMembers
type TeamMemberWithId = UserProfile & { id: string };

export default function ProjectDetails() {
  const { clientId, projectId } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithId[]>([]);
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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
