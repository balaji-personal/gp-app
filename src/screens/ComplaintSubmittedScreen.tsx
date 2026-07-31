import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { FileText, Home } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';

export const ComplaintSubmittedScreen: React.FC = () => {
  const { navigate, lastCreatedComplaintId, t } = useApp();
  const complaintId = lastCreatedComplaintId || '-';

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkIcon}>✅</Text>
        </View>

        <Text style={styles.title}>{t('submittedSuccessTitle')}</Text>
        <Text style={styles.sub}>{t('submittedSuccessSub')}</Text>

        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t('complaintId')}</Text>
            <Text style={styles.rowValue}>{complaintId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t('currentStatus')}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{t('submittedStatus')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Scan to view complaint</Text>
          <QRCode
            value={`gram-panchayat://complaint/${complaintId}`}
            size={160}
            color={Colors.textPrimary}
            backgroundColor="#FFFFFF"
          />
          <Text style={styles.qrHint}>Keep this QR code to quickly identify your complaint.</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigate('COMPLAINT_DETAILS', { id: complaintId })}
        >
          <FileText size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>{t('viewComplaintBtn')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.85}
          onPress={() => navigate('HOME')}
        >
          <Home size={20} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.secondaryBtnText}>{t('backToHomeBtn')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 44,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 24,
    elevation: 2,
  },
  qrCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 16,
  },
  qrTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  qrHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  statusBadge: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.warning,
  },
  actionContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: Colors.surface,
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
});
