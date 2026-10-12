import React, { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from './lib/firebase';

type Book = {
  id: string;
  title: string;
  author: string;
  chapter: string;
  progress: number;
  updatedAt: string;
  notes: string;
};

const defaultBooks: Book[] = [
  {
    id: 'book-1',
    title: 'The Last Sword Saint',
    author: 'A. R. Vale',
    chapter: 'Chapter 12: The Empty Hall',
    progress: 72,
    updatedAt: new Date().toISOString(),
    notes: 'The duel in the moonlit hall was the turning point.',
  },
  {
    id: 'book-2',
    title: 'Moonlit Guild',
    author: 'M. K. Sato',
    chapter: 'Chapter 8: Glass Contracts',
    progress: 39,
    updatedAt: new Date().toISOString(),
    notes: 'Need to remember the guild master’s final warning.',
  },
  {
    id: 'book-3',
    title: 'Ashes of the Seventh Tower',
    author: 'L. H. Thorn',
    chapter: 'Chapter 5: Signal from Below',
    progress: 88,
    updatedAt: new Date().toISOString(),
    notes: 'The underground chamber hints at a larger conspiracy.',
  },
];

const STORAGE_KEY = 'lnreader-sync-books';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>(defaultBooks);
  const [selectedBookId, setSelectedBookId] = useState<string>(defaultBooks[0].id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? books[0] ?? defaultBooks[0],
    [books, selectedBookId],
  );

  useEffect(() => {
    const savedBooks = localStorage.getItem(STORAGE_KEY);
    if (savedBooks) {
      try {
        const parsed: Book[] = JSON.parse(savedBooks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBooks(parsed);
          setSelectedBookId(parsed[0].id);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe: Unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!auth || !db || !user) {
      return;
    }

    const booksRef = collection(db, 'users', user.uid, 'books');
    const unsubscribe = onSnapshot(
      booksRef,
      (snapshot) => {
        const remoteBooks = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        })) as Book[];

        if (remoteBooks.length > 0) {
          setBooks(remoteBooks);
          setSelectedBookId(remoteBooks[0].id);
        }
      },
      () => {
        setError('Unable to sync library data from Firestore.');
      },
    );

    return () => unsubscribe();
  }, [user]);

  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) {
      setError('Firebase is not configured yet. Add your VITE_FIREBASE_* values to a .env file.');
      return;
    }

    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const saveBookUpdate = async (updates: Partial<Book>) => {
    const nextBook = { ...selectedBook, ...updates, updatedAt: new Date().toISOString() };
    const nextBooks = books.map((book) => (book.id === selectedBook.id ? nextBook : book));
    setBooks(nextBooks);

    if (!db || !user) {
      return;
    }

    const bookRef = doc(db, 'users', user.uid, 'books', selectedBook.id);
    await setDoc(bookRef, nextBook, { merge: true });
  };

  const incrementProgress = async () => {
    const nextProgress = Math.min(selectedBook.progress + 5, 100);
    await saveBookUpdate({ progress: nextProgress });
  };

  const updateNotes = async (notes: string) => {
    await saveBookUpdate({ notes });
  };

  const updateCurrentChapter = async () => {
    const nextChapter = selectedBook.chapter.includes('Chapter')
      ? selectedBook.chapter.replace(/Chapter \d+/, `Chapter ${Number(selectedBook.chapter.match(/\d+/)?.[0] ?? 1) + 1}`)
      : 'Chapter 2';

    await saveBookUpdate({ chapter: nextChapter });
  };

  if (loading) {
    return <div className="screen loading-screen">Loading your reading dashboard...</div>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">LNReader Sync</p>
          <h1>Web reading dashboard</h1>
        </div>

        {user ? (
          <button className="primary-button" onClick={handleSignOut}>
            Sign out
          </button>
        ) : (
          <button className="primary-button" onClick={handleGoogleSignIn} disabled={!isFirebaseConfigured}>
            {isFirebaseConfigured ? 'Continue with Google' : 'Firebase not configured'}
          </button>
        )}
      </header>

      {error ? <div className="status-banner error-banner">{error}</div> : null}

      {!isFirebaseConfigured ? (
        <div className="status-banner info-banner">
          Add the Firebase values from <strong>.env.example</strong> to <strong>.env</strong> to enable Google auth and cloud sync.
        </div>
      ) : null}

      <main className="content-grid">
        <aside className="sidebar">
          <div className="section-header">
            <h2>Library</h2>
            <span>{books.length} books</span>
          </div>

          {books.map((book) => (
            <button
              key={book.id}
              className={`book-card ${selectedBook.id === book.id ? 'active' : ''}`}
              onClick={() => setSelectedBookId(book.id)}
            >
              <div className="cover-art">{book.title.charAt(0)}</div>
              <div className="book-meta">
                <strong>{book.title}</strong>
                <span>{book.author}</span>
                <small>{book.progress}% read</small>
              </div>
            </button>
          ))}
        </aside>

        <section className="reader-panel">
          <div className="reader-header">
            <div>
              <p className="eyebrow">Current title</p>
              <h2>{selectedBook.title}</h2>
            </div>
            <div className="status-pill">{selectedBook.progress}%</div>
          </div>

          <div className="progress-wrapper">
            <div className="progress-bar">
              <span style={{ width: `${selectedBook.progress}%` }} />
            </div>
          </div>

          <div className="reader-actions">
            <button className="secondary-button" onClick={incrementProgress}>Mark progress +5%</button>
            <button className="secondary-button" onClick={updateCurrentChapter}>Next chapter</button>
          </div>

          <article className="chapter-card">
            <p className="eyebrow">Read chapter</p>
            <h3>{selectedBook.chapter}</h3>
            <p>
              The old tower had forgotten how to hold sunlight. Every stair led downward, and every step felt like a
              promise from the past. The guild’s seal still glimmered on the stone, and for the first time in months,
              the silence sounded like a warning.
            </p>
            <p>
              The protagonist moved carefully, testing the shape of the next room as if the air itself might betray the
              truth. Somewhere above, bells rang once and stopped. There was a word in the dust that no one was supposed
              to remember.
            </p>
          </article>

          <div className="notes-card">
            <div className="section-header compact">
              <h3>Notes</h3>
            </div>
            <textarea
              value={selectedBook.notes}
              onChange={(event) => updateNotes(event.target.value)}
              placeholder="Write down a key observation..."
            />
          </div>
        </section>
      </main>
    </div>
  );
}
