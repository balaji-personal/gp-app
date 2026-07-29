import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Colors } from '../theme/colors';
import { Header } from '../components/Header';
import { Mic, Camera, Check, ArrowRight, Volume2, Trash2, Sparkles } from 'lucide-react-native';

interface ExplainProblemScreenProps {
  category: string;
  onBack: () => void;
  onContinue: (description: string, hasVoice: boolean, hasPhoto: boolean) => void;
}

export const ExplainProblemScreen: React.FC<ExplainProblemScreenProps> = ({
  category,
  onBack,
  onContinue,
}) => {
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceRecording, setHasVoiceRecording] = useState(false);
  const [hasPhotos, setHasPhotos] = useState(false);

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasVoiceRecording(true);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setHasVoiceRecording(true);
      }, 3000);
    }
  };

  const handleAddPhoto = () => {
    setHasPhotos(true);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Register Complaint"
        stepText="Step 2 of 3"
        showBack
        onBack={onBack}
      />

      {/* Stepper Dots */}
      <View style={styles.stepperContainer}>
        <View style={[styles.stepDot, styles.completedStepDot]}>
          <Check size={16} color="#FFFFFF" />
        </View>
        <View style={[styles.stepLine, styles.activeStepLine]} />
        <View style={[styles.stepDot, styles.activeStepDot]}>
          <Text style={styles.activeStepNumber}>2</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepDot}>
          <Text style={styles.stepNumber}>3</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>Selected: {category}</Text>
        </View>

        <Text style={styles.sectionTitle}>Explain the Problem</Text>

        {/* Big Giant Mic Button for Illiterate Villagers */}
        <TouchableOpacity
          style={[styles.bigMicCard, isRecording && styles.bigMicCardRecording, hasVoiceRecording && styles.bigMicCardSuccess]}
          activeOpacity={0.85}
          onPress={handleToggleRecord}
        >
          <View style={[styles.bigMicCircle, isRecording && styles.bigMicCircleRecording]}>
            <Mic size={40} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.bigMicTitle}>
              {isRecording ? '🎙️ Recording... Speak Now!' : hasVoiceRecording ? '✅ Voice Recorded (0:12 sec)' : '🎙️ Tap Big Mic & Speak (వాయిస్ రికార్డ్)'}
            </Text>
            <Text style={styles.bigMicSub}>
              {isRecording ? 'Tap again when finished speaking' : 'No typing needed. Just speak your complaint!'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Big Camera Photo Button */}
        <TouchableOpacity style={styles.bigCameraCard} activeOpacity={0.85} onPress={handleAddPhoto}>
          <View style={styles.bigCameraCircle}>
            <Camera size={26} color={Colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.bigCameraTitle}>📷 Take Photo of Problem (ఫోటో తీయండి)</Text>
            <Text style={styles.bigCameraSub}>Show the road pothole, pipe leak, or garbage site</Text>
          </View>
        </TouchableOpacity>

        {/* Optional Text Box */}
        <Text style={styles.optionalLabel}>Or Type Problem Details (Optional / ఐచ్ఛికం):</Text>
        <View style={styles.inputCard}>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Type your problem here if desired..."
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            style={styles.textInput}
            textAlignVertical="top"
          />
        </View>

        {/* Voice Recording Active Preview */}
        {hasVoiceRecording && !isRecording && (
          <View style={styles.voicePreviewCard}>
            <View style={styles.voiceLeft}>
              <View style={styles.playCircle}>
                <Volume2 size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.voiceTitle}>Voice message recorded successfully</Text>
                <Text style={styles.voiceDuration}>Duration: 0:12 sec • Ready for Panchayat</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setHasVoiceRecording(false)}>
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}

        {/* Photos Preview */}
        {hasPhotos && (
          <View style={styles.photosSection}>
            <Text style={styles.photosSectionTitle}>Uploaded Photo (1)</Text>
            <View style={styles.photosRow}>
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&auto=format&fit=crop&q=80' }}
                  style={styles.photoThumbnail}
                />
                <TouchableOpacity style={styles.deletePhoto} onPress={() => setHasPhotos(false)}>
                  <Text style={styles.deletePhotoText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onBack}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.85}
          onPress={() =>
            onContinue(
              description || 'Main road damage requiring immediate village maintenance.',
              hasVoiceRecording,
              hasPhotos
            )
          }
        >
          <Text style={styles.continueText}>Continue (ముందుకు)</Text>
          <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepDot: {
    backgroundColor: Colors.primary,
  },
  completedStepDot: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#757575',
  },
  activeStepNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepLine: {
    width: 44,
    height: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
    borderRadius: 2,
  },
  activeStepLine: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  categoryBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  bigMicCard: {
    backgroundColor: '#2E7D32',
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  bigMicCardRecording: {
    backgroundColor: Colors.error,
  },
  bigMicCardSuccess: {
    backgroundColor: '#1B5E20',
  },
  bigMicCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigMicCircleRecording: {
    backgroundColor: '#FFFFFF',
  },
  bigMicTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  bigMicSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  bigCameraCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    elevation: 2,
  },
  bigCameraCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigCameraTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  bigCameraSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  optionalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  textInput: {
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 80,
  },
  voicePreviewCard: {
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  voiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  voiceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  voiceDuration: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  photosSection: {
    marginTop: 8,
  },
  photosSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  photosRow: {
    flexDirection: 'row',
  },
  photoContainer: {
    position: 'relative',
  },
  photoThumbnail: {
    width: 84,
    height: 84,
    borderRadius: 14,
  },
  deletePhoto: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePhotoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  backBtn: {
    width: '30%',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  continueBtn: {
    width: '66%',
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
