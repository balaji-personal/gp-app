import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';

export const RegisterScreen: React.FC = () => {
  const { navigate, registerUser, addComplaint, t, back } = useApp();

  const [fullName, setFullName] = useState('');
  const [fathersName, setFathersName] = useState('');
  const [mothersName, setMothersName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [district, setDistrict] = useState('Sangareddy');
  const [mandal, setMandal] = useState('Jharasangam');
  const [village, setVillage] = useState('Machnoor');

  const handleRegisterSubmit = async () => {
    if (!fullName || !phone || !pin) {
      alert('Please fill out all required fields');
      return;
    }
    await registerUser({
      fullName: fullName || 'B. Balaji',
      fathersName: fathersName || 'B. Ramesh',
      mothersName: mothersName || 'B. Lakshmi',
      phone: phone || '9812345678',
      pin: pin || '1234',
      district,
      mandal,
      village,
    });

    await addComplaint({
      category: t('catRoads'),
      description: 'Main road damage near school gate.',
      hasPhoto: true,
      voiceSeconds: 12,
    });

    navigate('COMPLAINT_SUBMITTED');
  };

  return (
    <View style={styles.container}>
      <Header title={t('registerTitle')} stepText={t('registerSub')} showBack onBack={back} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('fullNameLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. B. Balaji"
            placeholderTextColor={Colors.textMuted}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('fathersNameLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. B. Ramesh"
            placeholderTextColor={Colors.textMuted}
            value={fathersName}
            onChangeText={setFathersName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('mothersNameLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. B. Lakshmi"
            placeholderTextColor={Colors.textMuted}
            value={mothersName}
            onChangeText={setMothersName}
          />
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

        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>{t('createPinLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder="••••"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              value={pin}
              onChangeText={(t) => setPin(t.replace(/\D/g, ''))}
            />
          </View>
          <View style={[styles.fieldGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>{t('confirmPinLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder="••••"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              value={confirmPin}
              onChangeText={(t) => setConfirmPin(t.replace(/\D/g, ''))}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('districtLabel')}</Text>
          <TextInput style={[styles.input, styles.readOnlyInput]} value={district} editable={false} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('mandalLabel')}</Text>
          <TextInput style={[styles.input, styles.readOnlyInput]} value={mandal} editable={false} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('gramPanchayatLabel')}</Text>
          <TextInput style={[styles.input, styles.readOnlyInput]} value={village} editable={false} />
        </View>

        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={handleRegisterSubmit}>
          <Text style={styles.primaryBtnText}>{t('registerBtn')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate('LOGIN')} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>{t('alreadyRegistered')}</Text>
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
  fieldGroup: {
    marginBottom: 14,
  },
  rowFields: {
    flexDirection: 'row',
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
    height: 50,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  readOnlyInput: {
    backgroundColor: Colors.border,
    color: Colors.textSecondary,
    fontWeight: '600',
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
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
