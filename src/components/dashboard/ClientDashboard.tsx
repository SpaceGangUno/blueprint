import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Plus, 
  RefreshCcw
} from 'lucide-react';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Interfaces
interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
  clientId: string;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  description: string;
  status: string;
  lastActivity: string;
  userId: string;
}

// Loading Skeleton Components
const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="animate-pulse bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <div className="text-red-600 mb-4">{error}</div>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      <RefreshCcw className="w-4 h-4 mr-2" />
      Retry
    </button>
  </div>
);

// Project Card Component
const ProjectCard = ({ project }: { project: Project }) => (
  <div className="border border-gray-200 rounded-lg p-4">
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
);

export default function ClientDashboard() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [authenticated, setAuthenticated] = useState(false);

  const fetchData = useCallback(async () => {
    if (!auth.currentUser || !clientId) return;

    try {
      setLoading(true);
      setError('');
      
      // Fetch client data
      const clientDoc = doc(db, 'clients', clientId);
      const clientSnap = await getDoc(clientDoc);
      
      if (!clientSnap.exists()) {
        throw new Error('Client not found');
      }

      const clientData = {
        id: clientSnap.id,
        ...clientSnap.data()
      } as Client;

      if (clientData.userId !== auth.currentUser.uid) {
        throw new Error('You do not have permission to view this client');
      }

      setClient(clientData);

      // Fetch projects
      const projectsQuery = query(
        collection(db, 'projects'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      const projectsSnap = await getDocs(projectsQuery);
      const projectsData = projectsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];

      setProjects(projectsData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      if (user) {
        fetchData();
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate, fetchData]);

  if (!authenticated) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-600">Please sign in to view client details.</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchData} />;
  }

  if (!client) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Client not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
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
          <button 
            onClick={() => {}} // Add new project handler
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Projects</h2>
        <div className="space-y-4">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No projects found. Create your first project to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
