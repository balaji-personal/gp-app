import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Delete } from 'lucide-react-native';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onBackspace }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

  return (
    <View style={styles.container}>
      {keys.map((key, index) => {
        if (key === '') {
          return <View key={index} style={styles.keyEmpty} />;
        }
        if (key === 'back') {
          return (
            <TouchableOpacity
              key={index}
              style={styles.keyButton}
              activeOpacity={0.7}
              onPress={onBackspace}
            >
              <Delete size={26} color={Colors.textPrimary} />
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={index}
            style={styles.keyButton}
            activeOpacity={0.7}
            onPress={() => onKeyPress(key)}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  keyButton: {
    width: '30%',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  keyEmpty: {
    width: '30%',
    height: 60,
    marginBottom: 12,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
