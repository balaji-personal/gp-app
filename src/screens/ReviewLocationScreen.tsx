import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { Header } from '../components/Header';
import { Check, MapPin, Send, ShieldCheck } from 'lucide-react-native';

interface ReviewLocationScreenProps {
  category: string;
  description: string;
  hasVoice: boolean;
  hasPhoto: boolean;
  onBack: () => void;
  onSubmitSuccess: (complaintId: string) => void;
}

export const ReviewLocationScreen: React.FC<ReviewLocationScreenProps> = ({
  category,
  description,
  hasVoice,
  hasPhoto,
  onBack,
  onSubmitSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const generatedId = `GP-2026-0481`;
      onSubmitSuccess(generatedId);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Header title="Register Complaint" stepText="Step 3 of 3" showBack onBack={onBack} />

      {/* Stepper Dots */}
      <View style={styles.stepperContainer}>
        <View style={[styles.stepDot, styles.completedStepDot]}>
          <Check size={16} color="#FFFFFF" />
        </View>
        <View style={[styles.stepLine, styles.activeStepLine]} />
        <View style={[styles.stepDot, styles.completedStepDot]}>
          <Check size={16} color="#FFFFFF" />
        </View>
        <View style={[styles.stepLine, styles.activeStepLine]} />
        <View style={[styles.stepDot, styles.activeStepDot]}>
          <Text style={styles.activeStepNumber}>3</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Review & Submit</Text>
        <Text style={styles.instructionsText}>
          Please review your complaint details and location before final submission to Gram Panchayat.
        </Text>

        {/* Location Detection Card */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MapPin size={22} color={Colors.primary} />
            <Text style={styles.locationTitle}>Village GPS Location</Text>
          </View>
          <Text style={styles.locationAddress}>
            Machnoor Gram Panchayat, Jharasangam Mandal,{'\n'}Sangareddy District, Telangana - 502248
          </Text>

          <View style={styles.gpsVerifiedBadge}>
            <ShieldCheck size={14} color={Colors.primary} />
            <Text style={styles.gpsVerifiedText}>GPS Location Verified</Text>
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>Complaint Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Category:</Text>
            <Text style={styles.summaryValue}>{category}</Text>
          </View>

          <View style={styles.summaryRowVertical}>
            <Text style={styles.summaryLabel}>Problem Description:</Text>
            <Text style={styles.summaryDescription}>{description}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Voice Attachment:</Text>
            <Text style={styles.summaryValue}>{hasVoice ? '✅ Included (0:12 sec)' : 'None'}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Photo Attachment:</Text>
            <Text style={styles.summaryValue}>{hasPhoto ? '✅ 1 Photo Attached' : 'None'}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>SMS Update Alert:</Text>
            <Text style={styles.summaryValue}>✅ Enabled (+91 9812345678)</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onBack}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.85}
          disabled={submitting}
          onPress={handleSubmit}
        >
          <Send size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit Complaint'}</Text>
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
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 12,
    fontWeight: '700',
    color: '#757575',
  },
  activeStepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 3,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  activeStepLine: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 18,
    lineHeight: 18,
  },
  locationCard: {
    backgroundColor: Colors.secondaryLight,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
    marginLeft: 8,
  },
  locationAddress: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    fontWeight: '600',
    marginBottom: 10,
  },
  gpsVerifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsVerifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 4,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  summaryHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryRowVertical: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryDescription: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 4,
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 10,
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
  submitBtn: {
    width: '66%',
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
