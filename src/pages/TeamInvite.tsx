import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { updateTeamMemberAccount, auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function TeamInvite() {
  // Meta description for the Team Invite page
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = searchParams.get('userId');

  useEffect(() => {
    // Get the email from localStorage (stored during invite send)
    const storedEmail = window.localStorage.getItem('emailForSignIn');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError('Invalid invitation link');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update the user's account with new password
      await updateTeamMemberAccount(userId, password);
      
      // Sign in with the new credentials
      await signInWithEmailAndPassword(auth, email, password);
      
      // Clear the stored email
      window.localStorage.removeItem('emailForSignIn');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update account. Please try again.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black/90 to-[#1E0B2C] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Team Invitation | Blueprint Studios</title>
        <meta name="description" content="Complete your Blueprint Studios team account setup. Join our creative team and start collaborating on exciting projects." />
      </Helmet>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-16 h-16 bg-[#FF6B00] rounded-lg mx-auto flex items-center justify-center">
          <span className="text-white text-2xl font-bold">BS</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Complete your team account setup
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  disabled
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm bg-gray-800 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm bg-gray-800 text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm bg-gray-800 text-white"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF6B00] hover:bg-[#E05A00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00] disabled:opacity-50"
              >
                {loading ? 'Setting up account...' : 'Complete Setup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
