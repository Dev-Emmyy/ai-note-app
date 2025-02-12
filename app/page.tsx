'use client';
import { Box } from '@mui/material';
import HomeHeader from "./components/HomeHeader";
import DateSelector from "./components/DateSelector";
import CategoryFilter from "./components/CategoryFilter";
import NotesList from "./components/NotesList";
import CreateNoteButton from "./components/CreateNoteButton";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
    router.push('/login');
    }
  }, [status, router]);
    // Only show content if authenticated
    if (status === 'authenticated') {
      return (
        <Box sx={{padding: 4}}>
          <HomeHeader />
          <DateSelector />
          <CategoryFilter />
          <NotesList />
          <CreateNoteButton />
        </Box>
      );
  }
    return null;
}





