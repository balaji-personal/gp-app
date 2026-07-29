import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { CheckCircle2, Eye, Home } from 'lucide-react-native';

interface SuccessScreenProps {
  complaintId: string;
  onViewComplaint: () => void;
  onGoHome: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  complaintId,
  onViewComplaint,
  onGoHome,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Large Check Circle */}
        <View style={styles.checkmarkOuterCircle}>
          <View style={styles.checkmarkInnerCircle}>
            <CheckCircle2 size={64} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Complaint Submitted{'\n'}Successfully</Text>
        <Text style={styles.subtitle}>
          Your complaint has been received by the Gram Panchayat office and assigned to Sachiv.
        </Text>

        {/* Complaint Info Badge Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Complaint ID</Text>
            <Text style={styles.infoIdValue}>{complaintId}</Text>
          </View>

          <View style={[styles.infoRow, { marginTop: 12, marginBottom: 0 }]}>
            <Text style={styles.infoLabel}>Current Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Submitted</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={onViewComplaint}
        >
          <Eye size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>View Complaint</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={onGoHome}
        >
          <Home size={20} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    marginTop: 60,
  },
  checkmarkOuterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  checkmarkInnerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 30,
    lineHeight: 20,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoIdValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  statusBadgeText: {
    color: '#E65100',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
