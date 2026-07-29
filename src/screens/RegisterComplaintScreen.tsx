import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { LanguageSelectorBanner } from '../components/LanguageSelectorBanner';
import { Check, ArrowRight, Mic, Camera, Volume2, Trash2 } from 'lucide-react-native';

export const RegisterComplaintScreen: React.FC = () => {
  const { navigate, isAuthenticated, addComplaint, userSession, t, back } = useApp();

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasVoice, setHasVoice] = useState<boolean>(false);
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);

  const categories = [
    { icon: '🛣️', label: t('catRoads'), raw: 'Roads & Infrastructure', bg: '#FAFAFA' },
    { icon: '💧', label: t('catWater'), raw: 'Water & Drainage', bg: '#EFF6FF' },
    { icon: '🏡', label: t('catLand'), raw: 'Land & Property Issues', bg: '#FFF7ED' },
    { icon: '📄', label: t('catGovt'), raw: 'Govt Services & Certificates', bg: '#F0FDF4' },
    { icon: '🧹', label: t('catSanitation'), raw: 'Sanitation & Cleanliness', bg: '#ECFDF5' },
    { icon: '📌', label: t('catOther'), raw: 'Other Issues', bg: '#FAFAFA' },
  ];

  const handleBackPress = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      if (category || text || hasVoice || hasPhoto) {
        Alert.alert(
          'Discard Complaint?',
          'Are you sure you want to discard your complaint draft? / ఫిర్యాదు రద్దు చేయాలా?',
          [
            { text: 'Cancel / రద్దు', style: 'cancel' },
            { text: 'Yes, Discard / అవును', style: 'destructive', onPress: () => back() },
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

  const handleSubmitPrompt = () => {
    Alert.alert(
      'Confirm Submission',
      'Submit this complaint to Machnoor Gram Panchayat? / ఫిర్యాదు సమర్పించాలా?',
      [
        { text: 'Review / సరిచూసుకోండి', style: 'cancel' },
        { text: 'Yes, Submit / అవును సమర్పించు', onPress: () => executeSubmit() },
      ]
    );
  };

  const executeSubmit = async () => {
    if (!isAuthenticated) {
      navigate('AUTH_PROMPT');
    } else {
      await addComplaint({
        category: category || t('catRoads'),
        description: text || 'Village road issue near school gate.',
        hasPhoto,
        voiceSeconds: hasVoice ? 12 : 0,
      });
      navigate('COMPLAINT_SUBMITTED');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('registerComplaintTitle')}
        stepText={t('stepOf', { step, total: 3 })}
        showBack
        onBack={handleBackPress}
      />

      {/* Stepper Dots */}
      <View style={styles.stepperBar}>
        {[1, 2, 3].map((n) => (
          <React.Fragment key={n}>
            <View style={[styles.stepDot, step === n && styles.stepDotActive, step > n && styles.stepDotDone]}>
              {step > n ? <Check size={14} color="#FFFFFF" /> : <Text style={[styles.stepDotNum, (step === n || step > n) && styles.stepDotNumActive]}>{n}</Text>}
            </View>
            {n < 3 && <View style={[styles.stepLine, step > n && styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── STEP 1: Language Banner & Category Selection ── */}
        {step === 1 && (
          <View>
            <LanguageSelectorBanner />

            <Text style={styles.sectionTitle}>{t('selectCategoryTitle')}</Text>
            <View style={styles.categoryGrid}>
              {categories.map((c) => {
                const isSelected = category === c.label;
                return (
                  <TouchableOpacity
                    key={c.raw}
                    style={[styles.categoryCard, { backgroundColor: c.bg }, isSelected && styles.categoryCardSelected]}
                    activeOpacity={0.8}
                    onPress={() => setCategory(c.label)}
                  >
                    <Text style={styles.categoryIcon}>{c.icon}</Text>
                    <Text style={styles.categoryLabel}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.continueBtn}
              activeOpacity={0.85}
              onPress={() => setStep(2)}
            >
              <Text style={styles.continueText}>{t('continue')}</Text>
              <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 2: Explain Problem (Voice + Text + Camera) ── */}
        {step === 2 && (
          <View>
            <View style={styles.badgeRow}>
              <View style={styles.catBadge}>
                <Text style={styles.catBadgeText}>Selected: {category || t('catRoads')}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('explainTitle')}</Text>
            <Text style={styles.sectionSub}>{t('explainSub')}</Text>

            {/* Giant Mic Button */}
            <TouchableOpacity
              style={[styles.bigMicCard, isRecording && styles.bigMicCardRecording, hasVoice && styles.bigMicCardSuccess]}
              activeOpacity={0.85}
              onPress={handleToggleRecord}
            >
              <View style={styles.bigMicCircle}>
                <Mic size={36} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.bigMicTitle}>
                  {isRecording ? t('micRecording') : hasVoice ? '✅ Voice Recorded (0:12 sec)' : t('micRecord')}
                </Text>
                <Text style={styles.bigMicSub}>No typing required! Tap and talk in Telugu or English</Text>
              </View>
            </TouchableOpacity>

            {/* Big Camera Photo Button */}
            <TouchableOpacity
              style={[styles.bigCameraCard, hasPhoto && styles.bigCameraCardSuccess]}
              activeOpacity={0.85}
              onPress={() => setHasPhoto(!hasPhoto)}
            >
              <View style={styles.bigCameraCircle}>
                <Camera size={24} color={Colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.bigCameraTitle}>{hasPhoto ? '✅ Photo Attached (1)' : t('takePhoto')}</Text>
                <Text style={styles.bigCameraSub}>Tap to attach photo of road pothole or leak</Text>
              </View>
            </TouchableOpacity>

            {/* Text Input Box */}
            <View style={styles.textInputBox}>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder={t('describePlaceholder')}
                placeholderTextColor={Colors.textMuted}
                value={text}
                onChangeText={setText}
                style={styles.textInput}
                textAlignVertical="top"
              />
            </View>

            {hasVoice && (
              <View style={styles.voicePreviewCard}>
                <View style={styles.voiceLeft}>
                  <View style={styles.playCircle}>
                    <Volume2 size={18} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.voiceTitle}>Voice message recorded</Text>
                    <Text style={styles.voiceSub}>0:12 sec • Ready for Panchayat Secretary</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setHasVoice(false)}>
                  <Trash2 size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
                <Text style={styles.backBtnText}>{t('back')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueFlexBtn} onPress={() => setStep(3)}>
                <Text style={styles.continueText}>{t('continue')}</Text>
                <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── STEP 3: Review & Submit ── */}
        {step === 3 && (
          <View>
            <Text style={styles.sectionTitle}>{t('reviewTitle')}</Text>
            <View style={styles.reviewCard}>
              <SummaryRow label={t('category')} value={category || t('catRoads')} />
              <SummaryRow
                label={t('description')}
                value={text ? text : hasVoice ? 'Voice recording attached' : 'Main road damage near school gate.'}
              />
              <SummaryRow label={t('voice')} value={hasVoice ? 'Recorded (0:12)' : 'None'} />
              <SummaryRow label={t('photos')} value={hasPhoto ? '1 attached' : 'None'} />
              <View style={styles.divider} />
              <SummaryRow label={t('location')} value={userSession ? `${userSession.village}, ${userSession.mandal}` : 'Machnoor, Jharasangam'} />
              <SummaryRow label={t('userName')} value={userSession ? userSession.fullName : 'Guest Villager'} />
              <SummaryRow label={t('mobile')} value={userSession ? userSession.phone : 'Unverified (Login Required)'} />
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
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stepperBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
  },
  stepDotDone: {
    backgroundColor: Colors.primary,
  },
  stepDotNum: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  stepDotNumActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 3,
    backgroundColor: Colors.border,
    marginHorizontal: 6,
    borderRadius: 2,
  },
  stepLineDone: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
  },
  categoryCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  badgeRow: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  catBadge: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  catBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.secondaryDark,
  },
  bigMicCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  bigMicCardRecording: {
    backgroundColor: Colors.error,
  },
  bigMicCardSuccess: {
    backgroundColor: Colors.primaryDark,
  },
  bigMicCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigMicTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  bigMicSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  bigCameraCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  bigCameraCardSuccess: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  bigCameraCircle: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigCameraTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  bigCameraSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  textInputBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  textInput: {
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 80,
  },
  voicePreviewCard: {
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  voiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  voiceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  voiceSub: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  backBtn: {
    width: '32%',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  continueFlexBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    maxWidth: '60%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 6,
  },
});
