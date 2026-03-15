import { Colors } from "@/constants/theme";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { G, Line, Polygon, Polyline, Rect } from "react-native-svg";

type ArenaSVGProps = {
  style?: StyleProp<ViewStyle>;
};

export const arenaW = 664;
export const arenaH = 330;

const sw = 2,
  hsw = sw / 2;

const w = 651.22,
  h = 317.68;
const hw = w / 2,
  hh = h / 2;

const dw = 27,
  dh = 42;
const dx = hw - dw + hsw,
  dy1 = 75.93 - dh / 2 + hsw,
  dy2 = dy1 + dh - sw;

const oh = 49.84,
  ox = hw + sw + hsw,
  oy = -hh + 26.22 - oh / 2 + hsw;

const ch = 47,
  cc = -11.38,
  cx = 282.05 + hsw,
  cy = cc - ch / 2 + hsw;
const cfh = 38,
  cfw = 45,
  cfx = hw - cfw + hsw,
  cfy1 = cc - cfh / 2 + hsw,
  cfy2 = cc + cfh / 2 - hsw;

const hs = 47,
  hhs = hs / 2,
  hx = 143.5,
  hhh = 38 - sw,
  hr = hhh / Math.sqrt(3),
  hhr = hr / 2;

const rh = 73,
  rw = 44.4,
  r2h = 12;
const th = 49.86,
  tw = 4;

function RampTrench({
  stroke,
  fill,
  transform,
}: {
  stroke: string;
  fill: string;
  transform?: string;
}) {
  return (
    <G transform={transform}>
      <Rect
        x={hx - rw / 2 + hsw}
        y={hs / 2 - hsw}
        width={rw - sw}
        height={rh + sw}
      />
      <Rect
        x={hx - hs / 2 + hsw}
        y={hs / 2 + rh + hsw}
        width={hs - sw}
        height={r2h - sw}
        fill={stroke}
      />
      <Line
        x1={hx}
        x2={hx}
        y1={hs / 2}
        y2={hs / 2 + rh}
        stroke={fill}
        strokeLinecap="butt"
      />

      <Rect
        x={hx - tw / 2 + hsw}
        y={hs / 2 + rh + r2h + hsw}
        width={tw - sw}
        height={th - sw}
        fill={"none"}
      />
    </G>
  );
}

function Half({
  stroke,
  fill,
  transform,
}: {
  stroke: string;
  fill: string;
  transform?: string;
}) {
  return (
    <G id="half" stroke={stroke} fill={fill} transform={transform}>
      <Line
        x1={167}
        y1={0}
        x2={hw}
        y2={0}
        stroke={Colors.backgroundFaint}
        strokeLinecap="butt"
        strokeWidth={5}
      />
      <Polyline
        points={[hw, dy1, dx, dy1, dx, dy2, hw, dy2]}
        strokeLinecap="butt"
      />
      <Line x1={ox} x2={ox} y1={oy} y2={oy + oh - sw} />
      <Line x1={cx} x2={cx} y1={cy} y2={cy + ch - sw} />
      <Polyline
        points={[hw, cfy1, cfx, cfy1, cfx, cfy2, hw, cfy2]}
        strokeLinecap="butt"
      />
      <Rect
        x={hx + hsw - hhs}
        y={-hhs + hsw}
        width={hs - sw}
        height={hs - sw}
      />
      <Polygon
        points={[
          hx + hr,
          0,
          hx + hhr,
          hhh / 2,
          hx - hhr,
          hhh / 2,
          hx - hr,
          0,
          hx - hhr,
          -hhh / 2,
          hx + hhr,
          -hhh / 2,
        ]}
      />

      <RampTrench stroke={stroke} fill={fill} />
      <RampTrench
        stroke={stroke}
        fill={fill}
        transform={`rotate(180,${hx},0)`}
      />

      <Line x1={168} x2={168} y1={-hh} y2={hh} strokeLinecap="butt" />
    </G>
  );
}

export function ArenaSVG({ style }: ArenaSVGProps) {
  return (
    <Svg
      style={style}
      viewBox={`-${arenaW / 2} -${arenaH / 2} ${arenaW} ${arenaH}`}
      fill="#00000000"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect
        x={-hw - hsw}
        y={-hh - hsw}
        width={w + sw}
        height={h + sw}
        stroke={Colors.border}
      />
      <Line
        x1={-120}
        y1={0}
        x2={120}
        y2={0}
        stroke={Colors.backgroundFaint}
        strokeLinecap="butt"
        strokeWidth={5}
      />
      <Line x1={0} y1={-hh} x2={0} y2={hh} stroke={Colors.border} />

      <Half
        stroke={Colors.red}
        fill={Colors.redFill}
        transform={"rotate(180)"}
      />
      <Half stroke={Colors.blue} fill={Colors.blueFill} />
    </Svg>
  );
}
