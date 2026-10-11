import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '../store/useAppStore';
import { theme } from '../theme';

const MOCK_CHAPTERS = [
  { id: 1, title: 'Chapter 1: The Beginning', content: 'Lorem ipsum dolor sit amet...' },
  { id: 2, title: 'Chapter 2: The Journey', content: 'Lorem ipsum dolor sit amet...' },
  { id: 3, title: 'Chapter 3: Revelations', content: 'Lorem ipsum dolor sit amet...' },
];

export default function ReaderScreen() {
  const { settings } = useAuthStore();
  const [currentChapter, setCurrentChapter] = React.useState(1);
  const [showChapterList, setShowChapterList] = React.useState(false);

  const chapter = MOCK_CHAPTERS.find(c => c.id === currentChapter);
  if (!chapter) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>The Last Scribe</Text>
        <Text style={styles.headerSubtitle}>{chapter.title}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentInner,
          { fontSize: settings.fontSize, lineHeight: settings.fontSize * settings.lineHeight },
        ]}
      >
        <Text
          style={[
            styles.chapterText,
            {
              fontSize: settings.fontSize,
              lineHeight: settings.fontSize * settings.lineHeight,
            },
          ]}
        >
          {chapter.content}
          {chapter.content}
          {chapter.content}
          {chapter.content}
        </Text>
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentChapter(Math.max(1, currentChapter - 1))}
          disabled={currentChapter === 1}
        >
          <Text style={styles.buttonText}>← Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowChapterList(!showChapterList)}
        >
          <Text style={styles.buttonText}>Chapters</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentChapter(Math.min(MOCK_CHAPTERS.length, currentChapter + 1))}
          disabled={currentChapter === MOCK_CHAPTERS.length}
        >
          <Text style={styles.buttonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {showChapterList && (
        <View style={styles.chapterList}>
          {MOCK_CHAPTERS.map(ch => (
            <TouchableOpacity
              key={ch.id}
              style={[
                styles.chapterListItem,
                ch.id === currentChapter && styles.chapterListItemActive,
              ]}
              onPress={() => {
                setCurrentChapter(ch.id);
                setShowChapterList(false);
              }}
            >
              <Text
                style={[
                  styles.chapterListItemText,
                  ch.id === currentChapter && styles.chapterListItemTextActive,
                ]}
              >
                {ch.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentInner: {
    paddingBottom: 20,
  },
  chapterText: {
    color: theme.colors.text,
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    padding: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  chapterList: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    maxHeight: 300,
  },
  chapterListItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  chapterListItemActive: {
    backgroundColor: theme.colors.surfaceAlt,
  },
  chapterListItemText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  chapterListItemTextActive: {
    color: theme.colors.text,
    fontWeight: '600',
  },
});
