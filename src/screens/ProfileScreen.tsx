import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { MapPin, Phone, Pencil, KeyRound, LogOut } from 'lucide-react-native';

export const ProfileScreen: React.FC = () => {
  const { userSession, logoutUser, t, back } = useApp();

  const name = userSession?.fullName || 'B. Balaji';
  const father = userSession?.fathersName || 'B. Ramesh';
  const mother = userSession?.mothersName || 'B. Lakshmi';
  const phone = userSession?.phone || '9812345678';
  const district = userSession?.district || 'Sangareddy';
  const mandal = userSession?.mandal || 'Jharasangam';
  const village = userSession?.village || 'Machnoor';

  return (
    <View style={styles.container}>
      <Header title={t('myProfileTitle')} stepText={t('myProfileSub')} showBack onBack={back} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Header Box */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{name}</Text>
            <View style={styles.infoRow}>
              <MapPin size={14} color={Colors.textMuted} />
              <Text style={styles.infoText}>{village} Gram Panchayat</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone size={14} color={Colors.textMuted} />
              <Text style={styles.infoText}>{phone}</Text>
            </View>
          </View>
        </View>

        {/* Personal Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('personalDetails')}</Text>
          <DetailRow label={t('fullNameLabel')} value={name} />
          <DetailRow label={t('fathersNameLabel')} value={father} />
          <DetailRow label={t('mothersNameLabel')} value={mother} />
          <DetailRow label={t('mobileLabel')} value={phone} />
          <DetailRow label={t('districtLabel')} value={district} />
          <DetailRow label={t('mandalLabel')} value={mandal} />
          <DetailRow label={t('gramPanchayatLabel')} value={village} />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.8}
          onPress={() => alert('Profile update available in Gram Panchayat Office')}
        >
          <View style={[styles.actionIconBox, { backgroundColor: Colors.primaryLight }]}>
            <Pencil size={20} color={Colors.primary} />
          </View>
          <Text style={styles.actionBtnText}>{t('editProfile')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.8}
          onPress={() => alert('PIN reset requested via SMS')}
        >
          <View style={[styles.actionIconBox, { backgroundColor: Colors.primaryLight }]}>
            <KeyRound size={20} color={Colors.primary} />
          </View>
          <Text style={styles.actionBtnText}>{t('changePin')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.dangerBtn]}
          activeOpacity={0.8}
          onPress={logoutUser}
        >
          <View style={[styles.actionIconBox, { backgroundColor: Colors.errorLight }]}>
            <LogOut size={20} color={Colors.error} />
          </View>
          <Text style={[styles.actionBtnText, styles.dangerBtnText]}>{t('logoutAccount')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  profileHeaderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  dangerBtn: {
    borderColor: Colors.errorLight,
  },
  dangerBtnText: {
    color: Colors.error,
  },
});
