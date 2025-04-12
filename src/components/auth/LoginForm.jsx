import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../../services/authService';
import { Button } from '../common/Button';
import { InputField } from '../common/InputField';
import { Spinner } from 'lucide-react';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const { user, error } = await loginWithEmail(formData.email, formData.password);
      if (error) {
        handleAuthError(error);
      } else if (user) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrors({});
    try {
      const { user, error } = await loginWithGoogle();
      if (error) {
        handleAuthError(error);
      } else if (user) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error) => {
    let errorMessage = 'Login failed. Please try again.';
    switch (error?.code) {
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Account temporarily locked due to many failed attempts';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Google sign-in was canceled';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection';
        break;
    }
    setErrors({ general: errorMessage });
  };

  return (
    <div className="max-w-md w-full space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-900">
        Welcome Back
      </h2>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <InputField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={loading}
        />
        {errors.general && <p className="text-red-500 text-sm mt-1">{errors.general}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner className="animate-spin h-5 w-5 mr-2" /> : 'Login'}
        </Button>
      </form>

      <div className="flex items-center justify-center my-6">
        <div className="border-t border-gray-300 flex-grow"></div>
        <span className="mx-4 text-gray-500">OR</span>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>

      <Button variant="outline" onClick={handleGoogleLogin} disabled={loading} className="w-full">
        {loading ? <Spinner className="animate-spin h-5 w-5 mr-2" /> : <i className="lucide lucide-google mr-2" />}
        Continue with Google
      </Button>

      <div className="mt-4 text-center">
        <Link to="/signup" className="text-blue-500 hover:underline">
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;