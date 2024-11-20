import { useState, useRef } from 'react';
import { useParams, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Image, 
  FileText, 
  CheckSquare, 
  Plus, 
  X, 
  Edit2, 
  Save, 
  Trash2, 
  Upload,
  File,
  Send,
  Paperclip
} from 'lucide-react';
import type { Project, Task, MiniTask, MoodboardItem, DocumentItem, Comment } from '../../types';

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
    tasks: [],
    documents: []
  });

  const [newComment, setNewComment] = useState('');
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const commentFileInputRef = useRef<HTMLInputElement>(null);
  const documentFileInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const newDocuments: DocumentItem[] = files.map(file => ({
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        uploadedBy: 'Current User', // Replace with actual user info
        uploadedAt: new Date().toISOString()
      }));

      setProject({
        ...project,
        documents: [...project.documents, ...newDocuments]
      });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && commentAttachments.length === 0) return;

    const attachments = commentAttachments.map(file => ({
      type: file.type.startsWith('image/') ? 'image' : 'document' as 'image' | 'document',
      url: URL.createObjectURL(file),
      name: file.name
    }));

    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'Current User', // Replace with actual user info
      content: newComment,
      timestamp: new Date().toISOString(),
      attachments
    };

    setProject({
      ...project,
      comments: [...project.comments, comment]
    });

    setNewComment('');
    setCommentAttachments([]);
  };

  const handleCommentAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCommentAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
            project.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tasks Section */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <button
                onClick={() => documentFileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>
            <ProjectTasks project={project} setProject={setProject} />
          </div>
        </div>

        {/* Documents Section */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Documents</h2>
              <button
                onClick={() => documentFileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </button>
              <input
                ref={documentFileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleDocumentUpload}
              />
            </div>
            <div className="space-y-3">
              {project.documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <File className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    download={doc.name}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Download
                  </a>
                </div>
              ))}
              {project.documents.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No documents uploaded yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="col-span-12">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Comments</h2>
            <div className="space-y-4">
              {project.comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{comment.userId}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {comment.attachments.map((attachment, index) => (
                        attachment.type === 'image' ? (
                          <img
                            key={index}
                            src={attachment.url}
                            alt={attachment.name}
                            className="w-24 h-24 object-cover rounded"
                          />
                        ) : (
                          <a
                            key={index}
                            href={attachment.url}
                            download={attachment.name}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                          >
                            <File className="w-4 h-4" />
                            <span>{attachment.name}</span>
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <div className="flex items-start space-x-4">
                <div className="flex-grow">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 border rounded-lg resize-none"
                    rows={3}
                  />
                  {commentAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {commentAttachments.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <Paperclip className="w-4 h-4" />
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setCommentAttachments(prev => prev.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    type="button"
                    onClick={() => commentFileInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <input
                  ref={commentFileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleCommentAttachment}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
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
    <div className="space-y-4">
      {project.tasks.map(task => (
        <div key={task.id} className="bg-white rounded-lg shadow-sm border p-4">
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
  );
}
