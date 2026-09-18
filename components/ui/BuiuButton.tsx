import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, FontSize, Spacing, Shadow } from '../../constants/theme';

interface BuiuButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'big';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function BuiuButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: BuiuButtonProps) {
  const getBgColor = () => {
    if (disabled) return '#888888';
    switch (variant) {
      case 'primary': return Colors.bgButton;
      case 'secondary': return Colors.bgButtonSecondary;
      case 'danger': return '#CC0000';
      case 'big': return '#FF0000';
      default: return Colors.bgButton;
    }
  };

  const getFontSize = () => {
    if (variant === 'big') return FontSize.xxl;
    return FontSize.lg;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.6}
      style={[
        styles.base,
        { backgroundColor: getBgColor() },
        variant === 'big' && styles.bigButton,
        Shadow.ugly,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            { fontSize: getFontSize() },
            variant === 'big' && styles.bigText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderWidth: 3,
    borderColor: Colors.borderColor,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
  },
  bigButton: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    borderWidth: 5,
    width: '100%',
  },
  text: {
    color: Colors.textOnButton,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'ComicSans',
  },
  bigText: {
    fontSize: FontSize.xxl,
    letterSpacing: 2,
  },
});
