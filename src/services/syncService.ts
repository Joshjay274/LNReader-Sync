import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { AccountUser, ReadingProgressEntry } from '../types';

const STORAGE_KEY = 'lnreader_sync_progress';

export class SyncService {
  static async signInWithGoogle() {
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
  }

  static async signOut() {
    await auth().signOut();
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem('lnreader_user');
  }

  static async getCurrentUser(): Promise<AccountUser | null> {
    const raw = await AsyncStorage.getItem('lnreader_user');
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AccountUser;
    } catch {
      return null;
    }
  }

  static async saveLocalProgress(entry: ReadingProgressEntry) {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const list: ReadingProgressEntry[] = raw ? JSON.parse(raw) : [];

    const next = list.filter(item => item.bookId !== entry.bookId);
    next.unshift(entry);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 200)));
  }

  static async loadLocalProgress(): Promise<ReadingProgressEntry[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReadingProgressEntry[]) : [];
  }

  static async syncProgressToCloud(entries: ReadingProgressEntry[], uid: string) {
    const userRef = firestore().collection('users').doc(uid);
    await userRef.set(
      {
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    const progressRef = userRef.collection('readingProgress');

    await Promise.all(
      entries.map(item =>
        progressRef.doc(item.bookId).set(
          {
            ...item,
            syncedAt: new Date().toISOString(),
          },
          { merge: true },
        ),
      ),
    );
  }

  static async loadProgressFromCloud(uid: string): Promise<ReadingProgressEntry[]> {
    const snapshot = await firestore().collection('users').doc(uid).collection('readingProgress').get();
    return snapshot.docs.map(doc => doc.data() as ReadingProgressEntry);
  }
}
