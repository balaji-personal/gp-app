import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { LanguageSelectorBanner } from '../components/LanguageSelectorBanner';
import { ClipboardEdit, LogIn } from 'lucide-react-native';

export const WelcomeScreen: React.FC = () => {
  const { navigate, isAuthenticated, userSession, t } = useApp();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Language Selector Banner at Very 1st Step */}
      <LanguageSelectorBanner />

      <View style={styles.headerSection}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🏛️</Text>
        </View>
        <Text style={styles.welcomeTitle}>{t('welcomeTitle')}</Text>
        <Text style={styles.welcomeDesc}>{t('welcomeDesc')}</Text>

        {isAuthenticated && userSession && (
          <View style={styles.loggedInBadge}>
            <Text style={styles.loggedInText}>
              {t('loggedInAs')} {userSession.fullName} ({userSession.village})
            </Text>
          </View>
        )}
      </View>

      <View style={styles.illustrationBox}>
        <Text style={styles.illustrationText}>🌾 🏡 🚗 💧 ☀️</Text>
        <Text style={styles.illustrationSub}>Machnoor Village Civic Services</Text>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigate('REGISTER_COMPLAINT')}
        >
          <ClipboardEdit size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>{t('registerComplaintBtn')}</Text>
        </TouchableOpacity>

        {!isAuthenticated ? (
          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => navigate('LOGIN')}
          >
            <LogIn size={20} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>{t('loginBtn')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => navigate('HOME')}
          >
            <Text style={styles.secondaryBtnText}>{t('homeBtn')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  iconEmoji: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  welcomeDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  loggedInBadge: {
    marginTop: 14,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  loggedInText: {
    color: Colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  illustrationBox: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginVertical: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  illustrationText: {
    fontSize: 42,
  },
  illustrationSub: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 8,
  },
  actionSection: {
    gap: 12,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: Colors.surface,
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
});
