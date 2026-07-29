import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { Header } from '../components/Header';
import { Construction, Droplets, Home, FileBadge, Trash2, Pin, ArrowRight, Volume2 } from 'lucide-react-native';

interface CategorySelectScreenProps {
  onBack: () => void;
  onSelectCategory: (category: string) => void;
}

export const CategorySelectScreen: React.FC<CategorySelectScreenProps> = ({ onBack, onSelectCategory }) => {
  const [selected, setSelected] = useState<string>('Roads & Infrastructure');

  const categories = [
    { title: 'Roads & Bridges', sub: 'రోడ్లు & బ్రిడ్జిలు', icon: Construction, bg: '#E8F5E9', iconColor: '#2E7D32', border: '#A5D6A7' },
    { title: 'Water & Drainage', sub: 'మంచినీరు & మురుగు', icon: Droplets, bg: '#E3F2FD', iconColor: '#0288D1', border: '#90CAF9' },
    { title: 'Land & House', sub: 'భూమి & ఇల్లు', icon: Home, bg: '#FFF8E1', iconColor: '#F57F17', border: '#FFE082' },
    { title: 'Govt Certificates', sub: 'ప్రభుత్వ ధృవీకరణలు', icon: FileBadge, bg: '#F3E5F5', iconColor: '#7B1FA2', border: '#CE93D8' },
    { title: 'Sanitation & Trash', sub: 'శుభ్రత & చెత్త', icon: Trash2, bg: '#FFF3E0', iconColor: '#E65100', border: '#FFCC80' },
    { title: 'Other Issues', sub: 'ఇతర సమస్యలు', icon: Pin, bg: '#FFEBEE', iconColor: '#C62828', border: '#EF9A9A' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Register Complaint"
        stepText="Step 1 of 3"
        showBack
        onBack={onBack}
      />

      {/* Stepper Dots */}
      <View style={styles.stepperContainer}>
        <View style={[styles.stepDot, styles.activeStepDot]}>
          <Text style={styles.activeStepNumber}>1</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepDot}>
          <Text style={styles.stepNumber}>2</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepDot}>
          <Text style={styles.stepNumber}>3</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Illiterate Friendly Voice Assistant Banner */}
        <View style={styles.voiceAssistantBanner}>
          <Volume2 size={24} color={Colors.primary} style={{ marginTop: 2 }} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.voiceAssistantTitle}>Tap a picture below to choose problem</Text>
            <Text style={styles.voiceAssistantSub}>సమస్య గుర్తుపై నొక్కండి • బొమ్మను ఎంచుకోండి</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const isSelected = selected === cat.title;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  { backgroundColor: cat.bg, borderColor: cat.border },
                  isSelected && styles.selectedCard,
                ]}
                activeOpacity={0.85}
                onPress={() => setSelected(cat.title)}
              >
                <View style={[styles.iconWrapper, { backgroundColor: cat.iconColor }]}>
                  <Icon size={34} color="#FFFFFF" />
                </View>
                <Text style={styles.cardTitle}>{cat.title}</Text>
                <Text style={styles.cardSubTitle}>{cat.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.85}
          onPress={() => onSelectCategory(selected)}
        >
          <Text style={styles.continueText}>Continue (ముందుకు వెళ్లండి)</Text>
          <ArrowRight size={22} color="#FFFFFF" style={{ marginLeft: 8 }} />
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepDot: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#757575',
  },
  activeStepNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepLine: {
    width: 44,
    height: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
    borderRadius: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  voiceAssistantBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#A5D6A7',
  },
  voiceAssistantTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  voiceAssistantSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 155,
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  selectedCard: {
    borderColor: Colors.primary,
    borderWidth: 3.5,
    backgroundColor: '#FFFFFF',
    transform: [{ scale: 1.02 }],
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  cardSubTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  continueButton: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
