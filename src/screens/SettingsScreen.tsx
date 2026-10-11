import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../store/useAppStore';
import { theme } from '../theme';

export default function SettingsScreen() {
  const { settings, updateSettings, user, signOut } = useAuthStore();
  const [tempSettings, setTempSettings] = useState(settings);

  const handleThemeChange = useCallback(
    async (theme: 'light' | 'dark' | 'auto') => {
      const newSettings = { ...tempSettings, theme };
      setTempSettings(newSettings);
      await updateSettings(newSettings);
    },
    [tempSettings, updateSettings],
  );

  const handleFontSizeChange = useCallback(
    async (size: number) => {
      const newSettings = { ...tempSettings, fontSize: size };
      setTempSettings(newSettings);
      await updateSettings(newSettings);
    },
    [tempSettings, updateSettings],
  );

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const fontSizes = [12, 14, 16, 18, 20, 22, 24];
  const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

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
          <View style={styles.card}>
            <Text style={styles.label}>Not signed in</Text>
            <Text style={styles.value}>Sign in to sync your progress</Text>
          </View>
        )}
      </View>

      {/* Reading Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reading Preferences</Text>

        {/* Font Size */}
        <View style={styles.card}>
          <Text style={styles.label}>Font Size</Text>
          <View style={styles.optionRow}>
            {fontSizes.map(size => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  tempSettings.fontSize === size && styles.sizeButtonActive,
                ]}
                onPress={() => handleFontSizeChange(size)}
              >
                <Text
                  style={[
                    styles.sizeButtonText,
                    tempSettings.fontSize === size && styles.sizeButtonTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Theme */}
        <View style={styles.card}>
          <Text style={styles.label}>Theme</Text>
          <View style={styles.themeRow}>
            {themes.map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.themeButton,
                  tempSettings.theme === t && styles.themeButtonActive,
                ]}
                onPress={() => handleThemeChange(t)}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    tempSettings.theme === t && styles.themeButtonTextActive,
                  ]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Line Height */}
        <View style={styles.card}>
          <Text style={styles.label}>Line Height: {tempSettings.lineHeight.toFixed(1)}</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={async () => {
                const newSettings = { ...tempSettings, lineHeight: Math.max(1.2, tempSettings.lineHeight - 0.1) };
                setTempSettings(newSettings);
                await updateSettings(newSettings);
              }}
            >
              <Text style={styles.buttonLabel}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={async () => {
                const newSettings = { ...tempSettings, lineHeight: Math.min(2.0, tempSettings.lineHeight + 0.1) };
                setTempSettings(newSettings);
                await updateSettings(newSettings);
              }}
            >
              <Text style={styles.buttonLabel}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sync Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync & Backup</Text>

        <View style={styles.card}>
          <View style={styles.syncRow}>
            <View>
              <Text style={styles.label}>Auto Sync</Text>
              <Text style={styles.meta}>Automatically sync progress</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                tempSettings.autoSync && styles.toggleActive,
              ]}
              onPress={async () => {
                const newSettings = { ...tempSettings, autoSync: !tempSettings.autoSync };
                setTempSettings(newSettings);
                await updateSettings(newSettings);
              }}
            >
              <View style={styles.toggleButton} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.syncRow}>
            <View>
              <Text style={styles.label}>Auto Backup</Text>
              <Text style={styles.meta}>Backup to cloud daily</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                tempSettings.autoBackup && styles.toggleActive,
              ]}
              onPress={async () => {
                const newSettings = { ...tempSettings, autoBackup: !tempSettings.autoBackup };
                setTempSettings(newSettings);
                await updateSettings(newSettings);
              }}
            >
              <View style={styles.toggleButton} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Build</Text>
          <Text style={styles.value}>2026.10.11</Text>
        </View>
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
  meta: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  sizeButton: {
    flex: 1,
    minWidth: 45,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sizeButtonText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  sizeButtonTextActive: {
    color: '#fff',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  themeButtonText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  themeButtonTextActive: {
    color: '#fff',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 54,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceAlt,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: theme.colors.accent,
  },
  toggleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.text,
    alignSelf: 'flex-start',
  },
  signOutButton: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '700',
  },
});
