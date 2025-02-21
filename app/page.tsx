// app/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../context/notesStore'; // Adjust path
import { Box, AppBar, Toolbar, Typography, Button, Tabs, Tab } from '@mui/material';
import { useState, useEffect } from 'react';
import ExitToApp from '@mui/icons-material/ExitToApp';
import NotesList from './components/NotesList';
import CreateNoteButton from './components/CreateNoteButton';
import AINoteGenerator from './components/AINoteGenerator';
import AIChat from './components/AIChat';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color?: string;
}

async function fetchNotes(): Promise<Note[]> {
  const response = await fetch('/api/notes');
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
}

export default function Page() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const { setNotes } = useAppStore();

  const { data} = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    enabled: status === 'authenticated', // Only fetch when authenticated
  });

  // Populate store when data is fetched
  useEffect(() => {
    if (data) {
      console.log('Notes fetched in page.tsx:', data); // Debug log
      setNotes(data);
    }
  }, [data, setNotes]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status !== 'authenticated') return null;

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'rgba(244, 231, 211, 0.7)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(227, 208, 184, 0.3)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          color: 'rgba(0,0,0,0.8)',
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3 },
            minHeight: { xs: 'auto', sm: 72 },
            flexDirection: { xs: 'column', sm: 'row' },
            py: { xs: 1, sm: 0 },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Product Sans, sans-serif',
                fontWeight: 800,
                background: 'linear-gradient(45deg, #6d28d9 0%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                fontSize: '1.5rem',
              }}
            >
              NeuroNotes
            </Typography>
            <Button
              variant="outlined"
              onClick={() => signOut({ callbackUrl: '/login' })}
              sx={{ borderRadius: 3, textTransform: 'none', px: 2, borderColor: 'divider', color: 'text.primary', minWidth: 0 }}
            >
              <ExitToApp />
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 3, flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Product Sans, sans-serif',
                fontWeight: 800,
                background: 'linear-gradient(45deg, #6d28d9 0%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                fontSize: '2rem',
              }}
            >
              NeuroNotes
            </Typography>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="standard"
              sx={{ minHeight: 'auto', '& .MuiTab-root': { minWidth: 'auto', minHeight: '48px', fontSize: '1rem', textTransform: 'none', color: 'text.secondary', '&.Mui-selected': { color: 'primary.main', fontWeight: 600 } }, '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: 'primary.main' } }}
            >
              <Tab label="My Notes" />
              <Tab label="AI Generator" />
              <Tab label="AI Chat" />
            </Tabs>
          </Box>

          <Box sx={{ display: { xs: 'block', sm: 'none' }, width: '100%' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{ minHeight: 'auto', '& .MuiTab-root': { minWidth: 'auto', minHeight: '40px', fontSize: '0.875rem', textTransform: 'none', color: 'text.secondary', '&.Mui-selected': { color: 'primary.main', fontWeight: 600 } }, '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: 'primary.main' } }}
            >
              <Tab label="My Notes" icon="📝" iconPosition="start" />
              <Tab label="AI Generator" icon="🤖" iconPosition="start" />
              <Tab label="AI Chat" icon="💭" iconPosition="start" />
            </Tabs>
          </Box>

          <Button
            variant="outlined"
            startIcon={<ExitToApp />}
            onClick={() => signOut({ callbackUrl: '/login' })}
            sx={{ display: { xs: 'none', sm: 'flex' }, borderRadius: 3, textTransform: 'none', px: 3, borderColor: 'divider', color: 'text.primary', ml: 'auto' }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1400, mx: 'auto', pb: { xs: 8, sm: 4 } }}>
        {activeTab === 0 && (
          <Box>
            <NotesList />
            <CreateNoteButton />
          </Box>
        )}
        {activeTab === 1 && <AINoteGenerator />}
        {activeTab === 2 && <AIChat sx={{ height: { xs: 'calc(100vh - 180px)', sm: '70vh' }, display: 'flex', flexDirection: 'column' }} />}
      </Box>
    </Box>
  );
}