import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp, ComplaintRecord } from '../context/AppContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Search, ChevronRight, Camera, FileText } from 'lucide-react-native';

// Status filter keys — always internal English values
const STATUS_KEYS = ['ALL', 'Submitted', 'Under Process', 'Resolved', 'Closed'] as const;
type StatusKey = typeof STATUS_KEYS[number];

export const MyComplaintsScreen: React.FC = () => {
  const { navigate, complaints, t, back } = useApp();

  const [filterKey, setFilterKey] = useState<StatusKey>('ALL');
  const [query, setQuery] = useState('');

  // Translated labels for filter pills
  const filterLabels: Record<StatusKey, string> = {
    ALL:           t('all'),
    Submitted:     t('submittedStatus'),
    'Under Process': t('underProcessStatus'),
    Resolved:      t('resolvedStatus'),
    Closed:        t('closedStatus'),
  };

  const filtered = complaints.filter(
    (c) =>
      (filterKey === 'ALL' || c.status === filterKey) &&
      (query === '' ||
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <Header title={t('myComplaintsTitle')} stepText={t('myComplaintsSub')} showBack onBack={back} />

      {/* Search + Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {STATUS_KEYS.map((key) => {
            const isActive = filterKey === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setFilterKey(key)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filterLabels[key]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>{t('noComplaintsFound')}</Text>
            <Text style={styles.emptySub}>{t('noComplaintsSub')}</Text>
          </View>
        ) : (
          filtered.map((item: ComplaintRecord) => (
            <TouchableOpacity
              key={item.id}
              style={styles.complaintCard}
              activeOpacity={0.85}
              onPress={() => navigate('COMPLAINT_DETAILS', { id: item.id })}
            >
              <View style={styles.cardIconBox}>
                {item.hasPhoto
                  ? <Camera size={22} color={Colors.textSecondary} />
                  : <FileText size={22} color={Colors.primary} />
                }
              </View>

              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.complaintId}>{item.id}</Text>
                  <View style={[styles.statusBadge, getStatusBg(item.status)]}>
                    <Text style={[styles.statusText, getStatusColor(item.status)]}>
                      {getStatusLabel(item.status, filterLabels)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.categoryTitle} numberOfLines={1}>{getCategoryLabel(item.category, t)}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <ChevronRight size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BottomNav active="complaints" />
    </View>
  );
};

// Map status to translated label using the filter labels dict
function getStatusLabel(status: string, labels: Record<string, string>): string {
  if (status === 'Submitted')     return labels['Submitted'];
  if (status === 'Under Process') return labels['Under Process'];
  if (status === 'Resolved')      return labels['Resolved'];
  if (status === 'Closed')        return labels['Closed'];
  return status;
}

// Map English category strings from DB/local store to translated strings
function getCategoryLabel(category: string, t: any): string {
  switch (category) {
    case 'Roads & Infrastructure':
      return t('catRoads');
    case 'Water & Drainage':
      return t('catWater');
    case 'Land & Property Issues':
      return t('catLand');
    case 'Govt Services & Certificates':
      return t('catGovt');
    case 'Sanitation & Cleanliness':
      return t('catSanitation');
    case 'Other Issues':
      return t('catOther');
    default:
      return category;
  }
}

const getStatusBg = (status: string) => {
  switch (status) {
    case 'Submitted':     return { backgroundColor: Colors.warningLight };
    case 'Under Process': return { backgroundColor: Colors.infoLight };
    case 'Resolved':      return { backgroundColor: Colors.successLight };
    case 'Closed':        return { backgroundColor: Colors.border };
    default:              return { backgroundColor: Colors.border };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Submitted':     return { color: Colors.warning };
    case 'Under Process': return { color: Colors.info };
    case 'Resolved':      return { color: Colors.success };
    case 'Closed':        return { color: Colors.textSecondary };
    default:              return { color: Colors.textSecondary };
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchSection: { padding: 16, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: 14, paddingHorizontal: 12, height: 46, borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  filterScroll: { marginTop: 10 },
  filterPill: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16,
    backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, marginRight: 8,
  },
  filterPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  filterTextActive: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingBottom: 90 },
  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  emptySub: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  complaintCard: {
    backgroundColor: Colors.surface, borderRadius: 18, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border, elevation: 2,
  },
  cardIconBox: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  cardBody: { flex: 1, marginLeft: 12, marginRight: 8 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  complaintId: { fontSize: 11, fontWeight: '800', color: Colors.primary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800' },
  categoryTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  dateText: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
});
