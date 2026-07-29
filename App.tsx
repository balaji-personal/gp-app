import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { Colors } from './src/theme/colors';
import { SplashScreen } from './src/screens/SplashScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { RegisterComplaintScreen } from './src/screens/RegisterComplaintScreen';
import { AuthPromptScreen } from './src/screens/AuthPromptScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ComplaintSubmittedScreen } from './src/screens/ComplaintSubmittedScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MyComplaintsScreen } from './src/screens/MyComplaintsScreen';
import { ComplaintDetailScreen } from './src/screens/ComplaintDetailScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SarpanchPortalScreen } from './src/screens/SarpanchPortalScreen';

function MainRouter() {
  const { screen } = useApp();

  switch (screen) {
    case 'SPLASH':
      return <SplashScreen />;
    case 'WELCOME':
      return <WelcomeScreen />;
    case 'REGISTER_COMPLAINT':
      return <RegisterComplaintScreen />;
    case 'AUTH_PROMPT':
      return <AuthPromptScreen />;
    case 'REGISTER':
      return <RegisterScreen />;
    case 'LOGIN':
      return <LoginScreen />;
    case 'COMPLAINT_SUBMITTED':
      return <ComplaintSubmittedScreen />;
    case 'HOME':
      return <HomeScreen />;
    case 'MY_COMPLAINTS':
      return <MyComplaintsScreen />;
    case 'COMPLAINT_DETAILS':
      return <ComplaintDetailScreen />;
    case 'PROFILE':
      return <ProfileScreen />;
    case 'SARPANCH_PORTAL':
      return <SarpanchPortalScreen />;
    default:
      return <WelcomeScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
        <MainRouter />
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
