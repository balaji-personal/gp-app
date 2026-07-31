import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Delete } from 'lucide-react-native';

export const LoginScreen: React.FC = () => {
  const { navigate, resetStack, loginUser, addComplaint, pendingComplaint, setPendingComplaint, t, back, lang } = useApp();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKeyClick = (key: string) => {
    if (key === 'back') {
      setPin((p) => p.slice(0, -1));
    } else {
      if (pin.length < 4) setPin((p) => p + key);
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleLoginSubmit = async () => {
    if (phone.length < 10) {
      showAlert(t('mobileLabel'), '10-digit mobile number required');
      return;
    }
    if (pin.length < 4) {
      showAlert(t('pinLabel'), '4-digit PIN required');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(phone, pin);

      if (!res.success) {
        showAlert(
          lang === 'te' ? 'లాగిన్ విఫలమైంది' : 'Login Failed',
          res.error || (lang === 'te' ? 'మొబైల్ నంబర్ లేదా పిన్ తప్పు.' : 'Invalid phone number or PIN. Please try again.')
        );
        return;
      }

      if (res.role === 'SARPANCH' || res.role === 'ADMIN') {
        resetStack('SARPANCH_PORTAL');
        return;
      }

      // Villager login
      if (pendingComplaint) {
        await addComplaint({
          category: pendingComplaint.category,
          description: pendingComplaint.description,
          hasPhoto: pendingComplaint.hasPhoto,
          voiceSeconds: pendingComplaint.hasVoice ? 12 : 0,
          imageUri: pendingComplaint.imageUri,
          imageName: pendingComplaint.imageName,
          imageType: pendingComplaint.imageType,
          voiceUri: pendingComplaint.voiceUri,
          voiceName: pendingComplaint.voiceName,
          voiceType: pendingComplaint.voiceType,
        });
        setPendingComplaint(null);
        resetStack('COMPLAINT_SUBMITTED');
      } else {
        resetStack('HOME');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('loginTitle')} stepText={t('loginSub')} showBack onBack={back} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Mobile field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('mobileLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={(v) => setPhone(v.replace(/\D/g, ''))}
          />
        </View>

        {/* PIN keypad */}
        <View style={styles.pinSection}>
          <Text style={styles.label}>{t('pinLabel')}</Text>

          {/* PIN dots */}
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.dotBox, pin.length > i && styles.dotBoxFilled]}>
                <Text style={styles.dotText}>{pin.length > i ? '●' : ''}</Text>
              </View>
            ))}
          </View>

          {/* Big keypad for elderly */}
          <View style={styles.keypadGrid}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'].map((k, idx) => {
              if (k === '') return <View key={idx} style={styles.keyBtnEmpty} />;
              if (k === 'back') {
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.keyBtn, styles.backKeyBtn]}
                    onPress={() => handleKeyClick('back')}
                    activeOpacity={0.8}
                  >
                    <Delete size={24} color={Colors.textPrimary} />
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.keyBtn}
                  onPress={() => handleKeyClick(k)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.keyBtnText}>{k}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleLoginSubmit}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? '...' : t('loginBtn')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate('REGISTER')} style={styles.registerLink}>
          <Text style={styles.registerLinkText}>{t('registerNewAccount')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  credsHintBox: {},
  credsHintText: {},
  boldText: {},
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  input: {
    backgroundColor: Colors.surface, borderRadius: 14, height: 52, paddingHorizontal: 14,
    fontSize: 16, fontWeight: '700', color: Colors.textPrimary,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  pinSection: { marginBottom: 20 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 16 },
  dotBox: {
    width: 52, height: 52, borderRadius: 16, borderWidth: 2, borderColor: Colors.borderDark,
    backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center',
  },
  dotBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  dotText: { fontSize: 22, color: Colors.primaryDark, fontWeight: '800' },
  keypadGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  keyBtn: {
    width: '30%', height: 56, borderRadius: 16, backgroundColor: Colors.surface,
    borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', elevation: 1,
  },
  keyBtnEmpty: { width: '30%', height: 56 },
  backKeyBtn: { backgroundColor: Colors.border },
  keyBtnText: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  primaryBtn: {
    backgroundColor: Colors.primary, height: 52, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 3,
  },
  primaryBtnDisabled: { backgroundColor: Colors.textMuted },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  registerLink: { marginTop: 16, alignItems: 'center' },
  registerLinkText: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
});
