import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, Calendar, ArrowRight, ListTodo } from 'lucide-react';
import type { Project } from '../../types';

export default function ProjectBoard() {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      status: 'In Progress',
      deadline: '2024-04-01',
      moodboard: [],
      comments: [],
      tasks: [],
      documents: []
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Native mobile app for iOS and Android platforms',
      status: 'Under Review',
      deadline: '2024-05-15',
      moodboard: [],
      comments: [],
      tasks: [],
      documents: []
    }
  ]);

  const statusIcons = {
    'In Progress': <Clock className="w-5 h-5 text-blue-500" />,
    'Under Review': <AlertCircle className="w-5 h-5 text-yellow-500" />,
    'Completed': <CheckCircle className="w-5 h-5 text-green-500" />
  };

  const statusColors = {
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'Under Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Completed': 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects Overview</h1>
          <p className="text-gray-600 mt-1">Track and manage your active projects</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Filter
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
            New Project
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link
            key={project.id}
            to={`/dashboard/project/${project.id}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group-hover:border-blue-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  {statusIcons[project.status]}
                </div>
                <p className="text-gray-600 mb-6 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    statusColors[project.status]
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ListTodo className="w-4 h-4 mr-2" />
                  <span>
                    {project.tasks.filter(t => t.status === 'Completed').length} / {project.tasks.length} tasks completed
                  </span>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <span className="text-sm text-blue-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
