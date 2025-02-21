// app/signup/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../../context/notesStore'; // Adjust path
import { FormEvent, ChangeEvent } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link as MUILink,
} from '@mui/material';
import { Person, Mail, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getErrorMessage = (error: string): string => {
  const errorMap: { [key: string]: string } = {
    'User already exists': 'This email is already registered. Please login instead.',
    'EmailExists': 'This email is already registered. Please login instead.',
    'WeakPassword': 'Password must be at least 6 characters.',
    'InvalidEmail': 'Please enter a valid email address.',
    'Default': 'An error occurred during registration. Please try again.',
  };
  return errorMap[error] || errorMap['Default']; // Fallback to 'Default'
};

async function signupUser({ name, email, password }: { name: string; email: string; password: string }) {
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export default function Signup() {
  const router = useRouter();
  const {
    name,
    email,
    password,
    showPassword,
    error,
    setName,
    setEmail,
    setPassword,
    toggleShowPassword,
    setError,
    resetAuth,
  } = useAppStore();

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      resetAuth();
      router.push('/login');
    },
    onError: (err: Error) => setError(getErrorMessage(err.message)),
  });

  const formValid = name.trim().length >= 2 && emailRegex.test(email) && password.length >= 6;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValid) return;
    mutation.mutate({ name: name.trim(), email, password });
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
        <Box component="form" onSubmit={handleSubmit} noValidate aria-labelledby="signupFormTitle">
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
            disabled={mutation.isPending}
          />
          <TextField
            fullWidth
            required
            label="Email Address"
            margin="normal"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
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
            disabled={mutation.isPending}
          />
          <TextField
            fullWidth
            required
            label="Password"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
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
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!error}
            helperText={password.length < 6 && password.length > 0 && 'Minimum 6 characters required'}
            disabled={mutation.isPending}
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
            disabled={mutation.isPending || !formValid}
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
                bgcolor: 'action.disabledBackground',
              },
            }}
          >
            {mutation.isPending ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
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
            <Link href="/login" passHref legacyBehavior>
              <MUILink
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Log in
              </MUILink>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}