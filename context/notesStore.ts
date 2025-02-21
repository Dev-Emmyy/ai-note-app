// app/context/notesStore.ts
import { create } from 'zustand';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color: string; // For NotesList later
};

type AppState = {
  // Auth state
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  error: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  toggleShowPassword: () => void;
  setError: (error: string) => void;
  resetAuth: () => void;
  // Notes state (for later)
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updatedNote: Partial<Note>) => void;
  deleteNote: (id: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  name: '',
  email: '',
  password: '',
  showPassword: false,
  error: '',
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email: email.trim().toLowerCase() }),
  setPassword: (password) => set({ password }),
  toggleShowPassword: () => set((state) => ({ showPassword: !state.showPassword })),
  setError: (error) => set({ error }),
  resetAuth: () => set({ name: '', email: '', password: '', showPassword: false, error: '' }),

  notes: [],
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note)),
    })),
  deleteNote: (id) => set((state) => ({ notes: state.notes.filter((note) => note.id !== id) })),
}));