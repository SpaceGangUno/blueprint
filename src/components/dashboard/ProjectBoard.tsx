import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, RefreshCcw, AlertCircle, PauseCircle } from 'lucide-react';
import { Project } from '../../types';

interface ProjectBoardProps {
  projects?: Project[];
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ projects = [] }) => {
  const navigate = useNavigate();

  const statusIcons: Record<Project['status'], JSX.Element> = {
    'In Progress': <RefreshCcw className="w-5 h-5 text-blue-500" />,
    'Under Review': <Clock className="w-5 h-5 text-yellow-500" />,
    'Completed': <CheckCircle className="w-5 h-5 text-green-500" />,
    'Sourcing': <AlertCircle className="w-5 h-5 text-purple-500" />,
    'On Hold': <PauseCircle className="w-5 h-5 text-gray-500" />
  };

  const statusColors: Record<Project['status'], string> = {
    'In Progress': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Sourcing': 'bg-purple-100 text-purple-800',
    'On Hold': 'bg-gray-100 text-gray-800'
  };

  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website',
      status: 'In Progress',
      lastUpdated: new Date().toISOString(),
      tasks: []
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'New mobile app for client services',
      status: 'Under Review',
      lastUpdated: new Date().toISOString(),
      tasks: []
    }
  ];

  const displayProjects = projects.length > 0 ? projects : mockProjects;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={() => navigate('/projects/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <div className="flex items-center space-x-2">
                {statusIcons[project.status]}
              </div>
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(project.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {displayProjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first project
          </p>
          <button
            onClick={() => navigate('/projects/new')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;
