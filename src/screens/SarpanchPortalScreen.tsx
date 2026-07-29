import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp, ComplaintRecord } from '../context/AppContext';
import { Header } from '../components/Header';
import { Shield, CheckCircle, Clock, FileText, LogOut, Check, ChevronRight } from 'lucide-react-native';

export const SarpanchPortalScreen: React.FC = () => {
  const { complaints, updateComplaintStatus, userSession, logoutUser, back, t } = useApp();

  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRecord | null>(null);
  const [remarksInput, setRemarksInput] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const totalCount = complaints.length;
  const underProcessCount = complaints.filter((c) => c.status === 'Under Process').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  const handleOpenResolveModal = (c: ComplaintRecord) => {
    setSelectedComplaint(c);
    setRemarksInput(c.officialRemarks || '');
    setModalVisible(true);
  };

  const handleConfirmResolve = () => {
    if (selectedComplaint) {
      updateComplaintStatus(
        selectedComplaint.id,
        'Resolved',
        remarksInput || 'Field inspection completed by Panchayat Secretary K. Narsaiah. Issue resolved.'
      );
      setModalVisible(false);
      Alert.alert('Status Updated', `Complaint ${selectedComplaint.id} has been marked as Resolved.`);
    }
  };

  const handleMarkUnderProcess = (c: ComplaintRecord) => {
    updateComplaintStatus(c.id, 'Under Process', 'Panchayat technician assigned. Site inspection in progress.');
    Alert.alert('Status Updated', `Complaint ${c.id} is now Under Process.`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Sarpanch & Sachiv Portal"
        stepText="Machnoor Gram Panchayat Management"
        showBack
        onBack={back}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sarpanch User Banner */}
        <View style={styles.sarpanchBanner}>
          <View style={styles.shieldIconBox}>
            <Shield size={28} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.sarpanchName}>{userSession?.fullName || 'K. Narsaiah (Panchayat Secretary)'}</Text>
            <Text style={styles.sarpanchRole}>Role: SARPANCH & SACHIV MANAGER • Machnoor</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: Colors.primaryLight }]}>
            <Text style={[styles.statNumber, { color: Colors.primaryDark }]}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total Village Reports</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.infoLight }]}>
            <Text style={[styles.statNumber, { color: Colors.info }]}>{underProcessCount}</Text>
            <Text style={styles.statLabel}>Under Process</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.successLight }]}>
            <Text style={[styles.statNumber, { color: Colors.success }]}>{resolvedCount}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Manage Village Complaints ({complaints.length})</Text>

        {/* Complaints Action Cards */}
        {complaints.map((item) => (
          <View key={item.id} style={styles.complaintCard}>
            <View style={styles.cardHeader}>
              <View style={styles.idBadge}>
                <Text style={styles.idText}>{item.id}</Text>
              </View>
              <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.categoryTitle}>{item.category}</Text>
            <Text style={styles.villagerMeta}>
              👤 Villager: {item.villagerName || 'B. Balaji'} • 📞 {item.villagerPhone || '9812345678'}
            </Text>
            <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>

            {item.officialRemarks && (
              <View style={styles.remarksBox}>
                <Text style={styles.remarksLabel}>Official Remark:</Text>
                <Text style={styles.remarksText}>{item.officialRemarks}</Text>
              </View>
            )}

            {/* Action Buttons for Sarpanch / Sachiv */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.processBtn}
                activeOpacity={0.8}
                onPress={() => handleMarkUnderProcess(item)}
              >
                <Clock size={16} color={Colors.info} style={{ marginRight: 4 }} />
                <Text style={styles.processBtnText}>Under Process</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resolveBtn}
                activeOpacity={0.8}
                onPress={() => handleOpenResolveModal(item)}
              >
                <CheckCircle size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.resolveBtnText}>Resolve & Add Remark</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Logout Sarpanch */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85} onPress={logoutUser}>
          <LogOut size={20} color={Colors.error} style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Logout Sarpanch Portal</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Resolution & Remarks Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Resolve Complaint {selectedComplaint?.id}</Text>
            <Text style={styles.modalSub}>Add official remarks for villager notification:</Text>

            <TextInput
              multiline
              numberOfLines={3}
              style={styles.modalInput}
              placeholder="e.g. Field inspection completed. Road repair completed by Panchayat."
              placeholderTextColor={Colors.textMuted}
              value={remarksInput}
              onChangeText={setRemarksInput}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleConfirmResolve}>
                <Text style={styles.modalSubmitText}>Save & Resolve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Submitted':
      return { backgroundColor: Colors.warningLight };
    case 'Under Process':
      return { backgroundColor: Colors.infoLight };
    case 'Resolved':
      return { backgroundColor: Colors.successLight };
    case 'Closed':
      return { backgroundColor: Colors.border };
    default:
      return { backgroundColor: Colors.border };
  }
};

const getStatusTextStyle = (status: string) => {
  switch (status) {
    case 'Submitted':
      return { color: Colors.warning };
    case 'Under Process':
      return { color: Colors.info };
    case 'Resolved':
      return { color: Colors.success };
    case 'Closed':
      return { color: Colors.textSecondary };
    default:
      return { color: Colors.textSecondary };
  }
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
  sarpanchBanner: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  shieldIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sarpanchName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sarpanchRole: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondaryLight,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  complaintCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  idText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  villagerMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  descText: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 6,
    lineHeight: 18,
  },
  remarksBox: {
    backgroundColor: Colors.warningLight,
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  remarksLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.warning,
  },
  remarksText: {
    fontSize: 12,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  processBtn: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.infoLight,
    borderWidth: 1,
    borderColor: Colors.info,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.info,
  },
  resolveBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.success,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resolveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logoutBtn: {
    backgroundColor: Colors.surface,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.errorLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modalSubmitBtn: {
    backgroundColor: Colors.success,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalSubmitText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
