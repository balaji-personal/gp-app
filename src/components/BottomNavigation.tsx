import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Home, FileText, User } from 'lucide-react-native';

interface BottomNavigationProps {
  activeTab: 'HOME' | 'COMPLAINTS' | 'PROFILE';
  onTabChange: (tab: 'HOME' | 'COMPLAINTS' | 'PROFILE') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabChange('HOME')}
        activeOpacity={0.7}
      >
        <Home size={22} color={activeTab === 'HOME' ? Colors.primary : Colors.textMuted} />
        <Text style={[styles.tabText, activeTab === 'HOME' && styles.activeTabText]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabChange('COMPLAINTS')}
        activeOpacity={0.7}
      >
        <FileText size={22} color={activeTab === 'COMPLAINTS' ? Colors.primary : Colors.textMuted} />
        <Text style={[styles.tabText, activeTab === 'COMPLAINTS' && styles.activeTabText]}>Complaints</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabChange('PROFILE')}
        activeOpacity={0.7}
      >
        <User size={22} color={activeTab === 'PROFILE' ? Colors.primary : Colors.textMuted} />
        <Text style={[styles.tabText, activeTab === 'PROFILE' && styles.activeTabText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8E3',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 4,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '800',
  },
});
