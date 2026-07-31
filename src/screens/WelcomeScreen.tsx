import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ImageStyle } from 'react-native';
import { useApp } from '../context/AppContext';
import { LanguageSelectorBanner } from '../components/LanguageSelectorBanner';
import { ClipboardEdit, LogIn } from 'lucide-react-native';

export const WelcomeScreen: React.FC = () => {
  const { navigate, isAuthenticated, userSession, t } = useApp();

  return (
    <ImageBackground
      source={require('../../assets/wow.png')}
      style={styles.outerContainer}
      imageStyle={heroImageStyle}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Language Selector Banner */}
        <LanguageSelectorBanner overlay />

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
      </View>
    </ImageBackground>
  );
};

const heroImageStyle: ImageStyle = {
  opacity: 1,
  width: '150%',
  alignSelf: 'flex-end',
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#DDEBD7',
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 22,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 230,
    transform: [{ translateY: -42 }],
  },
  iconCircle: {
    width: 108,
    height: 108,
    borderRadius: 34,
    backgroundColor: '#15803D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#14532D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  iconEmoji: {
    fontSize: 48,
  },
  welcomeTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeDesc: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.92)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
    paddingHorizontal: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.72)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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
  actionSection: {
    gap: 12,
    marginBottom: 0,
  },
  primaryBtn: {
    backgroundColor: '#15803D',
    height: 62,
    borderRadius: 19,
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
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    height: 62,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#15803D',
    fontSize: 18,
    fontWeight: '800',
  },
});
