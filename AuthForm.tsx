import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User } from '../../types';

interface AuthFormProps {
  type: 'login' | 'register';
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<User['role']>('student');
  const [showLogin, setShowLogin] = useState(type === 'login');
  const { login, register, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (showLogin) {
        await login(email, password);
      } else {
        await register(email, password, name, role);
        // Automatically switch to login after successful registration
        setShowLogin(true);
        // Clear form
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const toggleForm = () => {
    setShowLogin(!showLogin);
    // Clear form fields
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {showLogin ? 'Login to ConnectBook' : 'Create an Account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!showLogin && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value as User['role'])}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <Button type="submit" className="w-full">
          {showLogin ? 'Login' : 'Register'}
        </Button>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={toggleForm}
            className="text-sm text-blue-600 hover:underline"
          >
            {showLogin
              ? "Don't have an account? Register here"
              : 'Already have an account? Login here'}
          </button>
        </div>
      </form>
    </div>
  );
}