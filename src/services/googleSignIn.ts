import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const setupGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: process.env.GOOGLE_WEB_CLIENT_ID || 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  });
};
