import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  // Meta description for the Register page
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to access your project dashboard"
    >
      <Helmet>
        <title>Register | Blueprint Studios</title>
        <meta name="description" content="Create an account with Blueprint Studios to access your project dashboard. Start collaborating with our team and track your project's progress." />
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

        <Button type="submit" isLoading={isLoading}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
