import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { hexToRgb, isHex, normalizeHex, rgbToHex, type RGB } from '@/lib/design/color';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, Pressable, TextInput, View, type GestureResponderEvent } from 'react-native';

/** 편집 패널 전용 스타일 (미리보기 토큰과 분리하려고 slate 고정색 사용) */
export function PanelSection({
  title,
  hint,
  children,
  right,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <View className="gap-3 border-b border-slate-200 px-5 py-5">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-1 gap-0.5">
          <Text className="text-[15px] font-bold text-slate-900">{title}</Text>
          {hint ? <Text className="text-xs leading-5 text-slate-500">{hint}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Text className="text-xs font-semibold text-slate-600">{children}</Text>;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  trackStyle,
  fillClassName = 'bg-slate-800',
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  trackStyle?: object;
  fillClassName?: string;
}) {
  const width = React.useRef(1);
  const ratio = (value - min) / (max - min);
  const update = (e: GestureResponderEvent) => {
    const r = Math.min(1, Math.max(0, e.nativeEvent.locationX / width.current));
    const raw = min + r * (max - min);
    onChange(Math.round(raw / step) * step);
  };
  return (
    <View
      className="h-6 flex-1 justify-center"
      onLayout={(e) => (width.current = e.nativeEvent.layout.width || 1)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={update}
      onResponderMove={update}
      style={Platform.OS === 'web' ? ({ cursor: 'pointer', touchAction: 'none' } as object) : undefined}>
      <View pointerEvents="none" className="h-2 overflow-hidden rounded-full bg-slate-200" style={trackStyle}>
        {trackStyle ? null : (
          <View className={cn('h-full', fillClassName)} style={{ width: `${ratio * 100}%` }} />
        )}
      </View>
      <View
        pointerEvents="none"
        className="absolute h-5 w-5 rounded-full border-2 border-white bg-slate-900 shadow"
        style={{ left: `${ratio * 100}%`, marginLeft: -10 }}
      />
    </View>
  );
}

function NumberBox({ value, onChange, max = 255 }: { value: number; onChange: (n: number) => void; max?: number }) {
  const [text, setText] = React.useState(String(value));
  React.useEffect(() => setText(String(value)), [value]);
  return (
    <TextInput
      value={text}
      onChangeText={(t) => {
        setText(t);
        const n = Number(t);
        if (t !== '' && Number.isFinite(n)) onChange(Math.min(max, Math.max(0, Math.round(n))));
      }}
      keyboardType="number-pad"
      className="h-8 w-14 rounded-md border border-slate-300 bg-white px-2 text-center text-[13px] text-slate-900"
    />
  );
}

/** 웹에서는 브라우저 기본 색 선택기도 같이 띄운다 */
function NativeColorPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  if (Platform.OS !== 'web') return null;
  return React.createElement('input', {
    type: 'color',
    value,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    title: '색 선택기 열기',
    style: {
      width: 36,
      height: 36,
      padding: 0,
      border: '1px solid #cbd5e1',
      borderRadius: 8,
      background: 'white',
      cursor: 'pointer',
    },
  });
}

const CHANNELS: { key: keyof RGB; label: string }[] = [
  { key: 'r', label: 'R' },
  { key: 'g', label: 'G' },
  { key: 'b', label: 'B' },
];

/** RGB 슬라이더 + HEX 입력 + 추천 색 */
export function ColorField({
  label,
  value,
  onChange,
  swatches,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  swatches?: string[];
  compact?: boolean;
}) {
  const rgb = hexToRgb(value);
  const [hexText, setHexText] = React.useState(value);
  const [open, setOpen] = React.useState(!compact);
  React.useEffect(() => setHexText(value), [value]);

  const setChannel = (key: keyof RGB, v: number) => onChange(rgbToHex({ ...rgb, [key]: v }));

  return (
    <View className="gap-2.5">
      <View className="flex-row items-center gap-2.5">
        <Pressable
          onPress={() => setOpen((o) => !o)}
          className="h-9 w-9 rounded-lg border border-black/10"
          style={{ backgroundColor: value }}
          accessibilityLabel={`${label} 펼치기`}
        />
        <View className="flex-1">
          <Text className="text-[13px] font-semibold text-slate-800">{label}</Text>
          <Text className="font-mono text-[11px] text-slate-500">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </Text>
        </View>
        <TextInput
          value={hexText}
          onChangeText={(t) => {
            setHexText(t);
            if (isHex(t)) onChange(normalizeHex(t.startsWith('#') ? t : `#${t}`));
          }}
          autoCapitalize="none"
          className="h-9 w-[92px] rounded-md border border-slate-300 bg-white px-2 font-mono text-[13px] text-slate-900"
        />
        <NativeColorPicker value={value} onChange={onChange} />
      </View>
      {open ? (
        <View className="gap-1.5 pl-0.5">
          {CHANNELS.map(({ key, label: ch }) => {
            const from = rgbToHex({ ...rgb, [key]: 0 });
            const to = rgbToHex({ ...rgb, [key]: 255 });
            return (
              <View key={key} className="flex-row items-center gap-2.5">
                <Text className="w-3 text-xs font-bold text-slate-500">{ch}</Text>
                <Slider
                  value={rgb[key]}
                  min={0}
                  max={255}
                  onChange={(v) => setChannel(key, v)}
                  trackStyle={
                    Platform.OS === 'web'
                      ? ({ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` } as object)
                      : { backgroundColor: to }
                  }
                />
                <NumberBox value={rgb[key]} onChange={(v) => setChannel(key, v)} />
              </View>
            );
          })}
        </View>
      ) : null}
      {swatches && open ? (
        <View className="flex-row flex-wrap gap-1.5">
          {swatches.map((sw) => (
            <Pressable
              key={sw}
              onPress={() => onChange(sw)}
              className={cn(
                'h-6 w-6 rounded-md border',
                sw.toLowerCase() === value.toLowerCase() ? 'border-slate-900' : 'border-black/10'
              )}
              style={{ backgroundColor: sw }}
              accessibilityLabel={sw}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            className={cn('flex-grow items-center rounded-md px-2.5 py-1.5', on && 'bg-white shadow-sm')}>
            <Text className={cn('text-xs', on ? 'font-bold text-slate-900' : 'font-medium text-slate-500')}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ChoiceRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <View className="gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <Segmented value={value} options={options} onChange={onChange} />
    </View>
  );
}

export function SwitchRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1">
        <Text className="text-[13px] font-semibold text-slate-800">{label}</Text>
        {hint ? <Text className="text-xs text-slate-500">{hint}</Text> : null}
      </View>
      <Switch checked={value} onCheckedChange={onChange} />
    </View>
  );
}

export function ShellButton({
  label,
  onPress,
  tone = 'default',
}: {
  label: string;
  onPress: () => void;
  tone?: 'default' | 'dark';
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'h-9 items-center justify-center rounded-lg px-3.5',
        tone === 'dark' ? 'bg-slate-900' : 'border border-slate-300 bg-white'
      )}>
      <Text className={cn('text-[13px] font-semibold', tone === 'dark' ? 'text-white' : 'text-slate-800')}>
        {label}
      </Text>
    </Pressable>
  );
}
