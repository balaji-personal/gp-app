import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Mic, Camera, CheckCircle, Clock, Circle } from 'lucide-react-native';

export const ComplaintDetailScreen: React.FC = () => {
  const { params, complaints, t, back } = useApp();

  const complaintId = params?.id || 'GP-2026-0481';
  const complaint = complaints.find((c) => c.id === complaintId) || complaints[0];

  const timeline = [
    { label: 'Submitted', date: `${complaint?.date || '28 Jul 2026'}, 9:41 AM`, state: 'done' },
    { label: 'Under Process', date: 'In progress', state: 'active' },
    { label: 'Resolved', date: 'Pending', state: 'todo' },
    { label: 'Closed', date: 'Pending', state: 'todo' },
  ];

  return (
    <View style={styles.container}>
      <Header title={t('complaintDetailsTitle')} stepText={complaint?.id || complaintId} showBack onBack={back} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('complaintId')}</Text>
            <Text style={styles.idValue}>{complaint?.id || complaintId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>{t('category')}</Text>
            <Text style={styles.valBold}>{complaint?.category || 'Roads & Infrastructure'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>{t('currentStatus')}</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{complaint?.status || 'Under Process'}</Text>
            </View>
          </View>
        </View>

        {/* Description & Voice Waveform */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('description')}</Text>
          <Text style={styles.descText}>
            {complaint?.description || 'Main road damage near school gate requiring immediate repair.'}
          </Text>

          <View style={styles.voiceBox}>
            <TouchableOpacity style={styles.playBtn}>
              <Mic size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.waveformContainer}>
              <View style={styles.waveformBars}>
                {[6, 12, 8, 16, 10, 14, 7, 18, 11, 9, 15, 6, 12, 8, 10, 14, 7, 11, 9, 13].map((h, i) => (
                  <View key={i} style={[styles.bar, { height: h }]} />
                ))}
              </View>
              <Text style={styles.voiceDuration}>Voice recording • {complaint?.voiceSeconds || 12} sec</Text>
            </View>
          </View>
        </View>

        {/* Uploaded Photos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('uploadedPhotos')}</Text>
          <View style={styles.photosGrid}>
            <View style={styles.photoPlaceholder}>
              <Camera size={28} color={Colors.textMuted} />
            </View>
            <View style={styles.photoPlaceholder}>
              <Camera size={28} color={Colors.textMuted} />
            </View>
          </View>
        </View>

        {/* Official Remarks */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('officialRemarks')}</Text>
          <View style={styles.remarksBox}>
            <Text style={styles.remarksText}>
              {complaint?.officialRemarks || 'Complaint received. Field inspection scheduled by Panchayat Secretary K. Narsaiah.'}
            </Text>
          </View>
        </View>

        {/* Progress Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('progressTimeline')}</Text>
          <View style={styles.timelineList}>
            {timeline.map((item, idx) => (
              <View key={item.label} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  {item.state === 'done' ? (
                    <CheckCircle size={22} color={Colors.success} />
                  ) : item.state === 'active' ? (
                    <Clock size={22} color={Colors.info} />
                  ) : (
                    <Circle size={22} color={Colors.borderDark} />
                  )}
                  {idx < timeline.length - 1 && <View style={[styles.line, item.state === 'done' && styles.lineDone]} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, item.state === 'todo' && styles.timelineLabelTodo]}>
                    {item.label}
                  </Text>
                  <Text style={styles.timelineDate}>{item.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  idValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  valBold: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  statusPill: {
    backgroundColor: Colors.infoLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.info,
  },
  descText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  voiceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  waveformContainer: {
    flex: 1,
  },
  waveformBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 20,
  },
  bar: {
    width: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  voiceDuration: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remarksBox: {
    backgroundColor: Colors.warningLight,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  remarksText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  timelineList: {
    marginTop: 6,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 30,
  },
  line: {
    width: 2,
    height: 32,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: Colors.success,
  },
  timelineContent: {
    marginLeft: 10,
    paddingBottom: 16,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timelineLabelTodo: {
    color: Colors.textMuted,
  },
  timelineDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
