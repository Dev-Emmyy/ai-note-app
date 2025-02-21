// app/context/notesStore.ts
import { create } from 'zustand';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color?: string;
};

type ChatMessage = {
  role: string; // 'user' or 'ai'
  content: string;
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
  // Notes state
  notes: Note[];
  title: string;
  content: string;
  deleteCandidate: string | null;
  isDeleting: boolean;
  prompt: string;
  result: string;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updatedNote: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  resetNoteForm: () => void;
  setDeleteCandidate: (id: string | null) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  setPrompt: (prompt: string) => void;
  setResult: (result: string) => void;
  resetAIGenerator: () => void;
  // Chat state
  chatMessage: string;
  chatHistory: ChatMessage[];
  setChatMessage: (message: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  resetChat: () => void;
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
  title: '',
  content: '',
  deleteCandidate: null,
  isDeleting: false,
  prompt: '',
  result: '',
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note)),
    })),
  deleteNote: (id) => set((state) => ({ notes: state.notes.filter((note) => note.id !== id) })),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  resetNoteForm: () => set({ title: '', content: '' }),
  setDeleteCandidate: (id) => set({ deleteCandidate: id }),
  setIsDeleting: (isDeleting) => set({ isDeleting }),
  setPrompt: (prompt) => set({ prompt }),
  setResult: (result) => set({ result }),
  resetAIGenerator: () => set({ prompt: '', result: '' }),

  // Chat state
  chatMessage: '',
  chatHistory: [],
  setChatMessage: (message) => set({ chatMessage: message }),
  addChatMessage: (message) => set((state) => ({ chatHistory: [...state.chatHistory, message] })),
  resetChat: () => set({ chatMessage: '', chatHistory: [] }),
}));