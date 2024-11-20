import { useState, useEffect } from 'react';
import { Mail, X } from 'lucide-react';
import { sendTeamInvite, subscribeToTeamMembers, UserProfile } from '../../config/firebase';
import { auth } from '../../config/firebase';

interface TeamMemberWithId extends UserProfile {
  id: string;
}

export default function TeamView() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithId[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Only subscribe if user is authenticated
    if (!auth.currentUser) return;

    const unsubscribe = subscribeToTeamMembers(
      (members) => {
        console.log('Received team members:', members); // Debug log
        setTeamMembers(members as TeamMemberWithId[]);
      },
      (error) => {
        console.error('Error fetching team members:', error);
        setError('Failed to load team members');
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]); // Add auth.currentUser as dependency

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      setError('Please enter an email address');
      return;
    }

    if (!auth.currentUser) {
      setError('You must be logged in to invite team members');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await sendTeamInvite(inviteEmail);
      
      // Store the email for verification
      window.localStorage.setItem('emailForSignIn', inviteEmail);
      
      setSuccess(result.message);
      setInviteEmail('');
      
      // Close modal after short delay
      setTimeout(() => {
        setShowInviteModal(false);
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation. Please try again.');
      console.error('Invite error:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (!loading) {
      setShowInviteModal(false);
      setInviteEmail('');
      setError('');
      setSuccess('');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Team Member
        </button>
      </div>

      {error && !showInviteModal && (
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

      {/* Invite Modal */}
      {showInviteModal && (
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

            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                  placeholder="Enter team member's email"
                />
                <p className="mt-1 text-sm text-gray-500">
                  An account will be created and the team member will be notified to set their password.
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
}
