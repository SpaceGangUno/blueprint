import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  // Meta description for the Login page
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your project dashboard"
    >
      <Helmet>
        <title>Login | Blueprint Studios</title>
        <meta name="description" content="Sign in to access your Blueprint Studios dashboard. Manage your projects, view updates, and collaborate with our team." />
      </Helmet>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          id="email"
          type="email"
          label="Email address"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />

        <Input
          id="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={form.rememberMe}
              onChange={e => setForm({ ...form, rememberMe: e.target.checked })}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
