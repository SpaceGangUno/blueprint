import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader,
  X,
  Plus,
  Check,
  ChevronDown,
  ChevronRight,
  Calendar
} from 'lucide-react';
import type { Project, Task, MiniTask } from '../../types';
import { subscribeToTeamMembers, UserProfile } from '../../config/firebase';
import { auth, db } from '../../config/firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

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
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [addingSubTaskToId, setAddingSubTaskToId] = useState<string | null>(null);

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
      updatedAt: now
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

  const toggleSubTaskCompletion = async (taskId: string, subTaskId: string) => {
    if (!project) return;

    const now = new Date().toISOString();
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            updatedAt: now,
            miniTasks: task.miniTasks.map(subTask =>
              subTask.id === subTaskId
                ? { 
                    ...subTask, 
                    completed: !subTask.completed,
                    updatedAt: now
                  }
                : subTask
            )
          }
        : task
    );

    await updateProject({ 
      tasks: updatedTasks,
      lastUpdated: now
    });
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
            {project.lastUpdated && (
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {new Date(project.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <div className="space-y-4">
            {project.tasks.map(task => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setExpandedTasks(prev => 
                        prev.includes(task.id)
                          ? prev.filter(id => id !== task.id)
                          : [...prev, task.id]
                      )}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedTasks.includes(task.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                      {task.updatedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Updated: {new Date(task.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      task.status === 'Todo' ? 'bg-gray-100 text-gray-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.status}
                    </span>
                    {task.assignee ? (
                      <img
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setShowAssigneeModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>

                {expandedTasks.includes(task.id) && (
                  <div className="mt-4 pl-8">
                    <div className="space-y-2">
                      {task.miniTasks.map(subTask => (
                        <div
                          key={subTask.id}
                          className="flex items-center space-x-3"
                        >
                          <button
                            onClick={() => toggleSubTaskCompletion(task.id, subTask.id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              subTask.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {subTask.completed && <Check className="w-3 h-3" />}
                          </button>
                          <div>
                            <span className={subTask.completed ? 'line-through text-gray-500' : ''}>
                              {subTask.title}
                            </span>
                            {subTask.updatedAt && (
                              <p className="text-xs text-gray-500">
                                Updated: {new Date(subTask.updatedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {addingSubTaskToId === task.id ? (
                      <div className="mt-3 flex items-center space-x-2">
                        <input
                          type="text"
                          value={newSubTaskTitle}
                          onChange={(e) => setNewSubTaskTitle(e.target.value)}
                          placeholder="Enter subtask title"
                          className="flex-1 border rounded px-3 py-1 text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addSubTask(task.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => addSubTask(task.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setAddingSubTaskToId(null);
                            setNewSubTaskTitle('');
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingSubTaskToId(task.id)}
                        className="mt-3 flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add subtask</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {project.tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tasks yet. Create your first task to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Task Modal */}
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
