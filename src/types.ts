export type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  chapters: number;
  currentChapter: number;
  progress: number;
  lastReadAt: string;
  isFavorite: boolean;
};

export type AccountUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
};

export type ReadingProgressEntry = {
  id: string;
  bookId: string;
  title: string;
  chapter: number;
  progress: number;
  lastReadAt: string;
};

export type Bookmark = {
  id: string;
  bookId: string;
  chapterId: string;
  position: number;
  note?: string;
  createdAt: string;
};

export type Note = {
  id: string;
  bookId: string;
  chapterId: string;
  content: string;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type UserSettings = {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  autoSync: boolean;
  autoBackup: boolean;
};
