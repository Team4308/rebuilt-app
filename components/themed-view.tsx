import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemeColors } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: ThemeColors;
};

export function ThemedView({ style, lightColor, darkColor, colorName, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, colorName ? colorName : 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
