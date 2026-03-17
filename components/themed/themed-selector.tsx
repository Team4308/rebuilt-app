import { View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { ThemedButton } from "./themed-button";

export type ThemedSelectorProps<T> = {
  options: [T, string?][];
  selected: T;
  setSelected: (val: T) => void;
  label?: string;
};

export function ThemedSelector<T>({
  options,
  selected,
  setSelected,
  label,
}: ThemedSelectorProps<T>) {
  return (
    <View style={{ gap: 4, width: "100%" }}>
      {label ? <ThemedText>{label}</ThemedText> : <></>}
      <ThemedView
        borderCol="border"
        colorName="border"
        style={{
          borderRadius: 8,
          height: 40,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        {options.map(([val, valLabel], ind) => {
          const leftRadius = ind === 0 ? 8 : 0;
          const rightRadius = ind === options.length - 1 ? 8 : 0;
          const isSelected = val === selected;
          const borderSize = isSelected ? 0 : 2;
          return (
            <ThemedButton
              key={valLabel}
              colorName={isSelected ? "highlight" : "backgroundFaint"}
              borderCol="border"
              textProps={{
                colorName: isSelected ? "background" : "text",
                type: isSelected ? "defaultSemiBold" : "default",
              }}
              style={{
                height: 40,
                width: "auto",
                flex: 1,
                borderTopLeftRadius: leftRadius,
                borderBottomLeftRadius: leftRadius,
                borderTopRightRadius: rightRadius,
                borderBottomRightRadius: rightRadius,
                borderTopWidth: borderSize,
                borderBottomWidth: borderSize,
                borderLeftWidth: ind === 0 ? borderSize : 0,
                borderRightWidth: ind === options.length - 1 ? borderSize : 0,
              }}
              text={valLabel ?? JSON.stringify(val)}
              onPress={() => {
                if (isSelected) return;
                setSelected(val);
              }}
            />
          );
        })}
      </ThemedView>
    </View>
  );
}
