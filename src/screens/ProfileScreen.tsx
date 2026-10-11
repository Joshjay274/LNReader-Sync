import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/useAppStore';
import { theme } from '../theme';

export default function ProfileScreen() {
  const { user, signInWithGoogle, signOut, lastSyncTime, syncStatus, performFullSync } = useAuthStore();
  const [syncing, setSyncing] = useState(false);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      Alert.alert('Success', 'Google account connected');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Google sign in failed');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await signOut();
            Alert.alert('Success', 'Signed out');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      await performFullSync();
      Alert.alert('Success', 'All data synced');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        {user ? (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email || 'No email'}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Display Name</Text>
              <Text style={styles.value}>{user.displayName || 'Not set'}</Text>
            </View>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>Not signed in</Text>
              <Text style={styles.description}>
                Connect your Google account to sync your reading progress across all your devices.
              </Text>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign in with Google</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Sync Status */}
      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sync Status</Text>

          <View style={styles.card}>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  syncStatus === 'synced' && styles.statusBadgeSynced,
                  syncStatus === 'error' && styles.statusBadgeError,
                  syncStatus === 'syncing' && styles.statusBadgeSyncing,
                ]}
              >
                <Text style={styles.statusText}>{syncStatus}</Text>
              </View>
            </View>
          </View>

          {lastSyncTime && (
            <View style={styles.card}>
              <Text style={styles.label}>Last Sync</Text>
              <Text style={styles.value}>
                {new Date(lastSyncTime).toLocaleString()}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.syncButton}
            onPress={handleManualSync}
            disabled={syncing}
          >
            {syncing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.syncButtonText}>Sync Now</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.card}>
          <Text style={styles.label}>App</Text>
          <Text style={styles.value}>LNReader Sync</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Build Date</Text>
          <Text style={styles.value}>2026-10-11</Text>
        </View>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>📖 View Documentation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>🐛 Report Issue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>⭐ Rate App</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 40,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: theme.colors.surfaceAlt,
  },
  statusBadgeSynced: {
    backgroundColor: theme.colors.accent,
  },
  statusBadgeError: {
    backgroundColor: theme.colors.danger,
  },
  statusBadgeSyncing: {
    backgroundColor: theme.colors.warning,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  syncButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  syncButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  linkButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
