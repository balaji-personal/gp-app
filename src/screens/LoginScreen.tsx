import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Delete, Shield } from 'lucide-react-native';

export const LoginScreen: React.FC = () => {
  const { navigate, loginUser, addComplaint, t, back } = useApp();

  const [phone, setPhone] = useState('9812345678');
  const [pin, setPin] = useState('');

  const handleKeyClick = (key: string) => {
    if (key === 'back') {
      setPin((p) => p.slice(0, -1));
    } else {
      if (pin.length < 4) setPin((p) => p + key);
    }
  };

  const handleLoginSubmit = async () => {
    if (phone.length < 10) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (pin.length < 4) {
      Alert.alert('Invalid PIN', 'Please enter your 4-digit PIN');
      return;
    }

    const res = await loginUser(phone, pin);

    if (res.role === 'SARPANCH' || res.role === 'ADMIN' || phone === '9876543210' || phone === '9999999999') {
      Alert.alert('Welcome Sarpanch / Sachiv', 'Logged into Sarpanch Management Portal.');
      navigate('SARPANCH_PORTAL');
    } else {
      await addComplaint({
        category: t('catRoads'),
        description: 'Main road damage near school gate.',
        hasPhoto: true,
        voiceSeconds: 12,
      });
      navigate('COMPLAINT_SUBMITTED');
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('loginTitle')} stepText={t('loginSub')} showBack onBack={back} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Credentials Info Box for Testing Roles */}
        <View style={styles.credsHintBox}>
          <Shield size={18} color={Colors.secondaryDark} style={{ marginRight: 6 }} />
          <Text style={styles.credsHintText}>
            💡 Villager: <Text style={styles.boldText}>9812345678</Text> (PIN: <Text style={styles.boldText}>1234</Text>){'\n'}
            🏛️ Sarpanch: <Text style={styles.boldText}>9876543210</Text> (PIN: <Text style={styles.boldText}>1234</Text>)
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('mobileLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/\D/g, ''))}
          />
        </View>

        <View style={styles.pinSection}>
          <Text style={styles.label}>{t('pinLabel')}</Text>
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[styles.dotBox, pin.length > i && styles.dotBoxFilled]}
              >
                <Text style={styles.dotText}>{pin.length > i ? '●' : ''}</Text>
              </View>
            ))}
          </View>

          {/* Large Keypad for Elderly Villagers */}
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

        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={handleLoginSubmit}>
          <Text style={styles.primaryBtnText}>{t('loginBtn')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate('REGISTER')} style={styles.registerLink}>
          <Text style={styles.registerLinkText}>{t('registerNewAccount')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  credsHintBox: {
    backgroundColor: Colors.secondaryLight,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  credsHintText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '800',
    color: Colors.secondaryDark,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  pinSection: {
    marginBottom: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dotBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  dotText: {
    fontSize: 22,
    color: Colors.primaryDark,
    fontWeight: '800',
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  keyBtn: {
    width: '30%',
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  keyBtnEmpty: {
    width: '30%',
    height: 56,
  },
  backKeyBtn: {
    backgroundColor: Colors.border,
  },
  keyBtnText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  registerLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerLinkText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
