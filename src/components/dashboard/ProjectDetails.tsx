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
      (projectData) => {
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
      (error) => {
        console.error('Error in project subscription:', error);
        setError('Error loading project');
        setLoading(false);
      }
    );

    // Subscribe to team members
    const unsubscribeTeam = subscribeToTeamMembers(
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
      unsubscribeProject();
      unsubscribeTeam();
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
            miniTasks: [...(task.miniTasks || []), newSubTask],
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

  const handleNotesChange = async (taskId: string, subTaskId: string, notes: string) => {
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
                    notes,
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

  const handleFileUpload = async (taskId: string, subTaskId: string, files: FileList) => {
    if (!project || !user || !projectId) {
      console.error('Missing required data:', { project: !!project, user: !!user, projectId: !!projectId });
      setUploadError('Missing required data for upload');
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [subTaskId]: true }));
    setUploadError(null);

    const now = new Date().toISOString();
    const newFiles: SubTaskFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('Processing file:', {
          name: file.name,
          size: file.size,
          type: file.type
        });

        const path = `projects/${projectId}/subtasks/${subTaskId}/${file.name}`;
        console.log('Creating storage reference at path:', path);
        const fileRef = ref(storage, path);
        
        console.log('Starting file upload...');
        try {
          const snapshot = await uploadBytes(fileRef, file);
          console.log('Upload completed:', snapshot.metadata);
          
          console.log('Getting download URL...');
          const downloadUrl = await getDownloadURL(snapshot.ref);
          console.log('Download URL obtained:', downloadUrl);
          
          newFiles.push({
            id: Date.now().toString() + i,
            name: file.name,
            url: downloadUrl,
            type: file.type,
            uploadedBy: user.email || 'unknown',
            uploadedAt: now,
            size: file.size
          });
          console.log('File processed successfully');
        } catch (uploadError: any) {
          console.error('Error in upload process:', {
            code: uploadError.code,
            message: uploadError.message,
            serverResponse: uploadError.serverResponse
          });
          throw uploadError;
        }
      }

      console.log('All files processed, updating project...');
      const updatedTasks = project.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              updatedAt: now,
              miniTasks: task.miniTasks.map(subTask =>
                subTask.id === subTaskId
                  ? {
                      ...subTask,
                      files: [...(subTask.files || []), ...newFiles],
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
      console.log('Project updated with new files');
    } catch (err: any) {
      console.error('Upload error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      setUploadError(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [subTaskId]: false }));
    }
  };

  const renderSubTask = (parentTask: Task, subTask: MiniTask) => {
    const isExpanded = expandedSubTasks.includes(subTask.id);
    const isEditing = editingSubTaskId === subTask.id;
    const isUploading = uploadingFiles[subTask.id];

    return (
      <div key={subTask.id} className="border rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-grow">
            <button
              onClick={() => toggleSubTaskCompletion(parentTask.id, subTask.id)}
              className={`w-5 h-5 rounded border flex items-center justify-center ${
                subTask.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300'
              }`}
            >
              {subTask.completed && <Check className="w-3 h-3" />}
            </button>
            
            {isEditing ? (
              <input
                type="text"
                value={editingSubTaskText}
                onChange={(e) => setEditingSubTaskText(e.target.value)}
                className="flex-grow px-2 py-1 border rounded"
                autoFocus
              />
            ) : (
              <span
                className={`flex-grow cursor-pointer ${subTask.completed ? 'line-through text-gray-500' : ''}`}
                onClick={() => {
                  setEditingSubTaskId(subTask.id);
                  setEditingSubTaskText(subTask.title);
                  setEditingSubTaskNotes(subTask.notes || '');
                }}
              >
                {subTask.title}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <button
                onClick={async () => {
                  if (!project) return;
                  const now = new Date().toISOString();
                  const updatedTasks = project.tasks.map(task =>
                    task.id === parentTask.id
                      ? {
                          ...task,
                          updatedAt: now,
                          miniTasks: task.miniTasks.map(st =>
                            st.id === subTask.id
                              ? {
                                  ...st,
                                  title: editingSubTaskText,
                                  notes: editingSubTaskNotes,
                                  updatedAt: now
                                }
                              : st
                          )
                        }
                      : task
                  );
                  await updateProject({
                    tasks: updatedTasks,
                    lastUpdated: now
                  });
                  setEditingSubTaskId(null);
                  setEditingSubTaskText('');
                  setEditingSubTaskNotes('');
                }}
                className="text-green-600 hover:text-green-700"
              >
                <Save className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingSubTaskId(subTask.id);
                    setEditingSubTaskText(subTask.title);
                    setEditingSubTaskNotes(subTask.notes || '');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleSubTaskExpansion(subTask.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3 pl-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={subTask.notes || ''}
                onChange={(e) => handleNotesChange(parentTask.id, subTask.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Add notes here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Files
              </label>
              <div className="space-y-2">
                {subTask.files?.map(file => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{file.name}</span>
                  </a>
                ))}
              </div>
              <div className="mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(parentTask.id, subTask.id, e.target.files);
                    }
                  }}
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                    disabled={isUploading}
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Attach files'}</span>
                  </button>
                  {isUploading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  )}
                </div>
                {uploadError && (
                  <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                )}
              </div>
            </div>

            {subTask.updatedAt && (
              <p className="text-xs text-gray-500">
                Updated: {new Date(subTask.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

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

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <div className="space-y-4">
              {project.tasks?.map(task => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
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
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      task.status === 'Todo' ? 'bg-gray-100 text-gray-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  {expandedTasks.includes(task.id) && (
                    <div className="mt-4 pl-8 space-y-3">
                      {task.miniTasks?.map(subTask => renderSubTask(task, subTask))}

                      {addingSubTaskToId === task.id ? (
                        <div className="flex items-center space-x-2">
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
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add subtask</span>
                        </button>
                      )}
                    </div>
                  )}
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
