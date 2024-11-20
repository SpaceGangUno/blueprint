import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Plus, 
  ListTodo, 
  BarChart3,
  Folder
} from 'lucide-react';

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

export default function ClientDashboard() {
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [client] = useState({
    id: clientId,
    name: 'Acme Corporation',
    description: 'Global technology and innovation company',
    status: 'Active',
    lastActivity: '2024-03-15'
  });

  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      status: 'In Progress',
      deadline: '2024-04-01'
    }
  ]);

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review homepage design',
      status: 'pending',
      dueDate: '2024-03-20'
    },
    {
      id: '2',
      title: 'Finalize color palette',
      status: 'completed',
      dueDate: '2024-03-15'
    }
  ]);

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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
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
                <p className="text-2xl font-bold text-green-900">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-600 mb-2">Pending Tasks</h3>
                <p className="text-2xl font-bold text-yellow-900">
                  {tasks.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Projects</h2>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Add Project
              </button>
            </div>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
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
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Add Task
              </button>
            </div>
            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      onChange={() => {}}
                    />
                    <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                      {task.title}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
