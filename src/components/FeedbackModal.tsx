import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, XCircle } from 'lucide-react-native';

interface FeedbackModalProps {
  visible: boolean;
  success: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, success, title, message, buttonLabel = 'Continue', onClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={[styles.iconCircle, success ? styles.successCircle : styles.errorCircle]}>
          {success ? <CheckCircle size={34} color="#15803D" /> : <XCircle size={34} color="#DC2626" />}
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={[styles.button, success ? styles.successButton : styles.errorButton]} onPress={onClose} activeOpacity={0.85}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(15, 23, 42, 0.52)' },
  card: { width: '100%', maxWidth: 390, borderRadius: 22, padding: 24, alignItems: 'center', backgroundColor: '#FFFFFF', elevation: 8, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 18 },
  iconCircle: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successCircle: { backgroundColor: '#DCFCE7' },
  errorCircle: { backgroundColor: '#FEE2E2' },
  title: { color: '#0F172A', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  message: { color: '#64748B', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 },
  button: { width: '100%', height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 22 },
  successButton: { backgroundColor: '#15803D' },
  errorButton: { backgroundColor: '#DC2626' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
