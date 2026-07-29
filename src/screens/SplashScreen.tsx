import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { navigate, t } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('WELCOME');
    }, 2600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🏛️</Text>
        </View>
        <Text style={styles.appTitle}>{t('appTitle')}</Text>
        <Text style={styles.appSubtitle}>{t('appSubtitle')}</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading Gram Panchayat App…</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  content: {
    alignItems: 'center',
    marginTop: 80,
  },
  logoBadge: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 48,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.secondaryLight,
    marginTop: 6,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
});
