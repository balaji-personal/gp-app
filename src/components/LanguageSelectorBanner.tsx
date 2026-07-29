import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Globe } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

export const LanguageSelectorBanner: React.FC = () => {
  const { lang, setLang, t } = useApp();

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.leftRow}>
        <Globe size={22} color={Colors.secondaryDark} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.bannerTitle}>{t('selectLanguage')}</Text>
          <Text style={styles.bannerSub}>Choose app language / భాషను ఎంచుకోండి</Text>
        </View>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
          onPress={() => setLang('en')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>🇬🇧 EN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langBtn, lang === 'te' && styles.langBtnActive]}
          onPress={() => setLang('te')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langBtnText, lang === 'te' && styles.langBtnTextActive]}>🇮🇳 తెలుగు</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  bannerSub: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  btnRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  langBtnActive: {
    backgroundColor: Colors.primary,
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  langBtnTextActive: {
    color: '#FFFFFF',
  },
});
