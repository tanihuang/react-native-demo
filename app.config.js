import 'dotenv/config';

export default {
  expo: {
    name: 'react-native-demo',
    slug: 'react-native-demo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
      publicPath: '/react-native-demo/'
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true
    },
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseDatabaseURL: process.env.FIREBASE_DATABASE_URL,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID
    }
  }
};
