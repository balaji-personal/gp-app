import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/BottomNav';
import { ClipboardEdit, ClipboardList, User, MapPin, Globe } from 'lucide-react-native';

export const HomeScreen: React.FC = () => {
  const { navigate, userSession, t, lang, setLang } = useApp();

  const name = userSession?.fullName || 'Balaji';
  const village = userSession?.village ? `${userSession.village} Gram Panchayat` : 'Machnoor Grampanchayat';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header Card */}
        <View style={styles.topHeader}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greetingText}>{t('hello')},</Text>
              <Text style={styles.userName}>{name} 👋</Text>
            </View>
            <View style={styles.topRightRow}>
              <TouchableOpacity
                style={styles.langToggle}
                onPress={() => setLang(lang === 'en' ? 'te' : 'en')}
                activeOpacity={0.8}
              >
                <Globe size={14} color="#FFFFFF" />
                <Text style={styles.langToggleText}>{lang === 'en' ? 'తెలుగు' : 'English'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.avatarBtn} onPress={() => navigate('PROFILE')}>
                <Text style={styles.avatarText}>{name.charAt(0)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.locationPill}>
            <MapPin size={14} color="#FFFFFF" />
            <Text style={styles.locationText}>{village}</Text>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actionCards}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigate('REGISTER_COMPLAINT')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: Colors.primary }]}>
              <ClipboardEdit size={28} color="#FFFFFF" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t('registerComplaintBtn')}</Text>
              <Text style={styles.cardSub}>{lang === 'te' ? 'కొత్త సమస్యను నివేదించండి' : 'Report a new problem'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigate('MY_COMPLAINTS')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: Colors.secondary }]}>
              <ClipboardList size={28} color="#FFFFFF" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t('myComplaintsTitle')}</Text>
              <Text style={styles.cardSub}>{t('myComplaintsSub')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigate('PROFILE')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: '#44403C' }]}>
              <User size={28} color="#FFFFFF" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t('myProfileTitle')}</Text>
              <Text style={styles.cardSub}>{t('myProfileSub')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>{t('infoBannerText')}</Text>
        </View>
      </ScrollView>

      <BottomNav active="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  topHeader: {
    backgroundColor: Colors.primary,
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  langToggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  avatarBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 14,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  actionCards: {
    paddingHorizontal: 16,
    marginTop: -16,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
  },
  cardIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    marginLeft: 14,
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cardSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.secondaryLight,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  infoIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
});
