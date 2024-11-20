import { useState, useRef } from 'react';
import { useParams, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MessageSquare, Image, FileText, CheckSquare, Plus, X, Edit2, Save, Trash2, Upload } from 'lucide-react';
import type { Project, Task, MiniTask, MoodboardItem } from '../../types';

export default function ProjectDetails() {
  const { clientId, projectId } = useParams();
  const location = useLocation();
  const [project, setProject] = useState<Project>({
    id: projectId || '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'In Progress',
    deadline: '2024-04-01',
    moodboard: [],
    comments: [],
    tasks: []
  });

  const tabs = [
    { name: 'Overview', path: '', icon: FileText },
    { name: 'Tasks', path: 'tasks', icon: CheckSquare },
    { name: 'Mood Board', path: 'moodboard', icon: Image },
    { name: 'Comments', path: 'comments', icon: MessageSquare }
  ];

  const getBasePath = () => `/dashboard/client/${clientId}/project/${projectId}`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="text-gray-600 mt-1">{project.description}</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const isActive = location.pathname === `${getBasePath()}/${tab.path}` ||
                           (tab.path === '' && location.pathname === getBasePath());
            return (
              <Link
                key={tab.name}
                to={`${getBasePath()}/${tab.path}`}
                className={`
                  border-b-2 pb-4 px-1
                  hover:border-gray-300 hover:text-gray-700
                  flex items-center space-x-2
                  ${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<ProjectOverview project={project} />} />
        <Route path="/tasks" element={<ProjectTasks project={project} setProject={setProject} />} />
        <Route path="/moodboard" element={<ProjectMoodboard project={project} setProject={setProject} />} />
        <Route path="/comments" element={<ProjectComments project={project} />} />
      </Routes>
    </div>
  );
}

function ProjectOverview({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Project Details</h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Status</dt>
          <dd className="mt-1 text-sm text-gray-900">{project.status}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Deadline</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date(project.deadline).toLocaleDateString()}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Tasks Progress</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {project.tasks.filter(t => t.status === 'Completed').length} / {project.tasks.length} completed
          </dd>
        </div>
      </dl>
    </div>
  );
}

function ProjectTasks({ project, setProject }: { project: Project; setProject: (project: Project) => void }) {
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'Todo',
      miniTasks: []
    };

    setProject({
      ...project,
      tasks: [...project.tasks, task]
    });
    setNewTask({ title: '', description: '' });
  };

  const deleteTask = (taskId: string) => {
    setProject({
      ...project,
      tasks: project.tasks.filter(t => t.id !== taskId)
    });
  };

  const updateTask = (taskId: string) => {
    if (!editedTask) return;
    
    setProject({
      ...project,
      tasks: project.tasks.map(t => 
        t.id === taskId ? editedTask : t
      )
    });
    setEditingTask(null);
    setEditedTask(null);
  };

  const addMiniTask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    
    const miniTask: MiniTask = {
      id: Date.now().toString(),
      title,
      completed: false
    };

    setProject({
      ...project,
      tasks: project.tasks.map(task => 
        task.id === taskId
          ? { ...task, miniTasks: [...task.miniTasks, miniTask] }
          : task
      )
    });
  };

  const toggleMiniTask = (taskId: string, miniTaskId: string) => {
    setProject({
      ...project,
      tasks: project.tasks.map(task => 
        task.id === taskId
          ? {
              ...task,
              miniTasks: task.miniTasks.map(mt =>
                mt.id === miniTaskId
                  ? { ...mt, completed: !mt.completed }
                  : mt
              )
            }
          : task
      )
    });
  };

  const deleteMiniTask = (taskId: string, miniTaskId: string) => {
    setProject({
      ...project,
      tasks: project.tasks.map(task => 
        task.id === taskId
          ? {
              ...task,
              miniTasks: task.miniTasks.filter(mt => mt.id !== miniTaskId)
            }
          : task
      )
    });
  };

  return (
    <div className="space-y-6">
      {/* Add New Task Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {project.tasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow p-6">
            {editingTask === task.id ? (
              // Edit Task Form
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedTask?.title || ''}
                  onChange={e => setEditedTask({ ...editedTask!, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  value={editedTask?.description || ''}
                  onChange={e => setEditedTask({ ...editedTask!, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateTask(task.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setEditedTask(null);
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              // Task View
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingTask(task.id);
                        setEditedTask(task);
                      }}
                      className="p-1 text-gray-600 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mini Tasks */}
                <div className="space-y-2">
                  <h4 className="font-medium">Mini Tasks</h4>
                  {task.miniTasks.map(miniTask => (
                    <div key={miniTask.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={miniTask.completed}
                          onChange={() => toggleMiniTask(task.id, miniTask.id)}
                          className="rounded"
                        />
                        <span className={miniTask.completed ? 'line-through text-gray-500' : ''}>
                          {miniTask.title}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteMiniTask(task.id, miniTask.id)}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.currentTarget.elements.namedItem('miniTask') as HTMLInputElement;
                      addMiniTask(task.id, input.value);
                      input.value = '';
                    }}
                    className="flex items-center space-x-2"
                  >
                    <input
                      name="miniTask"
                      type="text"
                      placeholder="Add mini task"
                      className="flex-1 px-3 py-1 border rounded-lg"
                    />
                    <button
                      type="submit"
                      className="p-1 text-gray-600 hover:text-blue-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectMoodboard({ project, setProject }: { project: Project; setProject: (project: Project) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<MoodboardItem | null>(null);
  const [note, setNote] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // Handle file drops
    if (e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      await handleFiles(files);
      return;
    }

    // Handle image repositioning
    if (draggedItem) {
      const board = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - board.left - dragOffset.x;
      const y = e.clientY - board.top - dragOffset.y;

      setProject({
        ...project,
        moodboard: project.moodboard.map(item =>
          item.id === draggedItem
            ? { ...item, position: { x, y } }
            : item
        )
      });
      setDraggedItem(null);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    for (const file of imageFiles) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const newItem: MoodboardItem = {
          id: Date.now().toString(),
          imageUrl: e.target?.result as string,
          note: '',
          position: {
            x: Math.random() * 300 + 100, // More centered initial position
            y: Math.random() * 300 + 100
          }
        };

        setProject({
          ...project,
          moodboard: [...project.moodboard, newItem]
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (item: MoodboardItem) => {
    setSelectedImage(item);
    setNote(item.note);
  };

  const updateNote = () => {
    if (!selectedImage) return;

    setProject({
      ...project,
      moodboard: project.moodboard.map(item =>
        item.id === selectedImage.id
          ? { ...item, note }
          : item
      )
    });

    setSelectedImage(null);
    setNote('');
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    const target = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - target.left,
      y: e.clientY - target.top
    });
    setDraggedItem(id);
    
    // Add visual feedback during drag
    const img = e.currentTarget.querySelector('img');
    if (img) {
      const ghost = img.cloneNode(true) as HTMLImageElement;
      ghost.style.opacity = '0.5';
      ghost.style.position = 'absolute';
      ghost.style.left = '-9999px';
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, dragOffset.x, dragOffset.y);
      setTimeout(() => document.body.removeChild(ghost), 0);
    }
  };

  const deleteImage = (id: string) => {
    setProject({
      ...project,
      moodboard: project.moodboard.filter(item => item.id !== id)
    });
    setSelectedImage(null);
    setNote('');
  };

  const addQuickNote = (item: MoodboardItem) => {
    const quickNote = prompt('Add a quick note:', item.note);
    if (quickNote !== null) {
      setProject({
        ...project,
        moodboard: project.moodboard.map(mItem =>
          mItem.id === item.id
            ? { ...mItem, note: quickNote }
            : mItem
        )
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <p className="text-sm text-gray-500">
            or drag and drop images onto the board
          </p>
        </div>
      </div>

      {/* Moodboard Canvas */}
      <div
        className={`bg-white rounded-lg shadow h-[600px] relative overflow-hidden ${
          isDragging ? 'border-2 border-dashed border-blue-400' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {project.moodboard.map(item => (
          <div
            key={item.id}
            className={`absolute cursor-move transition-transform ${
              draggedItem === item.id ? 'opacity-50 scale-105' : ''
            }`}
            style={{
              left: item.position.x,
              top: item.position.y,
              transform: draggedItem === item.id ? 'scale(1.05)' : 'scale(1)'
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
          >
            <div className="relative group">
              <img
                src={item.imageUrl}
                alt={item.note}
                className="w-48 h-48 object-cover rounded-lg shadow-lg"
                onClick={() => handleImageClick(item)}
              />
              {item.note && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm rounded-b-lg">
                  {item.note}
                </div>
              )}
              <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => addQuickNote(item)}
                  className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  title="Add Quick Note"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteImage(item.id)}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Delete Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Note Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Note</h3>
            <div className="mb-4">
              <img
                src={selectedImage.imageUrl}
                alt="Selected"
                className="w-32 h-32 object-cover rounded-lg mx-auto"
              />
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              rows={3}
              placeholder="Add a note to this image..."
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setNote('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={updateNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectComments({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      {project.comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {project.comments.map(comment => (
            <div key={comment.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{comment.userId}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
