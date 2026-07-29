import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { LanguageSelectorBanner } from '../components/LanguageSelectorBanner';
import { Check, ArrowRight, Mic, Camera, Volume2, Trash2, Image as ImageIcon } from 'lucide-react-native';

export const RegisterComplaintScreen: React.FC = () => {
  const { navigate, isAuthenticated, addComplaint, userSession, t, back, setPendingComplaint, lang } = useApp();

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasVoice, setHasVoice] = useState<boolean>(false);
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);

  const categories = [
    { icon: '🛣️', label: t('catRoads'),      raw: 'Roads & Infrastructure',         bg: '#FAFAFA' },
    { icon: '💧', label: t('catWater'),      raw: 'Water & Drainage',               bg: '#F0F9FF' },
    { icon: '🏡', label: t('catLand'),       raw: 'Land & Property Issues',         bg: '#FFF7ED' },
    { icon: '📄', label: t('catGovt'),       raw: 'Govt Services & Certificates',   bg: '#F0FDF4' },
    { icon: '🧹', label: t('catSanitation'), raw: 'Sanitation & Cleanliness',       bg: '#ECFDF5' },
    { icon: '📌', label: t('catOther'),      raw: 'Other Issues',                   bg: '#FAFAFA' },
  ];

  const [selectedRaw, setSelectedRaw] = useState<string>('');

  const handleSelectCategory = (rawKey: string) => {
    setSelectedRaw(rawKey);
    const found = categories.find((c) => c.raw === rawKey);
    if (found) setCategory(found.label);
  };

  const handleBackPress = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      if (selectedRaw || text || hasVoice || hasPhoto) {
        Alert.alert(
          t('back'),
          'Discard your complaint draft?',
          [
            { text: t('back'), style: 'cancel' },
            { text: 'OK', style: 'destructive', onPress: () => back() },
          ]
        );
      } else {
        back();
      }
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasVoice(true);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setHasVoice(true);
      }, 3000);
    }
  };

  const handleStep1Continue = () => {
    if (!selectedRaw) {
      Alert.alert(t('selectCategoryTitle'), 'Please select a complaint category to continue.');
      return;
    }
    setStep(2);
  };

  const handleStep2Continue = () => {
    setStep(3);
  };

  const handleSubmitPrompt = () => {
    if (Platform.OS === 'web') {
      executeSubmit();
    } else {
      Alert.alert(
        t('submitComplaintBtn'),
        t('reviewTitle') + '?',
        [
          { text: t('back'), style: 'cancel' },
          { text: t('submitComplaintBtn'), onPress: () => executeSubmit() },
        ]
      );
    }
  };

  const executeSubmit = async () => {
    const complaintData = {
      category: selectedRaw || 'Roads & Infrastructure',
      description: text || 'Village issue requiring Panchayat attention.',
      hasPhoto,
      hasVoice,
    };

    if (!isAuthenticated) {
      setPendingComplaint(complaintData);
      navigate('AUTH_PROMPT');
    } else {
      await addComplaint({
        category: complaintData.category,
        description: complaintData.description,
        hasPhoto,
        voiceSeconds: hasVoice ? 12 : 0,
      });
      setPendingComplaint(null);
      navigate('COMPLAINT_SUBMITTED');
    }
  };

  const selectedCategoryLabel = categories.find((c) => c.raw === selectedRaw)?.label || '';

  return (
    <View style={styles.container}>
      <Header
        title={t('registerComplaintTitle')}
        stepText={t('stepOf', { step, total: 3 })}
        showBack
        onBack={handleBackPress}
      />

      {/* Stepper */}
      <View style={styles.stepperBar}>
        {[1, 2, 3].map((n) => (
          <React.Fragment key={n}>
            <View style={[styles.stepDot, step === n && styles.stepDotActive, step > n && styles.stepDotDone]}>
              {step > n ? (
                <Check size={14} color="#FFFFFF" />
              ) : (
                <Text style={[styles.stepDotNum, (step === n || step > n) && styles.stepDotNumActive]}>{n}</Text>
              )}
            </View>
            {n < 3 && <View style={[styles.stepLine, step > n && styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── STEP 1: Select Complaint Category ── */}
        {step === 1 && (
          <View>
            <LanguageSelectorBanner />

            <Text style={styles.sectionTitle}>{t('selectCategoryTitle')}</Text>
            <View style={styles.categoryGrid}>
              {categories.map((c) => {
                const isSelected = selectedRaw === c.raw;
                return (
                  <TouchableOpacity
                    key={c.raw}
                    style={[styles.categoryCard, { backgroundColor: c.bg }, isSelected && styles.categoryCardSelected]}
                    activeOpacity={0.8}
                    onPress={() => handleSelectCategory(c.raw)}
                  >
                    <Text style={styles.categoryIcon}>{c.icon}</Text>
                    <Text style={styles.categoryLabel}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.continueBtn, !selectedRaw && styles.continueBtnDisabled]}
              activeOpacity={0.85}
              onPress={handleStep1Continue}
            >
              <ArrowRight size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.continueText}>{t('continue')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 2: Explain the Problem (Figma Design Matching) ── */}
        {step === 2 && (
          <View>
            <View style={styles.badgeRow}>
              <View style={styles.catBadge}>
                <Text style={styles.catBadgeText}>{selectedCategoryLabel}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('explainTitle')}</Text>
            <Text style={styles.sectionSub}>
              Type your complaint below. Tap the photo icon to add pictures, or the mic icon to record your voice.
            </Text>

            {/* Combined White Card Box for Input, Photo & Mic (Matches Figma Screenshot 1) */}
            <View style={styles.combinedCardBox}>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder={t('describePlaceholder')}
                placeholderTextColor="#94A3B8"
                value={text}
                onChangeText={setText}
                style={styles.textInputArea}
                textAlignVertical="top"
              />

              {/* Bottom Icon Action Row inside the card */}
              <View style={styles.cardBottomActionRow}>
                <TouchableOpacity
                  style={[styles.smallPhotoBtn, hasPhoto && styles.smallPhotoBtnActive]}
                  activeOpacity={0.8}
                  onPress={() => setHasPhoto(!hasPhoto)}
                >
                  <ImageIcon size={20} color={hasPhoto ? '#15803D' : '#64748B'} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.smallMicBtn, isRecording && styles.smallMicBtnRecording, hasVoice && styles.smallMicBtnDone]}
                  activeOpacity={0.8}
                  onPress={handleToggleRecord}
                >
                  <Mic size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Status indicators */}
            {(hasVoice || hasPhoto) && (
              <View style={styles.attachedStatusRow}>
                {hasVoice && (
                  <View style={styles.attachedBadge}>
                    <Volume2 size={14} color="#15803D" style={{ marginRight: 4 }} />
                    <Text style={styles.attachedText}>Voice (0:12 sec)</Text>
                    <TouchableOpacity onPress={() => setHasVoice(false)} style={{ marginLeft: 6 }}>
                      <Trash2 size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}
                {hasPhoto && (
                  <View style={styles.attachedBadge}>
                    <Camera size={14} color="#15803D" style={{ marginRight: 4 }} />
                    <Text style={styles.attachedText}>1 Photo attached</Text>
                    <TouchableOpacity onPress={() => setHasPhoto(false)} style={{ marginLeft: 6 }}>
                      <Trash2 size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
                <Text style={styles.backBtnText}>{t('back')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueFlexBtn} onPress={handleStep2Continue}>
                <ArrowRight size={20} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.continueText}>{t('continue')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── STEP 3: Review & Submit ── */}
        {step === 3 && (
          <View>
            <Text style={styles.sectionTitle}>{t('reviewTitle')}</Text>
            <View style={styles.reviewCard}>
              <SummaryRow label={t('category')} value={selectedCategoryLabel || t('catRoads')} />
              <SummaryRow
                label={t('description')}
                value={
                  text
                    ? text
                    : hasVoice
                    ? (lang === 'te' ? 'వాయిస్ రికార్డింగ్ జత చేయబడింది' : 'Voice recording attached')
                    : (lang === 'te' ? 'వివరణ లేదు' : 'No description')
                }
              />
              <SummaryRow
                label={t('voice')}
                value={hasVoice ? (lang === 'te' ? 'రికార్డ్ అయింది (0:12)' : 'Recorded (0:12)') : (lang === 'te' ? 'లేదు' : 'None')}
              />
              <SummaryRow
                label={t('photos')}
                value={hasPhoto ? (lang === 'te' ? '1 ఫోటో జత చేయబడింది' : '1 attached') : (lang === 'te' ? 'లేదు' : 'None')}
              />
              <View style={styles.divider} />
              <SummaryRow
                label={t('location')}
                value={userSession ? `${userSession.village}, ${userSession.mandal}` : 'Machnoor, Jharasangam'}
              />
              <SummaryRow
                label={t('userName')}
                value={userSession ? userSession.fullName : (lang === 'te' ? 'అతిథి గ్రామస్థుడు' : 'Guest Villager')}
              />
              <SummaryRow
                label={t('mobile')}
                value={userSession ? userSession.phone : (lang === 'te' ? 'లాగిన్ అవసరం' : 'Login Required')}
              />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
                <Text style={styles.backBtnText}>{t('back')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueFlexBtn} onPress={handleSubmitPrompt}>
                <Text style={styles.continueText}>{t('submitComplaintBtn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue} numberOfLines={2}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  stepperBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  stepDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center',
  },
  stepDotActive:  { backgroundColor: '#15803D' },
  stepDotDone:    { backgroundColor: '#15803D' },
  stepDotNum:     { fontSize: 13, fontWeight: '700', color: '#64748B' },
  stepDotNumActive: { color: '#FFFFFF' },
  stepLine: { width: 44, height: 3, backgroundColor: '#E2E8F0', marginHorizontal: 8, borderRadius: 2 },
  stepLineDone: { backgroundColor: '#15803D' },
  scrollContent: { padding: 18, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  sectionSub: { fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 20 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  categoryCard: {
    width: '48%', borderRadius: 20, padding: 18, alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4,
  },
  categoryCardSelected: { borderColor: '#15803D', backgroundColor: '#F0FDF4' },
  categoryIcon: { fontSize: 34, marginBottom: 10 },
  categoryLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  continueBtn: {
    backgroundColor: '#15803D', height: 54, borderRadius: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 3,
  },
  continueBtnDisabled: { backgroundColor: '#94A3B8', elevation: 0 },
  continueText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  badgeRow: { alignSelf: 'flex-start', marginBottom: 10 },
  catBadge: {
    backgroundColor: '#DCFCE7', paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 12, borderWidth: 1, borderColor: '#86EFAC',
  },
  catBadgeText: { fontSize: 12, fontWeight: '800', color: '#15803D' },
  
  // Combined Card Box for Step 2 (Figma Matching)
  combinedCardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  textInputArea: {
    fontSize: 15,
    color: '#0F172A',
    minHeight: 110,
    textAlignVertical: 'top',
  },
  cardBottomActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  smallPhotoBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallPhotoBtnActive: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  smallMicBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#15803D',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  smallMicBtnRecording: { backgroundColor: '#EF4444' },
  smallMicBtnDone: { backgroundColor: '#166534' },
  
  attachedStatusRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  attachedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  attachedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  backBtn: {
    width: '34%', height: 54, borderRadius: 16, borderWidth: 1.5, borderColor: '#CBD5E1',
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF',
  },
  backBtnText: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  continueFlexBtn: {
    flex: 1, height: 54, borderRadius: 16, backgroundColor: '#15803D',
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 3,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16, elevation: 2,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  summaryLabel: { fontSize: 13, color: '#64748B', flex: 1 },
  summaryValue: { fontSize: 13, fontWeight: '700', color: '#0F172A', maxWidth: '60%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 6 },
});
