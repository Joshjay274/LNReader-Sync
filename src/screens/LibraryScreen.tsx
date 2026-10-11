import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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
];

export default function LibraryScreen() {
  const [books, setBooks] = useState(MOCK_LIBRARY);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library</Text>
      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <BookCard key={item.id} book={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <TouchableOpacity style={styles.button} onPress={() => setBooks([...books].reverse())}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 18,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
