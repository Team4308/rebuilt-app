import { View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { ThemedButton, ThemedButtonProps } from "./themed-button";
import { useEffect } from "react";

export type ThemedSelectorProps<T> = {
  options: [T, string?][];
  selected?: T;
  defaultVal?: T;
  setSelected: (val: T) => void;
  label?: string;
};

export function ThemedSelector<T>({
  options,
  selected,
  defaultVal,
  setSelected,
  label,
}: ThemedSelectorProps<T>) {
  useEffect(() => {
    if (selected === undefined && defaultVal !== undefined)
      setSelected(defaultVal);
  });
  if (selected === undefined) return <></>;
  return (
    <View style={{ gap: 4, width: "100%" }}>
      {label ? <ThemedText>{label}</ThemedText> : <></>}
      <ThemedView
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
              key={valLabel ?? ind}
              colorName={isSelected ? "highlight" : "backgroundFaint"}
              borderCol="border"
              textProps={{
                colorName: isSelected ? "background" : "text",
                type: isSelected ? "semiBold" : "default",
              }}
              style={{
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
              text={valLabel ?? String(val)}
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

export function RatingSelector({
  label,
  selected,
  setSelected,
}: {
  label?: string;
  selected?: number;
  setSelected: (val: number) => void;
}) {
  return (
    <ThemedSelector
      label={label}
      options={[[1], [2], [3], [4], [5]]}
      selected={selected}
      defaultVal={3}
      setSelected={setSelected}
    />
  );
}

export function CheckBox({
  style,
  label,
  on,
  setOn,
  ...rest
}: {
  label: string;
  on?: boolean;
  setOn: (val: boolean) => void;
} & ThemedButtonProps) {
  useEffect(() => {
    if (on === undefined) setOn(false);
  }, []);
  if (on === undefined) return <></>;

  return (
    <ThemedButton
      colorName="backgroundFaint"
      borderCol="border"
      style={[
        {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingHorizontal: 16,
        },
        style,
      ]}
      text={label}
      textProps={{ colorName: "text", type: "default" }}
      onPress={() => setOn(!on)}
      {...rest}
    >
      <View style={{ flex: 1 }} />
      <ThemedView
        borderCol="border"
        colorName={on ? "highlight" : "backgroundFaint"}
        style={{ width: 22, height: 22, borderRadius: 4 }}
      />
    </ThemedButton>
  );
}
