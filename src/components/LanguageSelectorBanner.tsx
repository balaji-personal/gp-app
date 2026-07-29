import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Globe } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

export const LanguageSelectorBanner: React.FC = () => {
  const { lang, setLang } = useApp();

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.leftRow}>
        <View style={styles.globeIconCircle}>
          <Globe size={18} color="#EA580C" />
        </View>
        <View style={{ marginLeft: 8, flex: 1 }}>
          <Text style={styles.bannerTitle}>
            {lang === 'te' ? 'భాషను ఎంచుకోండి' : 'Select Language'}
          </Text>
          <Text style={styles.bannerSub}>
            {lang === 'te' ? 'యాప్ భాష మార్చుకోండి' : 'Choose app language'}
          </Text>
        </View>
      </View>

      <View style={styles.btnRow}>
        {/* English button */}
        <TouchableOpacity
          style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
          onPress={() => setLang('en')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>
            🇬🇧 English
          </Text>
        </TouchableOpacity>

        {/* Telugu button */}
        <TouchableOpacity
          style={[styles.langBtn, lang === 'te' && styles.langBtnActive]}
          onPress={() => setLang('te')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langBtnText, lang === 'te' && styles.langBtnTextActive]}>
            🇮🇳 తెలుగు
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#FFFDF7',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  globeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  bannerSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  btnRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 3,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 11,
  },
  langBtnActive: {
    backgroundColor: '#15803D',
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  langBtnTextActive: {
    color: '#FFFFFF',
  },
});
