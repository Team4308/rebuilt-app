import { View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { ThemedButton } from "./themed-button";
import { useState } from "react";

export type ThemedSelectorProps = {
  options: string[] | { [key: string]: any };
  setSelected: (val: any) => void;
  defaultSlected?: string;
  label?: string;
};

export function ThemedSelector({
  options,
  setSelected,
  defaultSlected,
  label,
}: ThemedSelectorProps) {
  const optionsIsArray = Array.isArray(options);
  const keys = optionsIsArray ? options : Object.keys(options);
  const [selectedKey, setSelectedKey] = useState(defaultSlected ?? keys[0]);
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
        {keys.map((key, ind) => {
          const leftRadius = ind === 0 ? 6 : 0;
          const rightRadius = ind === options.length - 1 ? 6 : 0;
          const highlighted = key === selectedKey;
          return (
            <ThemedButton
              key={key}
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
              text={key}
              onPress={() => {
                setSelected(optionsIsArray ? key : options[key]);
                setSelectedKey(key);
              }}
            />
          );
        })}
      </ThemedView>
    </View>
  );
}
