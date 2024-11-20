import { useState } from 'react';
import { Mail, Phone, MapPin, X } from 'lucide-react';
import { sendTeamInvite } from '../../config/firebase';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  projects: string[];
}

export default function TeamView() {
  const [team] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Project Manager',
      email: 'sarah@blueprintstudios.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
      projects: ['Website Redesign', 'Mobile App']
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Lead Developer',
      email: 'michael@blueprintstudios.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen',
      projects: ['E-commerce Platform', 'Website Redesign']
    }
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await sendTeamInvite(inviteEmail);
      setSuccess('Invitation sent successfully!');
      setInviteEmail('');
      // Close modal after short delay
      setTimeout(() => {
        setShowInviteModal(false);
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      // Handle specific Firebase errors
      if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else {
        setError(err.message || 'Failed to send invitation. Please try again.');
      }
      console.error('Invite error:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowInviteModal(false);
    setInviteEmail('');
    setError('');
    setSuccess('');
    setLoading(false);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {team.map(member => (
          <div key={member.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {member.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {member.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {member.location}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Active Projects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.projects.map(project => (
                      <span
                        key={project}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Invite Team Member</h2>
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
                />
              </div>

              {error && (
                <div className="mb-4 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 text-green-600 text-sm">
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending Invite...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
