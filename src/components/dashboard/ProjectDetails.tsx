import { useState } from 'react';
import { useParams, Routes, Route, Link } from 'react-router-dom';
import { MessageSquare, Image, FileText } from 'lucide-react';
import type { Project } from '../../types';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project] = useState<Project>({
    id: id || '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'In Progress',
    deadline: '2024-04-01',
    moodboard: [],
    comments: []
  });

  const tabs = [
    { name: 'Overview', path: '', icon: FileText },
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
        <Route path="/moodboard" element={<ProjectMoodboard project={project} />} />
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