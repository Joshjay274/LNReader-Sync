import { create } from 'zustand';
import { AccountUser, Book, ReadingProgressEntry, Bookmark, Note, UserSettings } from '../types';
import { SyncService } from '../services/syncService';

type AppState = {
  // Auth
  user: AccountUser | null;
  isReady: boolean;
  isSigningIn: boolean;

  // Sync status
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncTime: string | null;
  syncError: string | null;

  // Data
  library: Book[];
  readingProgress: ReadingProgressEntry[];
  bookmarks: Bookmark[];
  notes: Note[];
  settings: UserSettings;

  // Actions
  initializeAuth: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setLibrary: (books: Book[]) => void;
  setReadingProgress: (entries: ReadingProgressEntry[]) => void;
  setBookmarks: (bookmarks: Bookmark[]) => void;
  setNotes: (notes: Note[]) => void;
  setSettings: (settings: UserSettings) => void;
  saveReadingProgress: (entry: ReadingProgressEntry) => Promise<void>;
  addBookmark: (bookmark: Bookmark) => Promise<void>;
  removeBookmark: (bookmarkId: string) => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  removeNote: (noteId: string) => Promise<void>;
  performFullSync: () => Promise<void>;
  updateSettings: (settings: UserSettings) => Promise<void>;
};

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  fontSize: 16,
  fontFamily: 'default',
  lineHeight: 1.6,
  autoSync: true,
  autoBackup: true,
};

