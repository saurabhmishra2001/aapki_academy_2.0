// src/components/auth/SignupForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
    Button, Typography, Box, Divider
} from '@mui/material'; // Keeping these for layout and basic elements
import { signupWithEmail, loginWithGoogle } from '../../services/authService';

const SignupForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        displayName: '',
        email:        '',
        password:     '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAuthError = (error) => {
        const errorCode = error.code;
        switch (errorCode) {
        case 'auth/email-already-in-use':
            setError('Email already in use.');
            break;
        case 'auth/invalid-email':
            setError('Invalid email address.');
            break;
        case 'auth/weak-password':
            setError('Password should be at least 6 characters.');
            break;
        case 'auth/popup-closed-by-user':
            setError('Google sign-in was canceled.');
            break;
        case 'auth/operation-not-allowed':
            setError('Email/password accounts are not enabled.');
            break;
        default:
            setError('Signup failed. Please try again.');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
        return;
        }
        
        try {
            const { user, error } = await signupWithEmail(
                formData.email,
                formData.password,
                { displayName: formData.displayName }
            );

            if (error) throw error;
            
            navigate('/dashboard');
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        setError('');
        
        try {
            const { user, error } = await loginWithGoogle();
            if (error) throw error;
            navigate('/dashboard');
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            width: '100%',
            maxWidth: 450
        }}>
            <Typography variant="h3" sx={{ 
                fontWeight: 700,
                mb: 4,
                color: theme.palette.text.primary
            }}>
                Create Account
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Display Name"
                    variant="outlined"
                    margin="normal"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                />

                <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    margin="normal"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                />
                
                <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    helperText="Minimum 6 characters"
                />
                
                <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    margin="normal"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                />
                
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
                
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ 
                        mt: 3,
                        py: 1.5,
                        fontSize: '1.1rem'
                    }}
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>

            <Divider sx={{ my: 4 }}>
                <Typography variant="body2" color="text.secondary">
                    OR CONTINUE WITH
                </Typography>
            </Divider>

            <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                size="large"
                sx={{
                    py: 1.5,
                    fontSize: '1.1rem'
                }}
                onClick={handleGoogleSignup}
                disabled={loading}
            >
                Google
            </Button>

            <Typography variant="body2" sx={{ 
                mt: 3,
                textAlign: 'center',
                color: theme.palette.text.secondary
            }}>
                Already have an account?{' '}
                <Link 
                    to="/login"
                    style={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 500,
                    }}
                >
                    Sign in
                </Link>
            </Typography>
        </Box>
    );
};

export default SignupForm;