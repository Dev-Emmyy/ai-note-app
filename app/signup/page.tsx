'use client';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Mail, Lock, Person } from '@mui/icons-material';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getErrorMessage = (error: string): string => {
  const errorMap: { [key: string]: string } = {
    'EmailExists': 'This email is already registered.',
    'WeakPassword': 'Password must be at least 6 characters.',
    'InvalidEmail': 'Please enter a valid email address.',
    'Default': 'An error occurred during registration. Please try again.'
  };
  return errorMap[error] || errorMap['Default'];
};

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formValid, setFormValid] = useState<boolean>(false);

  useEffect(() => {
    setFormValid(
      name.trim().length >= 2 &&
      emailRegex.test(email) &&
      password.length >= 6
    );
  }, [name, email, password]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValid) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim(), 
          password 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(getErrorMessage(err.message || 'Default'));
      } else {
        setError(getErrorMessage('Default'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
        p: 2,
      }}
      component="main"
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          bgcolor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: 3,
          p: 4,
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: 'Product Sans, sans-serif',
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
            }}
          >
            Create Account
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Product Sans, sans-serif',
              color: 'text.secondary',
              maxWidth: '300px',
              mx: 'auto',
            }}
          >
            Join AInote and unlock smart note-taking powered by AI
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby="signupFormTitle"
        >
          <TextField
            fullWidth
            required
            label="Full Name"
            margin="normal"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
              setError('');
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            error={!!error}
            helperText={name.length < 2 && name.length > 0 && 'Minimum 2 characters required'}
            disabled={loading}
          />
          <TextField
            fullWidth
            required
            label="Email Address"
            margin="normal"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value.trim());
              setError('');
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            error={!!error}
            helperText={!emailRegex.test(email) && email.length > 0 && 'Invalid email format'}
            disabled={loading}
          />
          <TextField
            fullWidth
            required
            label="Password"
            margin="normal"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setError('');
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            error={!!error}
            helperText={password.length < 6 && password.length > 0 && 'Minimum 6 characters required'}
            disabled={loading}
            inputProps={{ minLength: 6 }}
          />
          {error && (
            <Typography
              color="error"
              variant="body2"
              role="alert"
              aria-live="assertive"
              sx={{ mt: 1, textAlign: 'center' }}
            >
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!formValid || loading}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              fontFamily: 'Product Sans, sans-serif',
              textTransform: 'none',
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: '0 8px 24px rgba(63, 81, 181, 0.3)',
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Create Account'
            )}
          </Button>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Product Sans, sans-serif',
              textAlign: 'center',
              mt: 3,
              color: 'text.secondary',
            }}
          >
            Already have an account?{' '}
            <Link
              href="/login"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Log in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}