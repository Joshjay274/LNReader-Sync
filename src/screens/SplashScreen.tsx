import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>📚</Text>
      <Text style={styles.title}>LNReader Sync</Text>
      <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '800',
  },
});
