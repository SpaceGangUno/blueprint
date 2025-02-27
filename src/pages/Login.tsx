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
      <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-900/30 text-red-400 rounded-lg text-sm animate-fade-in border border-red-800">
            {error}
          </div>
        )}

        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Input
            id="email"
            type="email"
            label="Email address"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Input
            id="password"
            type="password"
            label="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-800 rounded transition-colors duration-300"
              checked={form.rememberMe}
              onChange={e => setForm({ ...form, rememberMe: e.target.checked })}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
              Remember me
            </label>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button type="submit" isLoading={isLoading} variant="gradient">
            Sign in
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
