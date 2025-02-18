'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography,
  Link,
  InputAdornment,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Mail, Lock, AutoAwesome,  Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case "CredentialsSignin":
        return "Invalid credentials. Please try again.";
      case "AccessDenied":
        return "Account requires verification. Check your email.";
      default:
        return "Authentication failed. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(getErrorMessage(result.error));
      } else {
        window.location.href = '/';
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      bgcolor: 'background.default',
    }}>
      {/* AI-Powered Form Section */}
      <Box sx={{
        width: { xs: '100%', md: '50%' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)'
      }}>
        <Box sx={{
          width: { xs: '100%', sm: '400px' },
          bgcolor: 'rgba(255, 255, 255, 0.97)',
          borderRadius: 4,
          p: 4,
          boxShadow: '0 24px 48px rgba(92, 106, 196, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AutoAwesome sx={{ 
              fontSize: 40, 
              color: 'primary.main', 
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(92, 106, 196, 0.2))'
            }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 800,
              fontFamily: "Product Sans",
              mb: 1,
              color: 'text.primary',
              letterSpacing: '-0.5px'
            }}>
              Welcome to NeuroNotes
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'text.secondary',
              fontFamily: "Product Sans",
              maxWidth: '300px',
              mx: 'auto'
            }}>
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
            />
            <TextField
              fullWidth
              required
              label="Password"
              type="password"
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
                    onClick={() => setShowPassword(!showPassword)}
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
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 700,
                fontFamily: "Product Sans",
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: '0 8px 24px rgba(92, 106, 196, 0.3)'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Unlock Knowledge'
              )}
            </Button>
            <Typography variant="body2" sx={{ 
              textAlign: 'center',
              fontFamily: "Product Sans", 
              mt: 3,
              color: 'text.secondary'
            }}>
              New to NeuroNotes?{' '}
              <Link 
                href="/signup" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  '&:hover': { color: 'primary.dark' }
                }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* AI Feature Showcase Section here */}
      <Box sx={{
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
          zIndex: 1
        }
      }}>
        <Image
          src="/loginFrame2.jpg"  // AI-themed abstract background
          alt="AI Background"
          fill
          priority
          style={{
            objectFit: 'cover',
            opacity: 0.4
          }}
        />
        <Box sx={{
          position: 'absolute',
          bottom: 80,
          left: 40,
          zIndex: 2,
          color: 'white',
          maxWidth: '500px'
        }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 800,
            fontFamily: 'Alkalami',
            mb: 3,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Your Intelligent Thought Partner
          </Typography>
          <Box component="ul" sx={{ 
            pl: 2,
            '& li': { 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              fontFamily: "Product Sans",
              gap: 1.5
            }
          }}>
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