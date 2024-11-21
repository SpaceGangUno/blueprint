import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader,
  X,
  Plus,
  Check,
  ChevronDown,
  ChevronRight,
  Calendar,
  FileText,
  Paperclip,
  Edit2,
  Save
} from 'lucide-react';
import type { Project, Task, MiniTask, SubTaskFile } from '../../types';
import { subscribeToTeamMembers, UserProfile, storage } from '../../config/firebase';
import { auth, db } from '../../config/firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';

type TeamMemberWithId = UserProfile & { id: string };

export default function ProjectDetails() {
  // ... (previous state and other functions remain the same until handleFileUpload)

  const handleFileUpload = async (taskId: string, subTaskId: string, files: FileList) => {
    if (!project || !user || !projectId) {
      console.error('Missing required data:', { project: !!project, user: !!user, projectId: !!projectId });
      setUploadError('Missing required data for upload');
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [subTaskId]: true }));
    setUploadError(null);

    const now = new Date().toISOString();
    const newFiles: SubTaskFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('Processing file:', {
          name: file.name,
          size: file.size,
          type: file.type
        });

        const path = `projects/${projectId}/subtasks/${subTaskId}/${file.name}`;
        console.log('Creating storage reference at path:', path);
        const fileRef = ref(storage, path);
        
        console.log('Starting file upload...');
        try {
          const snapshot = await uploadBytes(fileRef, file);
          console.log('Upload completed:', snapshot.metadata);
          
          console.log('Getting download URL...');
          const downloadUrl = await getDownloadURL(snapshot.ref);
          console.log('Download URL obtained:', downloadUrl);
          
          newFiles.push({
            id: Date.now().toString() + i,
            name: file.name,
            url: downloadUrl,
            type: file.type,
            uploadedBy: user.email || 'unknown',
            uploadedAt: now,
            size: file.size
          });
          console.log('File processed successfully');
        } catch (uploadError: any) {
          console.error('Error in upload process:', {
            code: uploadError.code,
            message: uploadError.message,
            serverResponse: uploadError.serverResponse
          });
          throw uploadError;
        }
      }

      console.log('All files processed, updating project...');
      const updatedTasks = project.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              updatedAt: now,
              miniTasks: task.miniTasks.map(subTask =>
                subTask.id === subTaskId
                  ? {
                      ...subTask,
                      files: [...(subTask.files || []), ...newFiles],
                      updatedAt: now
                    }
                  : subTask
              )
            }
          : task
      );

      await updateProject({
        tasks: updatedTasks,
        lastUpdated: now
      });
      console.log('Project updated with new files');
    } catch (err: any) {
      console.error('Upload error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      setUploadError(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [subTaskId]: false }));
    }
  };

  // ... (rest of the component remains the same)
}
