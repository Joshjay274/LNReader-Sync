import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../types';
import { theme } from '../theme';

type BookCardProps = {
  book: Book;
  onPress?: () => void;
};

export default function BookCard({ book, onPress }: BookCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: book.cover }} style={styles.cover} />
      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.meta}>{book.author}</Text>
        <Text style={styles.meta}>{book.genre}</Text>
        <Text style={styles.progress}>Progress: {book.progress}%</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cover: {
    width: 70,
    height: 100,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceAlt,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  progress: {
    color: theme.colors.accent,
    marginTop: 8,
    fontWeight: '600',
  },
});
