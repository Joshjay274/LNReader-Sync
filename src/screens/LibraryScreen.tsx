import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useAuthStore } from '../store/useAppStore';
import { theme } from '../theme';
import BookCard from '../components/BookCard';

const MOCK_LIBRARY = [
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
  {
    id: 'book-4',
    title: 'Echoes of Tomorrow',
    author: 'Alex Chen',
    cover: 'https://images.unsplash.com/photo-150784272343-583f20270319?auto=format&fit=crop&w=400&q=80',
    genre: 'Adventure',
    chapters: 50,
    currentChapter: 5,
    progress: 10,
    lastReadAt: '2026-10-01',
    isFavorite: false,
  },
];

export default function LibraryScreen() {
  const { library, setLibrary } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites' | 'reading' | 'completed'>('all');

  const displayLibrary = library.length > 0 ? library : MOCK_LIBRARY;

  const filteredBooks = displayLibrary.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'favorites') return matchesSearch && book.isFavorite;
    if (filter === 'reading') return matchesSearch && book.progress < 100 && book.progress > 0;
    if (filter === 'completed') return matchesSearch && book.progress === 100;
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.count}>{filteredBooks.length} books</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search books..."
        placeholderTextColor={theme.colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterRow}>
        {(['all', 'favorites', 'reading', 'completed'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <BookCard book={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No books found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  count: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});
