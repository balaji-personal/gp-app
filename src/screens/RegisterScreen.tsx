import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { fetchDistrictsApi, fetchMandalsApi, fetchGramPanchayatsApi } from '../services/api';
import { ChevronDown, Check, Search, X } from 'lucide-react-native';

interface LocationItem {
  id: number;
  name: string;
  code?: string;
}

export const RegisterScreen: React.FC = () => {
  const { navigate, resetStack, registerUser, addComplaint, pendingComplaint, setPendingComplaint, t, back, lang } = useApp();

  const [fullName, setFullName] = useState('');
  const [fathersName, setFathersName] = useState('');
  const [mothersName, setMothersName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic Location state
  const [districts, setDistricts] = useState<LocationItem[]>([{ id: 1, name: 'Sangareddy' }]);
  const [mandals, setMandals] = useState<LocationItem[]>([{ id: 1, name: 'Jharasangam' }]);
  const [gramPanchayats, setGramPanchayats] = useState<LocationItem[]>([{ id: 1, name: 'Machnoor' }]);

  const [selectedDistrict, setSelectedDistrict] = useState<LocationItem>({ id: 1, name: 'Sangareddy' });
  const [selectedMandal, setSelectedMandal] = useState<LocationItem>({ id: 1, name: 'Jharasangam' });
  const [selectedGP, setSelectedGP] = useState<LocationItem>({ id: 1, name: 'Machnoor' });

  // Modal selector states
  const [modalType, setModalType] = useState<'DISTRICT' | 'MANDAL' | 'GP' | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(false);

  const locationOptions = modalType === 'DISTRICT' ? districts : modalType === 'MANDAL' ? mandals : gramPanchayats;
  const normalizedSearch = locationSearch.trim().toLowerCase();
  const filteredLocationOptions = normalizedSearch.length < 2
    ? locationOptions
    : locationOptions
      .filter((item) => item.name.toLowerCase().includes(normalizedSearch))
      .sort((first, second) => {
        const firstStartsWith = first.name.toLowerCase().startsWith(normalizedSearch);
        const secondStartsWith = second.name.toLowerCase().startsWith(normalizedSearch);
        return Number(secondStartsWith) - Number(firstStartsWith);
      });

  const openLocationModal = (type: 'DISTRICT' | 'MANDAL' | 'GP') => {
    setLocationSearch('');
    setModalType(type);
  };

  const closeLocationModal = () => {
    setLocationSearch('');
    setModalType(null);
  };

  // Load initial Districts from API
  useEffect(() => {
    async function loadDistricts() {
      setLoadingLocations(true);
      try {
        const res = await fetchDistrictsApi();
        if (res && res.length > 0) {
          const formatted = res.map((d: any) => ({
            id: Number(d.id || d.districtId),
            name: d.name || d.districtName || 'Sangareddy',
          }));
          setDistricts(formatted);
          setSelectedDistrict(formatted[0]);
        }
      } catch (err) {
        console.warn('Failed to load districts:', err);
      } finally {
        setLoadingLocations(false);
      }
    }
    loadDistricts();
  }, []);

  // Fetch Mandals when District changes
  useEffect(() => {
    if (!selectedDistrict?.id) return;
    async function loadMandals() {
      try {
        const res = await fetchMandalsApi(selectedDistrict.id);
        if (res && res.length > 0) {
          const formatted = res.map((m: any) => ({
            id: Number(m.id || m.mandalId),
            name: m.name || m.mandalName || 'Jharasangam',
          }));
          setMandals(formatted);
          setSelectedMandal(formatted[0]);
        } else {
          setMandals([{ id: 1, name: 'Jharasangam' }]);
          setSelectedMandal({ id: 1, name: 'Jharasangam' });
        }
      } catch (err) {
        console.warn('Failed to load mandals:', err);
      }
    }
    loadMandals();
  }, [selectedDistrict]);

  // Fetch Gram Panchayats when Mandal changes
  useEffect(() => {
    if (!selectedMandal?.id) return;
    async function loadGPs() {
      try {
        const res = await fetchGramPanchayatsApi(selectedMandal.id);
        if (res && res.length > 0) {
          const formatted = res.map((gp: any) => ({
            id: Number(gp.id || gp.gramPanchayatId),
            name: gp.name || gp.gramPanchayatName || 'Machnoor',
          }));
          setGramPanchayats(formatted);
          setSelectedGP(formatted[0]);
        } else {
          setGramPanchayats([{ id: 1, name: 'Machnoor' }]);
          setSelectedGP({ id: 1, name: 'Machnoor' });
        }
      } catch (err) {
        console.warn('Failed to load Gram Panchayats:', err);
      }
    }
    loadGPs();
  }, [selectedMandal]);

  const handleRegisterSubmit = async () => {
    if (!fullName.trim() || !phone.trim() || !pin.trim()) {
      Alert.alert(
        t('registerTitle'),
        t('fullNameLabel') + ', ' + t('mobileLabel') + ', ' + t('createPinLabel') + ' required'
      );
      return;
    }
    if (phone.length < 10) {
      Alert.alert(t('mobileLabel'), '10-digit mobile number required');
      return;
    }
    if (pin.length < 4) {
      Alert.alert(t('createPinLabel'), '4-digit PIN required');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert(t('confirmPinLabel'), 'PINs do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({
        fullName: fullName.trim(),
        fathersName: fathersName.trim() || 'Not provided',
        mothersName: mothersName.trim() || 'Not provided',
        phone: phone.trim(),
        pin: pin.trim(),
        district: selectedDistrict.name,
        mandal: selectedMandal.name,
        village: selectedGP.name,
        districtId: selectedDistrict.id,
        mandalId: selectedMandal.id,
        gramPanchayatId: selectedGP.id,
      });

      if (!result.success) {
        Alert.alert(
          lang === 'te' ? 'నమోదు విఫలమైంది' : 'Registration Failed',
          result.error || (lang === 'te'
            ? 'ఈ మొబైల్ నంబర్ ఇప్పటికే నమోదు అయింది.'
            : 'Phone number may already be registered or server error.')
        );
        return;
      }

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
      <Header title={t('registerTitle')} stepText={t('registerSub')} showBack onBack={back} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('fullNameLabel')} *</Text>
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
          <Text style={styles.label}>{t('mobileLabel')} *</Text>
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

        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>{t('createPinLabel')} *</Text>
            <TextInput
              style={styles.input}
              placeholder="••••"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              value={pin}
              onChangeText={(v) => setPin(v.replace(/\D/g, ''))}
            />
          </View>
          <View style={[styles.fieldGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>{t('confirmPinLabel')} *</Text>
            <TextInput
              style={[styles.input, pin.length === 4 && confirmPin.length === 4 && pin !== confirmPin && styles.inputError]}
              placeholder="••••"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              value={confirmPin}
              onChangeText={(v) => setConfirmPin(v.replace(/\D/g, ''))}
            />
          </View>
        </View>

        {/* Dynamic Location Selectors */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('districtLabel')} *</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => openLocationModal('DISTRICT')}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownBtnText}>{selectedDistrict?.name || t('selectDistrict')}</Text>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('mandalLabel')} *</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => openLocationModal('MANDAL')}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownBtnText}>{selectedMandal?.name || t('selectMandal')}</Text>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('gramPanchayatLabel')} *</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => openLocationModal('GP')}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownBtnText}>{selectedGP?.name || t('selectGramPanchayat')}</Text>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleRegisterSubmit}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? '...' : t('registerBtn')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate('LOGIN')} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>{t('alreadyRegistered')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Picker for Location Selection */}
      <Modal visible={modalType !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeLocationModal}
          />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {modalType === 'DISTRICT'
                ? t('selectDistrict')
                : modalType === 'MANDAL'
                ? t('selectMandal')
                : t('selectGramPanchayat')}
            </Text>

            <View style={styles.searchInputWrap}>
              <Search size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name"
                placeholderTextColor={Colors.textMuted}
                value={locationSearch}
                onChangeText={setLocationSearch}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
              />
              {locationSearch.length > 0 && (
                <TouchableOpacity onPress={() => setLocationSearch('')} hitSlop={8}>
                  <X size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalOptionsList} showsVerticalScrollIndicator={false}>
              {filteredLocationOptions.map((item) => {
                const isSelected =
                  (modalType === 'DISTRICT' && selectedDistrict.id === item.id) ||
                  (modalType === 'MANDAL' && selectedMandal.id === item.id) ||
                  (modalType === 'GP' && selectedGP.id === item.id);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                    onPress={() => {
                      if (modalType === 'DISTRICT') setSelectedDistrict(item);
                      if (modalType === 'MANDAL') setSelectedMandal(item);
                      if (modalType === 'GP') setSelectedGP(item);
                      closeLocationModal();
                    }}
                  >
                    <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>
                      {item.name}
                    </Text>
                    {isSelected && <Check size={18} color={Colors.primary} />}
                  </TouchableOpacity>
                );
              })}
              {filteredLocationOptions.length === 0 && (
                <Text style={styles.noResultsText}>No matching locations found</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  fieldGroup: { marginBottom: 14 },
  rowFields: { flexDirection: 'row' },
  label: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  input: {
    backgroundColor: Colors.surface, borderRadius: 14, height: 50, paddingHorizontal: 14,
    fontSize: 15, color: Colors.textPrimary, borderWidth: 1.5, borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.error },
  dropdownBtn: {
    backgroundColor: Colors.surface, borderRadius: 14, height: 50, paddingHorizontal: 14,
    borderWidth: 1.5, borderColor: Colors.border, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  dropdownBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  primaryBtn: {
    backgroundColor: Colors.primary, height: 52, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 3,
  },
  primaryBtnDisabled: { backgroundColor: Colors.textMuted },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  loginLink: { marginTop: 16, alignItems: 'center' },
  loginLinkText: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', padding: 24,
  },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  modalCard: {
    width: '100%', backgroundColor: Colors.surface, borderRadius: 20, padding: 20, elevation: 6,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  searchInputWrap: {
    height: 48, borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, marginBottom: 10,
  },
  searchInput: {
    flex: 1, height: '100%', borderWidth: 0, outlineWidth: 0,
    fontSize: 15, color: Colors.textPrimary, paddingHorizontal: 8,
  },
  modalOptionsList: { maxHeight: 260, width: '100%' },
  noResultsText: {
    color: Colors.textMuted, fontSize: 14, textAlign: 'center', paddingVertical: 20,
  },
  modalOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalOptionSelected: { backgroundColor: Colors.primaryLight },
  modalOptionText: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600' },
  modalOptionTextSelected: { color: Colors.primaryDark, fontWeight: '800' },
});
