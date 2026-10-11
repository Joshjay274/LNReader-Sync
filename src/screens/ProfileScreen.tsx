import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { theme } from '../theme';

export default function ReaderScreen() {
  const [progress, setProgress] = useState(62);
  const chapters = [
    'The Archive of Ash',
    'A Letter Beneath the Moon',
    'The Glass Tower',
    'Ink and Static',
    'The Last Candle',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reader</Text>
      <Text style={styles.heading}>The Last Scribe</Text>
      <Text style={styles.meta}>Chapter 20 • 62% complete</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.chapterTitle}>Current chapter</Text>
      {chapters.map((chapter, idx) => (
        <Pressable key={chapter} style={styles.chapterRow} onPress={() => setProgress((idx + 1) * 16)}>
          <Text style={styles.chapterText}>{idx + 1}. {chapter}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
  heading: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  meta: {
    color: theme.colors.textSecondary,
    marginTop: 6,
    marginBottom: 18,
  },
  progressTrack: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    marginBottom: 22,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
  },
  chapterTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  chapterRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chapterText: {
    color: theme.colors.text,
    fontSize: 16,
  },
});
