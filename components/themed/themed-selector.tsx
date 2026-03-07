import { View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { ThemedButton } from "./themed-button";
import { useState } from "react";

export type ThemedSelectorProps<T> = {
  options: { [key: string]: T };
  setSelected: (val: T) => void;
  defaultSlected?: string;
  label?: string;
};

export function ThemedSelector<T>({
  options,
  setSelected,
  defaultSlected,
  label,
}: ThemedSelectorProps<T>) {
  const keys = Object.keys(options);
  const [selectedKey, setSelectedKey] = useState(defaultSlected ?? keys[0]);
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
        {keys.map((key, ind) => {
          const leftRadius = ind === 0 ? 8 : 0;
          const rightRadius = ind === keys.length - 1 ? 8 : 0;
          const selected = key === selectedKey;
          const borderSize = selected ? 0 : 2;
          return (
            <ThemedButton
              key={key}
              colorName={selected ? "highlight" : "backgroundFaint"}
              borderCol="border"
              textProps={{
                colorName: selected ? "background" : "text",
                type: selected ? "defaultSemiBold" : "default",
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
                borderRightWidth: ind === keys.length - 1 ? borderSize : 0,
              }}
              text={key}
              onPress={() => {
                setSelected(options[key]);
                setSelectedKey(key);
              }}
            />
          );
        })}
      </ThemedView>
    </View>
  );
}
