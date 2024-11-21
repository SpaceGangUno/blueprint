import { useState, useEffect } from 'react';
import { Mail, X } from 'lucide-react';
import { createTeamMember, subscribeToTeamMembers } from '../../config/firebase';
import { auth } from '../../config/firebase';
import { type UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';

const TeamView: React.FC = () => {
  const { isAdmin } = useAuth();
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = subscribeToTeamMembers(
      (members: UserProfile[]) => {
        setTeamMembers(members);
      },
      (error: Error) => {
        console.error('Error fetching team members:', error);
        setError('Failed to load team members');
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    if (!auth.currentUser) {
      setError('You must be logged in to add team members');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await createTeamMember(email);
      setSuccess(result.message);
      setEmail('');
      
      // Close modal after short delay
      setTimeout(() => {
        setShowAddModal(false);
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create team member. Please try again.');
      console.error('Create team member error:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (!loading) {
      setShowAddModal(false);
      setEmail('');
      setError('');
      setSuccess('');
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        You don't have permission to access this page.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Team Member
        </button>
      </div>

      {error && !showAddModal && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map(member => (
          <div key={member.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.email.split('@')[0])}`}
                alt={member.email}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{member.email.split('@')[0]}</h3>
                <p className="text-gray-600 capitalize">{member.role.replace('_', ' ')}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {member.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      member.passwordUpdated 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.passwordUpdated ? 'Account Active' : 'Pending Setup'}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Joined: {new Date(member.createdAt).toLocaleDateString()}
                  </p>
                  {member.updatedAt && (
                    <p className="text-sm text-gray-500">
                      Last Updated: {new Date(member.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {teamMembers.length === 0 && !error && (
          <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No team members found. Add your first team member to get started.</p>
          </div>
        )}
      </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Team Member</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddTeamMember}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                  placeholder="Enter team member's email"
                />
                <p className="mt-1 text-sm text-gray-500">
                  An account will be created and the team member will receive an email to set their password.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
                  {success}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : 'Add Team Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;
