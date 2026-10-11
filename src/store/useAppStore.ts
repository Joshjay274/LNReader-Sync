import { create } from 'zustand';
import { AccountUser, Book, ReadingProgressEntry } from '../types';
import { SyncService } from '../services/syncService';

type AuthState = {
  user: AccountUser | null;
  isReady: boolean;
  syncStatus: string;
  library: Book[];
  readingProgress: ReadingProgressEntry[];
  initializeAuth: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setLibrary: (books: Book[]) => void;
  setReadingProgress: (entries: ReadingProgressEntry[]) => void;
  saveReadingProgress: (entry: ReadingProgressEntry) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isReady: false,
  syncStatus: 'Not synced',
  library: [],
  readingProgress: [],

  initializeAuth: async () => {
    const currentUser = await SyncService.getCurrentUser();
    set({ user: currentUser, isReady: true });

    const localProgress = await SyncService.loadLocalProgress();
    set({ readingProgress: localProgress });
  },

  signInWithGoogle: async () => {
    const user = await SyncService.signInWithGoogle();
    set({ user, syncStatus: 'Google account linked' });

    const localProgress = await SyncService.loadLocalProgress();
    if (user.uid) {
      await SyncService.syncProgressToCloud(localProgress, user.uid);
      set({ readingProgress: localProgress, syncStatus: 'Progress synced to cloud' });
    }
  },

  signOut: async () => {
    await SyncService.signOut();
    set({ user: null, syncStatus: 'Signed out' });
  },

  setLibrary: books => set({ library: books }),

  setReadingProgress: entries => set({ readingProgress: entries }),

  saveReadingProgress: async entry => {
    await SyncService.saveLocalProgress(entry);
    const existing = get().readingProgress.filter(item => item.bookId !== entry.bookId);
    const next = [entry, ...existing];
    set({ readingProgress: next, syncStatus: 'Local progress saved' });

    if (get().user?.uid) {
      await SyncService.syncProgressToCloud(next, get().user.uid);
      set({ syncStatus: 'Cloud sync complete' });
    }
  },
}));
