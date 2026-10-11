import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/useAppStore';
import { theme } from '../theme';
import BookCard from '../components/BookCard';

const MOCK_BOOKS = [
  {
    id: 'book-1',
    title: 'The Last Scribe',
    author: 'Alina Kestrel',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    genre: 'Fantasy',
    chapters: 34,
    currentChapter: 20,
    progress: 62,
    lastReadAt: '2026-10-11',
    isFavorite: true,
  },
  {
    id: 'book-2',
    title: 'Moonlit Hollow',
    author: 'Rin Sato',
    cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80',
    genre: 'Mystery',
    chapters: 28,
    currentChapter: 12,
    progress: 41,
    lastReadAt: '2026-10-09',
    isFavorite: false,
  },
  {
    id: 'book-3',
    title: 'Neon Tides',
    author: 'Milo Arin',
    cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80',
    genre: 'Sci-Fi',
    chapters: 41,
    currentChapter: 29,
    progress: 71,
    lastReadAt: '2026-10-08',
    isFavorite: true,
  },
];

export default function HomeScreen() {
  const { user, syncStatus } = useAuthStore();
  const count = useMemo(() => MOCK_BOOKS.length, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>{user?.displayName ?? 'Reader'}</Text>
        </View>
        <TouchableOpacity style={styles.syncBadge}>
          <Text style={styles.syncText}>{syncStatus}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsWrap}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{count}</Text>
          <Text style={styles.statLabel}>Books</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>93%</Text>
          <Text style={styles.statLabel}>Weekly streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Continue reading</Text>
      {MOCK_BOOKS.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  eyebrow: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  syncBadge: {
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  syncText: {
    color: theme.colors.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  statsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 18,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  statNumber: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: theme.colors.textSecondary,
    marginTop: 6,
    fontSize: 12,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },
});
