import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { AccountUser, ReadingProgressEntry, Bookmark, Note, UserSettings, Book } from '../types';

const STORAGE_KEY_PROGRESS = 'lnreader_reading_progress';
const STORAGE_KEY_BOOKMARKS = 'lnreader_bookmarks';
const STORAGE_KEY_NOTES = 'lnreader_notes';
const STORAGE_KEY_SETTINGS = 'lnreader_settings';
const STORAGE_KEY_LIBRARY = 'lnreader_library';

export class SyncService {
  /**
   * Sign in with Google and authenticate with Firebase
   */
  static async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      if (!idToken) {
        throw new Error('No ID token returned by Google');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const result = await auth().signInWithCredential(googleCredential);

      const user: AccountUser = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };

      await AsyncStorage.setItem('lnreader_user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }

  /**
   * Sign out from Google and Firebase
   */
  static async signOut() {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('lnreader_user');
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }

  /**
   * Get current user from local storage
   */
  static async getCurrentUser(): Promise<AccountUser | null> {
    try {
      const raw = await AsyncStorage.getItem('lnreader_user');
      if (!raw) return null;
      return JSON.parse(raw) as AccountUser;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Save reading progress locally
   */
  static async saveLocalProgress(entry: ReadingProgressEntry) {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_PROGRESS);
      const list: ReadingProgressEntry[] = raw ? JSON.parse(raw) : [];

      const filtered = list.filter(item => item.bookId !== entry.bookId);
      const updated = [entry, ...filtered];

      await AsyncStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updated.slice(0, 200)));
    } catch (error) {
      console.error('Save local progress error:', error);
    }
  }

  /**
   * Load reading progress from local storage
   */
  static async loadLocalProgress(): Promise<ReadingProgressEntry[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_PROGRESS);
      return raw ? (JSON.parse(raw) as ReadingProgressEntry[]) : [];
    } catch (error) {
      console.error('Load local progress error:', error);
      return [];
    }
  }

  /**
   * Sync reading progress to Firestore
   */
  static async syncProgressToCloud(entries: ReadingProgressEntry[], uid: string) {
    try {
      const userRef = firestore().collection('users').doc(uid);

      // Update user metadata
      await userRef.set(
        {
          lastSyncAt: new Date().toISOString(),
          email: auth().currentUser?.email,
          displayName: auth().currentUser?.displayName,
        },
        { merge: true },
      );

      // Sync each reading progress entry
      const batch = firestore().batch();
      const progressRef = userRef.collection('readingProgress');

      for (const item of entries) {
        const docRef = progressRef.doc(item.bookId);
        batch.set(
          docRef,
          {
            ...item,
            syncedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }

      await batch.commit();
    } catch (error) {
      console.error('Sync progress to cloud error:', error);
      throw error;
    }
  }

  /**
   * Load reading progress from Firestore
   */
  static async loadProgressFromCloud(uid: string): Promise<ReadingProgressEntry[]> {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(uid)
        .collection('readingProgress')
        .orderBy('lastReadAt', 'desc')
        .limit(100)
        .get();

      return snapshot.docs.map(doc => doc.data() as ReadingProgressEntry);
    } catch (error) {
      console.error('Load progress from cloud error:', error);
      return [];
    }
  }

  /**
   * Save bookmarks locally
   */
  static async saveLocalBookmarks(bookmarks: Bookmark[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Save local bookmarks error:', error);
    }
  }

  /**
   * Load bookmarks from local storage
   */
  static async loadLocalBookmarks(): Promise<Bookmark[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return raw ? (JSON.parse(raw) as Bookmark[]) : [];
    } catch (error) {
      console.error('Load local bookmarks error:', error);
      return [];
    }
  }

  /**
   * Sync bookmarks to Firestore
   */
  static async syncBookmarksToCloud(bookmarks: Bookmark[], uid: string) {
    try {
      const userRef = firestore().collection('users').doc(uid);
      const batch = firestore().batch();

      for (const bookmark of bookmarks) {
        const docRef = userRef.collection('bookmarks').doc(bookmark.id);
        batch.set(docRef, { ...bookmark, syncedAt: new Date().toISOString() }, { merge: true });
      }

      await batch.commit();
    } catch (error) {
      console.error('Sync bookmarks to cloud error:', error);
      throw error;
    }
  }

  /**
   * Load bookmarks from Firestore
   */
  static async loadBookmarksFromCloud(uid: string): Promise<Bookmark[]> {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(uid)
        .collection('bookmarks')
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as Bookmark);
    } catch (error) {
      console.error('Load bookmarks from cloud error:', error);
      return [];
    }
  }

  /**
   * Save notes locally
   */
  static async saveLocalNotes(notes: Note[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    } catch (error) {
      console.error('Save local notes error:', error);
    }
  }

  /**
   * Load notes from local storage
   */
  static async loadLocalNotes(): Promise<Note[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_NOTES);
      return raw ? (JSON.parse(raw) as Note[]) : [];
    } catch (error) {
      console.error('Load local notes error:', error);
      return [];
    }
  }

  /**
   * Sync notes to Firestore
   */
  static async syncNotesToCloud(notes: Note[], uid: string) {
    try {
      const userRef = firestore().collection('users').doc(uid);
      const batch = firestore().batch();

      for (const note of notes) {
        const docRef = userRef.collection('notes').doc(note.id);
        batch.set(docRef, { ...note, syncedAt: new Date().toISOString() }, { merge: true });
      }

      await batch.commit();
    } catch (error) {
      console.error('Sync notes to cloud error:', error);
      throw error;
    }
  }

  /**
   * Load notes from Firestore
   */
  static async loadNotesFromCloud(uid: string): Promise<Note[]> {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(uid)
        .collection('notes')
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as Note);
    } catch (error) {
      console.error('Load notes from cloud error:', error);
      return [];
    }
  }

  /**
   * Save user settings locally
   */
  static async saveLocalSettings(settings: UserSettings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Save local settings error:', error);
    }
  }

  /**
   * Load user settings from local storage
   */
  static async loadLocalSettings(): Promise<UserSettings> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);
      return raw
        ? (JSON.parse(raw) as UserSettings)
        : {
            theme: 'dark',
            fontSize: 16,
            fontFamily: 'default',
            lineHeight: 1.6,
            autoSync: true,
            autoBackup: true,
          };
    } catch (error) {
      console.error('Load local settings error:', error);
      return {
        theme: 'dark',
        fontSize: 16,
        fontFamily: 'default',
        lineHeight: 1.6,
        autoSync: true,
        autoBackup: true,
      };
    }
  }

  /**
   * Sync settings to Firestore
   */
  static async syncSettingsToCloud(settings: UserSettings, uid: string) {
    try {
      await firestore().collection('users').doc(uid).collection('settings').doc('preferences').set(
        {
          ...settings,
          syncedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error('Sync settings to cloud error:', error);
      throw error;
    }
  }

  /**
   * Load settings from Firestore
   */
  static async loadSettingsFromCloud(uid: string): Promise<UserSettings> {
    try {
      const doc = await firestore()
        .collection('users')
        .doc(uid)
        .collection('settings')
        .doc('preferences')
        .get();

      if (doc.exists) {
        return doc.data() as UserSettings;
      }

      return {
        theme: 'dark',
        fontSize: 16,
        fontFamily: 'default',
        lineHeight: 1.6,
        autoSync: true,
        autoBackup: true,
      };
    } catch (error) {
      console.error('Load settings from cloud error:', error);
      return {
        theme: 'dark',
        fontSize: 16,
        fontFamily: 'default',
        lineHeight: 1.6,
        autoSync: true,
        autoBackup: true,
      };
    }
  }

  /**
   * Save library locally
   */
  static async saveLocalLibrary(books: Book[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(books));
    } catch (error) {
      console.error('Save local library error:', error);
    }
  }

  /**
   * Load library from local storage
   */
  static async loadLocalLibrary(): Promise<Book[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_LIBRARY);
      return raw ? (JSON.parse(raw) as Book[]) : [];
    } catch (error) {
      console.error('Load local library error:', error);
      return [];
    }
  }

  /**
   * Sync library to Firestore
   */
  static async syncLibraryToCloud(books: Book[], uid: string) {
    try {
      const userRef = firestore().collection('users').doc(uid);
      const batch = firestore().batch();

      for (const book of books) {
        const docRef = userRef.collection('library').doc(book.id);
        batch.set(docRef, { ...book, syncedAt: new Date().toISOString() }, { merge: true });
      }

      await batch.commit();
    } catch (error) {
      console.error('Sync library to cloud error:', error);
      throw error;
    }
  }

  /**
   * Load library from Firestore
   */
  static async loadLibraryFromCloud(uid: string): Promise<Book[]> {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(uid)
        .collection('library')
        .orderBy('addedAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as Book);
    } catch (error) {
      console.error('Load library from cloud error:', error);
      return [];
    }
  }

  /**
   * Perform a full sync: download all data from cloud and merge with local
   */
  static async performFullSync(uid: string) {
    try {
      const [cloudProgress, localProgress, cloudBookmarks, localBookmarks, cloudNotes, localNotes, cloudSettings, localSettings, cloudLibrary, localLibrary] =
        await Promise.all([
          this.loadProgressFromCloud(uid),
          this.loadLocalProgress(),
          this.loadBookmarksFromCloud(uid),
          this.loadLocalBookmarks(),
          this.loadNotesFromCloud(uid),
          this.loadLocalNotes(),
          this.loadSettingsFromCloud(uid),
          this.loadLocalSettings(),
          this.loadLibraryFromCloud(uid),
          this.loadLocalLibrary(),
        ]);

      // Merge with cloud taking precedence (more recent)
      const mergedProgress = this.mergeReadingProgress(localProgress, cloudProgress);
      const mergedBookmarks = this.mergeBookmarks(localBookmarks, cloudBookmarks);
      const mergedNotes = this.mergeNotes(localNotes, cloudNotes);
      const mergedLibrary = this.mergeLibrary(localLibrary, cloudLibrary);

      // Save merged data locally
      await Promise.all([
        this.saveLocalProgress(...mergedProgress),
        this.saveLocalBookmarks(mergedBookmarks),
        this.saveLocalNotes(mergedNotes),
        this.saveLocalLibrary(mergedLibrary),
      ]);

      return {
        progress: mergedProgress,
        bookmarks: mergedBookmarks,
        notes: mergedNotes,
        settings: cloudSettings,
        library: mergedLibrary,
      };
    } catch (error) {
      console.error('Full sync error:', error);
      throw error;
    }
  }

  private static mergeReadingProgress(
    local: ReadingProgressEntry[],
    cloud: ReadingProgressEntry[],
  ): ReadingProgressEntry[] {
    const map = new Map<string, ReadingProgressEntry>();

    for (const item of local) {
      map.set(item.bookId, item);
    }

    for (const item of cloud) {
      const existing = map.get(item.bookId);
      if (!existing || new Date(item.lastReadAt) > new Date(existing.lastReadAt)) {
        map.set(item.bookId, item);
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime(),
    );
  }

  private static mergeBookmarks(local: Bookmark[], cloud: Bookmark[]): Bookmark[] {
    const map = new Map<string, Bookmark>();

    for (const item of local) {
      map.set(item.id, item);
    }

    for (const item of cloud) {
      const existing = map.get(item.id);
      if (!existing || new Date(item.createdAt) > new Date(existing.createdAt)) {
        map.set(item.id, item);
      }
    }

    return Array.from(map.values());
  }

  private static mergeNotes(local: Note[], cloud: Note[]): Note[] {
    const map = new Map<string, Note>();

    for (const item of local) {
      map.set(item.id, item);
    }

    for (const item of cloud) {
      const existing = map.get(item.id);
      if (!existing || new Date(item.createdAt) > new Date(existing.createdAt)) {
        map.set(item.id, item);
      }
    }

    return Array.from(map.values());
  }

  private static mergeLibrary(local: Book[], cloud: Book[]): Book[] {
    const map = new Map<string, Book>();

    for (const item of local) {
      map.set(item.id, item);
    }

    for (const item of cloud) {
      const existing = map.get(item.id);
      if (!existing || new Date(item.lastReadAt) > new Date(existing.lastReadAt)) {
        map.set(item.id, item);
      }
    }

    return Array.from(map.values());
  }
}
