import { View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { ThemedButton } from "./themed-button";

export type ThemedSelectorProps = {
  options: string[];
  selected: string;
  setSelected: (val: string) => void;

  label?: string;
};

export function ThemedSelector({
  options,
  selected,
  setSelected,
  label,
}: ThemedSelectorProps) {
  return (
    <View style={{ gap: 4, width: "100%" }}>
      {label ? <ThemedText>{label}</ThemedText> : <></>}
      <ThemedView
        borderCol="border"
        colorName="border"
        style={{
          borderWidth: 2,
          borderRadius: 8,
          height: 40,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        {options.map((val, ind) => {
          const leftRadius = ind === 0 ? 6 : 0;
          const rightRadius = ind === options.length - 1 ? 6 : 0;
          const highlighted = val === selected;
          return (
            <ThemedButton
              key={val}
              colorName={highlighted ? "highlight" : "backgroundFaint"}
              textProps={{
                colorName: highlighted ? "background" : "text",
                type: highlighted ? "defaultSemiBold" : "default",
              }}
              style={{
                height: 36,
                width: "auto",
                flex: 1,
                borderTopLeftRadius: leftRadius,
                borderBottomLeftRadius: leftRadius,
                borderTopRightRadius: rightRadius,
                borderBottomRightRadius: rightRadius,
              }}
              text={val}
              onPress={() => setSelected(val)}
            />
          );
        })}
      </ThemedView>
    </View>
  );
}
