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
