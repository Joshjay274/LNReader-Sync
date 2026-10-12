import React, { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './lib/firebase';
import Auth from './components/Auth';
import { sampleBooks, type Book } from './data/sampleBooks';

const STORAGE_KEY = 'lnreader-sync-books-v2';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [selectedBookId, setSelectedBookId] = useState<string>(sampleBooks[0].id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? books[0] ?? sampleBooks[0],
    [books, selectedBookId],
  );

  const selectedChapter =
    selectedBook.chapters[selectedBook.currentChapterIndex] ?? selectedBook.chapters[0];

  const chapterProgress = useMemo(() => {
    if (selectedBook.chapters.length === 0) return 0;
    return Math.round(((selectedBook.currentChapterIndex + 1) / selectedBook.chapters.length) * 100);
  }, [selectedBook]);

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

  const updateChapter = async (direction: number) => {
    const currentIndex = selectedBook.currentChapterIndex;
    const nextIndex = Math.min(
      Math.max(currentIndex + direction, 0),
      selectedBook.chapters.length - 1,
    );

    await saveBookUpdate({ currentChapterIndex: nextIndex });
  };

  const incrementProgress = async () => {
    const nextIndex = Math.min(selectedBook.currentChapterIndex + 1, selectedBook.chapters.length - 1);
    await saveBookUpdate({ currentChapterIndex: nextIndex });
  };

  const updateNotes = async (notes: string) => {
    await saveBookUpdate({ notes });
  };

  if (loading) {
    return <div className="screen loading-screen">Loading your reading dashboard...</div>;
  }

  if (!user) {
    return (
      <div className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">LNReader Sync</p>
            <h1>Web reading dashboard</h1>
          </div>
        </header>

        <main style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
          <Auth />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">LNReader Sync</p>
          <h1>Web reading dashboard</h1>
        </div>

        <button className="primary-button" onClick={handleSignOut}>
          Sign out
        </button>
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
                <small>{Math.round(((book.currentChapterIndex + 1) / book.chapters.length) * 100)}% read</small>
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
            <div className="status-pill">{chapterProgress}%</div>
          </div>

          <div className="progress-wrapper">
            <div className="progress-bar">
              <span style={{ width: `${chapterProgress}%` }} />
            </div>
          </div>

          <div className="reader-actions">
            <button
              className="secondary-button"
              onClick={() => updateChapter(-1)}
              disabled={selectedBook.currentChapterIndex === 0}
            >
              Previous chapter
            </button>
            <button className="secondary-button" onClick={incrementProgress}>
              Mark progress +1 chapter
            </button>
            <button
              className="secondary-button"
              onClick={() => updateChapter(1)}
              disabled={selectedBook.currentChapterIndex >= selectedBook.chapters.length - 1}
            >
              Next chapter
            </button>
          </div>

          <article className="chapter-card">
            <p className="eyebrow">Reading</p>
            <h3>{selectedChapter.title}</h3>
            {selectedChapter.content.map((paragraph, index) => (
              <p key={`${selectedChapter.id}-${index}`}>{paragraph}</p>
            ))}
          </article>

          <div className="chapter-list">
            {selectedBook.chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                className={`chapter-item ${index === selectedBook.currentChapterIndex ? 'current' : ''}`}
                onClick={async () => {
                  await saveBookUpdate({ currentChapterIndex: index });
                }}
              >
                {chapter.title}
              </button>
            ))}
          </div>

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