export const useAuthStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isReady: false,
  isSigningIn: false,
  syncStatus: 'idle',
  lastSyncTime: null,
  syncError: null,
  library: [],
  readingProgress: [],
  bookmarks: [],
  notes: [],
  settings: DEFAULT_SETTINGS,

  // Initialize auth and load local data
  initializeAuth: async () => {
    try {
      const currentUser = await SyncService.getCurrentUser();
      set({ user: currentUser });

      // Load all local data
      const [progress, bookmarks, notes, settings, library] = await Promise.all([
        SyncService.loadLocalProgress(),
        SyncService.loadLocalBookmarks(),
        SyncService.loadLocalNotes(),
        SyncService.loadLocalSettings(),
        SyncService.loadLocalLibrary(),
      ]);

      set({
        readingProgress: progress,
        bookmarks,
        notes,
        settings,
        library,
        isReady: true,
      });

      // If user is logged in, perform sync
      if (currentUser?.uid) {
        try {
          await get().performFullSync();
        } catch (error) {
          console.warn('Auto-sync on init failed:', error);
        }
      }
    } catch (error) {
      console.error('Initialize auth error:', error);
      set({ isReady: true });
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    set({ isSigningIn: true, syncStatus: 'syncing' });
    try {
      const user = await SyncService.signInWithGoogle();
      set({ user, isSigningIn: false });

      // Sync local data to cloud
      const state = get();
      if (user.uid) {
        await Promise.all([
          SyncService.syncProgressToCloud(state.readingProgress, user.uid),
          SyncService.syncBookmarksToCloud(state.bookmarks, user.uid),
          SyncService.syncNotesToCloud(state.notes, user.uid),
          SyncService.syncSettingsToCloud(state.settings, user.uid),
          SyncService.syncLibraryToCloud(state.library, user.uid),
        ]);

        set({
          syncStatus: 'synced',
          lastSyncTime: new Date().toISOString(),
          syncError: null,
        });
      }
    } catch (error: any) {
      set({
        isSigningIn: false,
        syncStatus: 'error',
        syncError: error.message || 'Sign in failed',
      });
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await SyncService.signOut();
      set({
        user: null,
        syncStatus: 'idle',
        lastSyncTime: null,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Set library
  setLibrary: books => set({ library: books }),

  // Set reading progress
  setReadingProgress: entries => set({ readingProgress: entries }),

  // Set bookmarks
  setBookmarks: bookmarks => set({ bookmarks }),

  // Set notes
  setNotes: notes => set({ notes }),

  // Set settings
  setSettings: settings => set({ settings }),

  // Save reading progress
  saveReadingProgress: async entry => {
    await SyncService.saveLocalProgress(entry);
    const existing = get().readingProgress.filter(item => item.bookId !== entry.bookId);
    const next = [entry, ...existing];
    set({ readingProgress: next });

    // Sync to cloud if user is logged in
    const user = get().user;
    if (user?.uid) {
      try {
        set({ syncStatus: 'syncing' });
        await SyncService.syncProgressToCloud(next, user.uid);
        set({
          syncStatus: 'synced',
          lastSyncTime: new Date().toISOString(),
          syncError: null,
        });
      } catch (error) {
        console.warn('Sync progress error:', error);
        set({ syncStatus: 'error' });
      }
    }
  },

  // Add bookmark
  addBookmark: async bookmark => {
    const next = [bookmark, ...get().bookmarks];
    set({ bookmarks: next });
    await SyncService.saveLocalBookmarks(next);

    const user = get().user;
    if (user?.uid) {
      try {
        set({ syncStatus: 'syncing' });
        await SyncService.syncBookmarksToCloud(next, user.uid);
        set({ syncStatus: 'synced', lastSyncTime: new Date().toISOString() });
      } catch (error) {
        console.warn('Sync bookmarks error:', error);
      }
    }
  },

  // Remove bookmark
  removeBookmark: async bookmarkId => {
    const next = get().bookmarks.filter(b => b.id !== bookmarkId);
    set({ bookmarks: next });
    await SyncService.saveLocalBookmarks(next);

    const user = get().user;
    if (user?.uid) {
      try {
        await SyncService.syncBookmarksToCloud(next, user.uid);
      } catch (error) {
        console.warn('Sync bookmarks error:', error);
      }
    }
  },

  // Add note
  addNote: async note => {
    const next = [note, ...get().notes];
    set({ notes: next });
    await SyncService.saveLocalNotes(next);

    const user = get().user;
    if (user?.uid) {
      try {
        set({ syncStatus: 'syncing' });
        await SyncService.syncNotesToCloud(next, user.uid);
        set({ syncStatus: 'synced', lastSyncTime: new Date().toISOString() });
      } catch (error) {
        console.warn('Sync notes error:', error);
      }
    }
  },

  // Update note
  updateNote: async updatedNote => {
    const next = get().notes.map(n => (n.id === updatedNote.id ? updatedNote : n));
    set({ notes: next });
    await SyncService.saveLocalNotes(next);

    const user = get().user;
    if (user?.uid) {
      try {
        await SyncService.syncNotesToCloud(next, user.uid);
      } catch (error) {
        console.warn('Sync notes error:', error);
      }
    }
  },

  // Remove note
  removeNote: async noteId => {
    const next = get().notes.filter(n => n.id !== noteId);
    set({ notes: next });
    await SyncService.saveLocalNotes(next);

    const user = get().user;
    if (user?.uid) {
      try {
        await SyncService.syncNotesToCloud(next, user.uid);
      } catch (error) {
        console.warn('Sync notes error:', error);
      }
    }
  },

  // Perform full sync
  performFullSync: async () => {
    const user = get().user;
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      set({ syncStatus: 'syncing' });

      const synced = await SyncService.performFullSync(user.uid);

      set({
        readingProgress: synced.progress,
        bookmarks: synced.bookmarks,
        notes: synced.notes,
        settings: synced.settings,
        library: synced.library,
        syncStatus: 'synced',
        lastSyncTime: new Date().toISOString(),
        syncError: null,
      });
    } catch (error: any) {
      set({
        syncStatus: 'error',
        syncError: error.message || 'Sync failed',
      });
      throw error;
    }
  },

  // Update settings
  updateSettings: async newSettings => {
    set({ settings: newSettings });
    await SyncService.saveLocalSettings(newSettings);

    const user = get().user;
    if (user?.uid) {
      try {
        await SyncService.syncSettingsToCloud(newSettings, user.uid);
      } catch (error) {
        console.warn('Sync settings error:', error);
      }
    }
  },
}));
