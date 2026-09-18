import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../../constants/theme';

interface CircularImageProps {
  uri: string | null | undefined;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
  style?: ViewStyle;
}

export function CircularImage({
  uri,
  size = 60,
  borderColor = Colors.borderColor,
  borderWidth = 3,
  style,
}: CircularImageProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          borderWidth,
        },
        style,
      ]}
    >
      <Image
        source={uri ? { uri } : { uri: 'https://cdn-ai.onspace.ai/onspace/files/DQaUeVbP8NGk7UpSgMzC25/app_icon.jpeg' }}
        style={{
          width: size - borderWidth * 2,
          height: size - borderWidth * 2,
          borderRadius: (size - borderWidth * 2) / 2,
        }}
        contentFit="cover"
        transition={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
  },
});
