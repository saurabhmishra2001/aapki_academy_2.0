import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../../services/authService';
import { 
  Button, 
  TextField, 
  Typography, 
  Box, 
  Divider,
  CircularProgress
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const { user, error: authError } = await loginWithEmail(formData.email, formData.password);
            
            if (authError) {
                handleAuthError(authError);
                return;
            }
            
            if (user) {
                navigate('/dashboard', { replace: true });
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        
        try {
            const { user, error: authError } = await loginWithGoogle();
            
            if (authError) {
                handleAuthError(authError);
                return;
            }
            
            if (user) {
                navigate('/dashboard', { replace: true });
            }
        } catch (error) {
            handleAuthError(error);
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
        
        setError(errorMessage);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 450 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
                Welcome Back
            </Typography>
            
            <form onSubmit={handleEmailLogin}>
                <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    error={!!error}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    error={!!error}
                    sx={{ mb: 2 }}
                />
                
                {error && (
                    <Typography color="error" align="center" sx={{ mt: 1, mb: 2 }}>
                        {error}
                    </Typography>
                )}
                
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 2, py: 1.5 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
            </form>

            <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    OR
                </Typography>
            </Divider>

            <Button
                fullWidth
                variant="outlined"
                startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
                onClick={handleGoogleLogin}
                disabled={loading}
                sx={{ py: 1.5 }}
            >
                Continue with Google
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                        Forgot password?
                    </Link>
                </Typography>
                <Typography variant="body2">
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ fontWeight: 500 }}>
                        Sign up
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginForm;