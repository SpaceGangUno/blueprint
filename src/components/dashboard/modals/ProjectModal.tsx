import React, { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { type Project, type Task, type MiniTask } from '../../../types';

interface ProjectModalProps {
  project?: Project;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'Sourcing',
    tasks: project?.tasks || []
  });

  const [newTask, setNewTask] = useState('');
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [newMiniTask, setNewMiniTask] = useState('');

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      description: '',
      status: 'Todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      miniTasks: [],
      documents: []
    };

    setForm(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }));
    setNewTask('');
  };

  const handleAddMiniTask = (taskIndex: number) => {
    if (!newMiniTask.trim()) return;

    const miniTask: MiniTask = {
      id: Date.now().toString(),
      title: newMiniTask,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTasks = [...form.tasks];
    updatedTasks[taskIndex].miniTasks.push(miniTask);

    setForm(prev => ({
      ...prev,
      tasks: updatedTasks
    }));
    setNewMiniTask('');
  };

  const handleRemoveTask = (taskIndex: number) => {
    setForm(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, index) => index !== taskIndex)
    }));
  };

  const handleRemoveMiniTask = (taskIndex: number, miniTaskIndex: number) => {
    const updatedTasks = [...form.tasks];
    updatedTasks[taskIndex].miniTasks.splice(miniTaskIndex, 1);

    setForm(prev => ({
      ...prev,
      tasks: updatedTasks
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      lastUpdated: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as Project['status'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Sourcing">Sourcing</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tasks</label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  placeholder="Add a new task"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {form.tasks.map((task, taskIndex) => (
                <div key={task.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={task.status}
                        onChange={e => {
                          const updatedTasks = [...form.tasks];
                          updatedTasks[taskIndex].status = e.target.value as Task['status'];
                          setForm(prev => ({ ...prev, tasks: updatedTasks }));
                        }}
                        className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(taskIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mini Tasks */}
                  <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                    {task.miniTasks.map((miniTask, miniTaskIndex) => (
                      <div key={miniTask.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={miniTask.completed}
                            onChange={e => {
                              const updatedTasks = [...form.tasks];
                              updatedTasks[taskIndex].miniTasks[miniTaskIndex].completed = e.target.checked;
                              setForm(prev => ({ ...prev, tasks: updatedTasks }));
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className={`text-sm ${miniTask.completed ? 'line-through text-gray-500' : ''}`}>
                            {miniTask.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMiniTask(taskIndex, miniTaskIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {selectedTask === taskIndex && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMiniTask}
                          onChange={e => setNewMiniTask(e.target.value)}
                          placeholder="Add a subtask"
                          className="flex-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddMiniTask(taskIndex)}
                          className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedTask(selectedTask === taskIndex ? null : taskIndex)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {selectedTask === taskIndex ? 'Cancel' : 'Add Subtask'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
