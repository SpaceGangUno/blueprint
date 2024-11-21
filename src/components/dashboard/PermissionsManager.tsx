import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { UserProfile, Project, ProjectPermission } from '../../types';
import { useAuth } from '../../context/AuthContext';

const PermissionsManager: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as UserProfile));

        // Fetch all projects across all clients
        const clientsSnapshot = await getDocs(collection(db, 'clients'));
        const projectsPromises = clientsSnapshot.docs.map(async (clientDoc) => {
          const projectsSnapshot = await getDocs(collection(db, `clients/${clientDoc.id}/projects`));
          return projectsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              clientId: clientDoc.id,
              title: data.title,
              description: data.description,
              status: data.status,
              lastUpdated: data.lastUpdated,
              deadline: data.deadline,
              tasks: data.tasks || []
            } as Project;
          });
        });
        const allProjects = (await Promise.all(projectsPromises)).flat();

        setUsers(usersData.filter(user => user.role === 'team_member'));
        setProjects(allProjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updatePermission = async (userId: string, projectId: string, access: ProjectPermission['access']) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data() as UserProfile;

      const updatedPermissions = {
        ...userData.projectPermissions,
        [projectId]: {
          access,
          grantedAt: new Date().toISOString(),
          grantedBy: 'admin' // You might want to get the actual admin's ID here
        }
      };

      await updateDoc(userRef, {
        projectPermissions: updatedPermissions
      });

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? {
                ...user,
                projectPermissions: updatedPermissions
              }
            : user
        )
      );
    } catch (error) {
      console.error('Error updating permission:', error);
    }
  };

  if (!isAdmin) {
    return <div className="p-4">You don't have permission to access this page.</div>;
  }

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Project Permissions</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              {projects.map(project => (
                <th key={project.id} className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {project.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.displayName || user.email}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                {projects.map(project => {
                  const permission = user.projectPermissions?.[project.id];
                  return (
                    <td key={project.id} className="px-4 py-2 whitespace-nowrap">
                      <select
                        value={permission?.access || 'none'}
                        onChange={(e) => updatePermission(user.id, project.id, e.target.value as ProjectPermission['access'])}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="none">No Access</option>
                        <option value="read">Read</option>
                        <option value="write">Write</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionsManager;
