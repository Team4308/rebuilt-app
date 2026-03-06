import { ScrollView, ScrollViewProps } from "react-native";

export function DefaultScrollView({ style, ...rest }: ScrollViewProps) {
  return (
    <ScrollView
      style={[
        {
          flex: 1,
          width: "100%",
          display: "flex",
          gap: 12,
          paddingTop: 16,
          paddingBottom: 60,
        },
        style,
      ]}
      {...rest}
    />
  );
}
