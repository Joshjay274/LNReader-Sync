import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import HomeScreen from './src/screens/HomeScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import ReaderScreen from './src/screens/ReaderScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';
import SplashScreen from './src/screens/SplashScreen';

import { theme } from './src/theme';
import { useAuthStore } from './src/store/useAppStore';
import { setupGoogleSignIn } from './src/services/googleSignIn';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

setupGoogleSignIn();

function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 64,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="LibraryTab" 
        component={LibraryScreen}
        options={{
          title: 'Library',
        }}
      />
      <Tab.Screen 
        name="ReaderTab" 
        component={ReaderScreen}
        options={{
          title: 'Reader',
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { user, isReady, initializeAuth } = useAuthStore();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();

    const unsubscribe = auth().onAuthStateChanged(firebaseAuthUser => {
      setFirebaseUser(firebaseAuthUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [initializeAuth]);

  if (loading || !isReady) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {firebaseUser || user ? (
            <Stack.Screen name="AppTabs" component={RootTabs} />
          ) : (
            <Stack.Screen name="Auth" component={AuthScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
