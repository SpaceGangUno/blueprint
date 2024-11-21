import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, ChevronDown, ChevronRight, Check } from 'lucide-react';
import Calendar from 'react-calendar';
import type { Value } from 'react-calendar/dist/cjs/shared/types';
import 'react-calendar/dist/Calendar.css';
import { 
  subscribeToClient, 
  subscribeToClientProjects,
  subscribeToClientEvents,
  addClientProject,
  updateClientProject,
  deleteClientProject,
  addClientEvent,
  updateClientEvent,
  deleteClientEvent,
  type CalendarEvent
} from '../../config/firebase';
import { type Client, type Project, type Task } from '../../types';
import EventModal from './modals/EventModal';
import ProjectModal from './modals/ProjectModal';

const ClientDetailsDashboard: React.FC = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState<Value>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!clientId) return;

    const unsubscribeClient = subscribeToClient(
      clientId,
      (updatedClient) => {
        setClient(updatedClient);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching client:', error);
        setError('Failed to load client details');
        setLoading(false);
      }
    );

    const unsubscribeProjects = subscribeToClientProjects(
      clientId,
      (updatedProjects) => setProjects(updatedProjects),
      (error) => console.error('Error fetching projects:', error)
    );

    const unsubscribeEvents = subscribeToClientEvents(
      clientId,
      (updatedEvents) => setEvents(updatedEvents),
      (error) => console.error('Error fetching events:', error)
    );

    return () => {
      unsubscribeClient();
      unsubscribeProjects();
      unsubscribeEvents();
    };
  }, [clientId]);

  const handleAddEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!clientId) return;
    try {
      await addClientEvent(clientId, eventData);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!clientId || !selectedEvent) return;
    try {
      await updateClientEvent(clientId, selectedEvent.id, eventData);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!clientId) return;
    try {
      await deleteClientEvent(clientId, eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleAddProject = async (projectData: Omit<Project, 'id'>) => {
    if (!clientId) return;
    try {
      await addClientProject(clientId, projectData);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleUpdateProject = async (projectData: Omit<Project, 'id'>) => {
    if (!clientId || !selectedProject) return;
    try {
      await updateClientProject(clientId, selectedProject.id, projectData);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!clientId) return;
    try {
      await deleteClientProject(clientId, projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const toggleTaskExpansion = (projectId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading client details...</div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Client not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/clients')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-sm font-semibold rounded-full
          ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 
            client.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'}`}>
          {client.status}
        </span>
      </div>

      {/* Calendar Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Calendar</h3>
          <button
            onClick={() => {
              setSelectedEvent(undefined);
              setShowEventModal(true);
            }}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </button>
        </div>
        <Calendar
          onChange={(value: Value) => setDate(value)}
          value={date}
          className="w-full border-0"
          tileContent={({ date }) => {
            const dayEvents = events.filter(event => {
              const eventDate = new Date(event.start);
              return eventDate.toDateString() === date.toDateString();
            });
            return dayEvents.length > 0 ? (
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-1 bg-blue-500 rounded-full mx-1"></div>
              </div>
            ) : null;
          }}
        />
        <div className="mt-4 space-y-2">
          {events
            .filter(event => {
              if (!date) return false;
              const eventDate = new Date(event.start);
              return eventDate.toDateString() === (date as Date).toDateString();
            })
            .map(event => (
              <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Projects</h2>
          <button
            onClick={() => {
              setSelectedProject(undefined);
              setShowProjectModal(true);
            }}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </button>
        </div>
        <div className="p-6">
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects yet</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleTaskExpansion(project.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedTasks[project.id] ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-sm font-medium rounded-full
                        ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'Sourcing' ? 'bg-purple-100 text-purple-800' :
                          project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {project.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowProjectModal(true);
                        }}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {expandedTasks[project.id] && (
                    <div className="mt-4 pl-6 space-y-3">
                      {project.tasks.map((task: Task) => (
                        <div key={task.id} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-gray-500">{task.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full
                              ${task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'}`}>
                              {task.status}
                            </span>
                          </div>

                          {task.miniTasks.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {task.miniTasks.map(miniTask => (
                                <div key={miniTask.id} className="flex items-center space-x-2 text-sm">
                                  <Check className={`w-4 h-4 ${miniTask.completed ? 'text-green-500' : 'text-gray-400'}`} />
                                  <span className={miniTask.completed ? 'line-through text-gray-500' : ''}>
                                    {miniTask.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 text-sm text-gray-500">
                    Last Updated: {new Date(project.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(undefined);
          }}
          onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          project={selectedProject}
          onClose={() => {
            setShowProjectModal(false);
            setSelectedProject(undefined);
          }}
          onSave={selectedProject ? handleUpdateProject : handleAddProject}
        />
      )}
    </div>
  );
};

export default ClientDetailsDashboard;
