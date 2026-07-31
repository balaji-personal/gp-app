// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { Colors } from '../theme/colors';
// import { ChevronLeft, Globe } from 'lucide-react-native';
// import { useApp } from '../context/AppContext';

// interface HeaderProps {
//   title: string;
//   stepText?: string;
//   showBack?: boolean;
//   onBack?: () => void;
// }

// export const Header: React.FC<HeaderProps> = ({
//   title,
//   stepText,
//   showBack = false,
//   onBack,
// }) => {
//   const { lang, setLang } = useApp();

//   return (
//     <View style={styles.headerContainer}>
//       <View style={styles.headerRow}>
//         {showBack && (
//           <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
//             <ChevronLeft size={22} color="#FFFFFF" />
//           </TouchableOpacity>
//         )}
//         <View style={styles.titleContainer}>
//           <Text style={styles.headerTitle} numberOfLines={1}>
//             {title}
//           </Text>
//           {stepText && <Text style={styles.headerStep}>{stepText}</Text>}
//         </View>

//         <TouchableOpacity
//           style={styles.langToggle}
//           onPress={() => setLang(lang === 'en' ? 'te' : 'en')}
//           activeOpacity={0.8}
//         >
//           <Globe size={14} color="#FFFFFF" />
//           <Text style={styles.langToggleText}>{lang === 'en' ? 'తెలుగు' : 'English'}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerContainer: {
//     backgroundColor: '#15803D',
//     paddingTop: 18,
//     paddingBottom: 20,
//     paddingHorizontal: 18,
//     borderBottomLeftRadius: 28,
//     borderBottomRightRadius: 28,
//     elevation: 4,
//     shadowColor: '#14532D',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.22)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   titleContainer: {
//     flex: 1,
//   },
//   headerTitle: {
//     color: '#FFFFFF',
//     fontSize: 22,
//     fontWeight: '800',
//     letterSpacing: -0.3,
//   },
//   headerStep: {
//     color: 'rgba(255, 255, 255, 0.9)',
//     fontSize: 13,
//     fontWeight: '500',
//     marginTop: 2,
//   },
//   langToggle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.22)',
//     paddingHorizontal: 12,
//     paddingVertical: 7,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.35)',
//   },
//   langToggleText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '700',
//     marginLeft: 5,
//   },
// });

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Globe } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title: string;
  stepText?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  stepText,
  showBack = false,
  onBack,
}) => {
  const { lang, setLang } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 12 }]}> 
      <View style={styles.headerRow}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <ChevronLeft size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          {stepText && <Text style={styles.headerStep}>{stepText}</Text>}
        </View>

        <TouchableOpacity
          style={styles.langToggle}
          onPress={() => setLang(lang === 'en' ? 'te' : 'en')}
          activeOpacity={0.8}
        >
          <Globe size={14} color="#FFFFFF" />
          <Text style={styles.langToggleText}>{lang === 'en' ? 'తెలుగు' : 'English'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#15803D',
    paddingBottom: 20,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 4,
    shadowColor: '#14532D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerStep: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    minHeight: 36,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  langToggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },
});

