import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { LanguageSelectorBanner } from '../components/LanguageSelectorBanner';
import { ClipboardEdit, LogIn } from 'lucide-react-native';

export const WelcomeScreen: React.FC = () => {
  const { navigate, isAuthenticated, userSession, t } = useApp();

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Language Selector Banner */}
        <LanguageSelectorBanner />

        {/* Center Header Content */}
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

        {/* Hero Panchayat Meeting Image Card (Slightly Less Width) */}
        <View style={styles.illustrationCard}>
          <Image
            source={require('../../assets/panchayat_office.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Bottom Action Section */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => navigate('REGISTER_COMPLAINT')}
          >
            <ClipboardEdit size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>{t('registerComplaintBtn')}</Text>
          </TouchableOpacity>

          {!isAuthenticated ? (
            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.85}
              onPress={() => navigate('LOGIN')}
            >
              <LogIn size={20} color="#15803D" style={{ marginRight: 8 }} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  container: {
    flexGrow: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 14,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#15803D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#14532D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  iconEmoji: {
    fontSize: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: 12,
  },
  welcomeDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
    paddingHorizontal: 20,
  },
  loggedInBadge: {
    marginTop: 12,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  loggedInText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
  },
  illustrationCard: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 160,
    marginVertical: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    elevation: 4,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  actionSection: {
    gap: 12,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#15803D',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#15803D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#15803D',
    fontSize: 16,
    fontWeight: '800',
  },
});
