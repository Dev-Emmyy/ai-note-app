'use client';
import { Box, AppBar, Toolbar, Typography, Button, Tabs, Tab, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import ExitToApp from '@mui/icons-material/ExitToApp';
import NotesList from "./components/NotesList";
import CreateNoteButton from "./components/CreateNoteButton";
import AINoteGenerator from "./components/AINoteGenerator";
import AIChat from "./components/AIChat";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color?: string;
}

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchNotes();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status !== 'authenticated') return null;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      position: 'relative',
    }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ 
        bgcolor: 'rgba(244, 231, 211, 0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(227, 208, 184, 0.3)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
        color: 'rgba(0,0,0,0.8)'
      }}>
        <Toolbar sx={{ 
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 64, sm: 72 } 
        }}>
          <Typography variant="h4" sx={{ 
            fontFamily: 'Product Sans, sans-serif',
            fontWeight: 800,
            background: 'linear-gradient(45deg, #6d28d9 0%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
            NeuroNotes
          </Typography>

          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ 
              ml: { xs: 1, sm: 4 },
              minHeight: 'auto',
              '& .MuiTab-root': {
                minWidth: 'auto',
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textTransform: 'none',
              },
              '& .MuiTabs-flexContainer': {
                gap: { xs: 1, sm: 2 },
              }
            }}
          >
            <Tab label="My Notes" />
            <Tab label="AI Generator" />
            <Tab label="AI Chat" />
          </Tabs>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            ml: 'auto',
            '& button': {
              py: { xs: 0.5, sm: 1 }
            }
          }}>
            <Button
              variant="outlined"
              startIcon={!isMobile && <ExitToApp />}
              onClick={() => signOut({ callbackUrl: '/login' })}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'action.selected',
                  backgroundColor: 'action.hover'
                }
              }}
            >
              {isMobile ? <ExitToApp /> : 'Sign Out'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ 
        p: { xs: 2, sm: 4 },
        maxWidth: 1400,
        mx: 'auto',
        pb: { xs: 8, sm: 4 } // Add bottom padding for mobile floating button
      }}>
        {activeTab === 0 && (
          <>
            {isLoading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 4,
                height: '50vh',
                alignItems: 'center'
              }}>
                <CircularProgress />
              </Box>
            ) : (
              <NotesList notes={notes} />
            )}
            <CreateNoteButton/>
          </>
        )}

        {activeTab === 1 && (
          <AINoteGenerator notes={notes} />
        )}

        {activeTab === 2 && (
          <AIChat sx={{
            height: { xs: 'calc(100vh - 180px)', sm: '70vh' },
            display: 'flex',
            flexDirection: 'column'
          }} />
        )}
      </Box>
    </Box>
  );
}