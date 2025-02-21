// app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../../context/notesStore'; // Adjust path
import { FormEvent } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Mail, Lock, AutoAwesome, Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';

const getErrorMessage = (error: string): string => {
  switch (error) {
    case 'CredentialsSignin':
      return 'Invalid credentials. Please try again.';
    case 'AccessDenied':
      return 'Account requires verification. Check your email.';
    default:
      return 'Authentication failed. Please try again.';
  }
};

async function loginUser({ email, password }: { email: string; password: string }) {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false, // Handle redirect manually
  });
  if (result?.error) throw new Error(result.error);
  return result;
}

export default function LoginPage() {
  const { email, password, showPassword, error, setEmail, setPassword, toggleShowPassword, setError } =
    useAppStore();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      window.location.href = '/'; // Redirect on success
    },
    onError: (err: Error) => setError(getErrorMessage(err.message)),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return; // Basic validation
    mutation.mutate({ email, password });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Form Section */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: '400px' },
            bgcolor: 'rgba(255, 255, 255, 0.97)',
            borderRadius: 4,
            p: 4,
            boxShadow: '0 24px 48px rgba(92, 106, 196, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AutoAwesome
              sx={{
                fontSize: 40,
                color: 'primary.main',
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(92, 106, 196, 0.2))',
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontFamily: 'Product Sans',
                mb: 1,
                color: 'text.primary',
                letterSpacing: '-0.5px',
              }}
            >
              Welcome to NeuroNotes
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontFamily: 'Product Sans',
                maxWidth: '300px',
                mx: 'auto',
              }}
            >
              Access your AI-powered knowledge base
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
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
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={mutation.isPending}
            />
            <TextField
              fullWidth
              required
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
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
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={mutation.isPending}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={mutation.isPending}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 700,
                fontFamily: 'Product Sans',
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: '0 8px 24px rgba(92, 106, 196, 0.3)',
                },
              }}
            >
              {mutation.isPending ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Unlock Knowledge'}
            </Button>
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', fontFamily: 'Product Sans', mt: 3, color: 'text.secondary' }}
            >
              New to NeuroNotes?{' '}
              <Link href="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>
                <span style={{ color: '#1976d2', fontWeight: 600 }}>Create Account</span>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* AI Feature Showcase Section */}
      <Box
        sx={{
          width: '50%',
          minHeight: '100vh',
          position: 'relative',
          display: { xs: 'none', md: 'block' },
          bgcolor: 'primary.dark',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(18, 22, 40, 0.9), rgba(18, 22, 40, 0.7))',
            zIndex: 1,
          },
        }}
      >
        <Image
          src="/loginFrame2.jpg"
          alt="AI Background"
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.4 }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 80,
            left: 40,
            zIndex: 2,
            color: 'white',
            maxWidth: '500px',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontFamily: 'Alkalami',
              mb: 3,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            Your Intelligent Thought Partner
          </Typography>
          <Box
            component="ul"
            sx={{
              pl: 2,
              '& li': { mb: 2, display: 'flex', alignItems: 'center', fontFamily: 'Product Sans', gap: 1.5 },
            }}
          >
            <li>
              <AutoAwesome fontSize="small" />
              <span>Smart Note Organization</span>
            </li>
            <li>
              <AutoAwesome fontSize="small" />
              <span>Natural Language Processing</span>
            </li>
            <li>
              <AutoAwesome fontSize="small" />
              <span>Knowledge Graph Visualization</span>
            </li>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}