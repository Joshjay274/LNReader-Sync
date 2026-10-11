import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../store/useAppStore';
import { theme } from '../theme';
import { Bookmark, Note } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function ReaderDetailScreen({ route }: any) {
  const { bookId } = route.params || {};
  const { readingProgress, bookmarks, notes, addBookmark, addNote, removeNote } = useAuthStore();
  const [currentProgress, setCurrentProgress] = useState<any>(null);
  const [bookmarksForBook, setBookmarksForBook] = useState<Bookmark[]>([]);
  const [notesForBook, setNotesForBook] = useState<Note[]>([]);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(0);

  useEffect(() => {
    const progress = readingProgress.find(p => p.bookId === bookId);
    setCurrentProgress(progress);

    const bookmarksList = bookmarks.filter(b => b.bookId === bookId);
    setBookmarksForBook(bookmarksList);

    const notesList = notes.filter(n => n.bookId === bookId);
    setNotesForBook(notesList);
  }, [bookId, readingProgress, bookmarks, notes]);

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      Alert.alert('Empty Note', 'Please enter some text');
      return;
    }

    const newNote: Note = {
      id: uuidv4(),
      bookId: bookId || '',
      chapterId: currentProgress?.chapter || 0,
      content: noteText,
      position: selectedPosition,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addNote(newNote);
    setNoteText('');
    setNoteModalVisible(false);
    Alert.alert('Success', 'Note added');
  };

  const handleAddBookmark = async () => {
    const bookmark: Bookmark = {
      id: uuidv4(),
      bookId: bookId || '',
      chapterId: currentProgress?.chapter || 0,
      position: currentProgress?.progress || 0,
      createdAt: new Date().toISOString(),
    };

    await addBookmark(bookmark);
    Alert.alert('Success', 'Bookmark added');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Chapter Details</Text>

        {currentProgress ? (
          <>
            <View style={styles.progressCard}>
              <Text style={styles.bookTitle}>{currentProgress.title}</Text>
              <Text style={styles.chapterInfo}>
                Chapter {currentProgress.chapter} • {currentProgress.progress}% complete
              </Text>
              <Text style={styles.lastRead}>
                Last read: {new Date(currentProgress.lastReadAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton} onPress={handleAddBookmark}>
                <Text style={styles.actionButtonText}>🔖 Add Bookmark</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setNoteModalVisible(true)}
              >
                <Text style={styles.actionButtonText}>📝 Add Note</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No reading progress for this book</Text>
          </View>
        )}

        {bookmarksForBook.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bookmarks ({bookmarksForBook.length})</Text>
            {bookmarksForBook.map(bookmark => (
              <View key={bookmark.id} style={styles.itemCard}>
                <View>
                  <Text style={styles.itemTitle}>Chapter {bookmark.chapterId}</Text>
                  {bookmark.note && <Text style={styles.itemNote}>{bookmark.note}</Text>}
                  <Text style={styles.itemDate}>
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {notesForBook.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes ({notesForBook.length})</Text>
            {notesForBook.map(note => (
              <View key={note.id} style={styles.itemCard}>
                <Text style={styles.noteContent}>{note.content}</Text>
                <Text style={styles.itemDate}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  onPress={() => removeNote(note.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={noteModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Note</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Enter your note..."
              placeholderTextColor={theme.colors.textSecondary}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={5}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddNote}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  bookTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  chapterInfo: {
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  lastRead: {
    color: theme.colors.accent,
    marginTop: 8,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemTitle: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  itemNote: {
    color: theme.colors.textSecondary,
    marginTop: 6,
    fontSize: 14,
  },
  noteContent: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  itemDate: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.danger,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  noteInput: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    color: theme.colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  cancelText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});
