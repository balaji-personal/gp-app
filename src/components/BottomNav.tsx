import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Home, ClipboardList, User } from 'lucide-react-native';
import { useApp, Screen } from '../context/AppContext';

interface BottomNavProps {
  active: 'home' | 'complaints' | 'profile';
}

export const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const { navigate, t } = useApp();

  const items: { key: 'home' | 'complaints' | 'profile'; label: string; icon: any; target: Screen }[] = [
    { key: 'home', label: t('home'), icon: Home, target: 'HOME' },
    { key: 'complaints', label: t('complaints'), icon: ClipboardList, target: 'MY_COMPLAINTS' },
    { key: 'profile', label: t('profile'), icon: User, target: 'PROFILE' },
  ];

  return (
    <View style={styles.navContainer}>
      {items.map((it) => {
        const IconComponent = it.icon;
        const isActive = active === it.key;
        return (
          <TouchableOpacity
            key={it.key}
            style={styles.navItem}
            onPress={() => navigate(it.target)}
            activeOpacity={0.7}
          >
            <IconComponent
              size={24}
              color={isActive ? Colors.primary : Colors.textMuted}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{it.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 2,
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
});
