import { useState } from 'react';
import { useParams, Routes, Route, Link } from 'react-router-dom';
import { MessageSquare, Image, FileText, CheckSquare, Plus, X, Edit2, Save, Trash2 } from 'lucide-react';
import type { Project, Task, MiniTask } from '../../types';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<Project>({
    id: id || '1',
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="text-gray-600 mt-1">{project.description}</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <Link
              key={tab.name}
              to={`/dashboard/project/${id}/${tab.path}`}
              className={`
                border-b-2 border-transparent pb-4 px-1
                hover:border-gray-300 hover:text-gray-700
                flex items-center space-x-2
              `}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<ProjectOverview project={project} />} />
        <Route path="/tasks" element={<ProjectTasks project={project} setProject={setProject} />} />
        <Route path="/moodboard" element={<ProjectMoodboard project={project} />} />
        <Route path="/comments" element={<ProjectComments project={project} />} />
      </Routes>
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

function ProjectMoodboard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Mood Board</h2>
      {project.moodboard.length === 0 ? (
        <p className="text-gray-500">No mood board items yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {project.moodboard.map(item => (
            <div key={item.id} className="relative aspect-square">
              <img
                src={item.imageUrl}
                alt={item.note}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
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
