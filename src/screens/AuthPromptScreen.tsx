import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react-native';

export const AuthPromptScreen: React.FC = () => {
  const { navigate, back, t } = useApp();

  return (
    <View style={styles.container}>
      <Header
        title={t('authPromptTitle')}
        stepText={t('registerComplaintTitle')}
        showBack
        onBack={back}
      />

      <View style={styles.body}>
        <View style={styles.content}>
          <View style={styles.shieldCircle}>
            <ShieldCheck size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>{t('authPromptTitle')}</Text>
          <Text style={styles.sub}>{t('authPromptSub')}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => navigate('REGISTER')}
          >
            <UserPlus size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>{t('registerBtn')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saffronBtn}
            activeOpacity={0.85}
            onPress={() => navigate('LOGIN')}
          >
            <LogIn size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.saffronBtnText}>{t('loginBtn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  shieldCircle: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#15803D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  sub: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  actionContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: '#15803D',
    height: 54,
    borderRadius: 16,
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
  saffronBtn: {
    backgroundColor: Colors.secondary,
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  saffronBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
