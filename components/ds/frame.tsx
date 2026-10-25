import { Text } from '@/components/ui/text';
import { ThemeScope } from '@/components/ds/theme-scope';
import type { Mode } from '@/lib/design/tokens';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';

export const PHONE_W = 375;
export const PHONE_H = 760;

/** 휴대폰 크기 미리보기. 안쪽에 편집 중인 테마가 입혀진다. */
export function Phone({
  mode,
  label,
  children,
}: {
  mode?: Mode;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="items-center gap-2">
      {label ? <Text className="text-xs font-semibold text-slate-500">{label}</Text> : null}
      <View
        className="overflow-hidden rounded-[40px] border-[6px] border-slate-900 bg-slate-900 shadow-xl"
        style={{ width: PHONE_W + 12, height: PHONE_H + 12 }}>
        <ThemeScope mode={mode} className="flex-1 overflow-hidden rounded-[34px]">
          {children}
        </ThemeScope>
      </View>
    </View>
  );
}

/** 구성요소 번호 표시: 켜면 점선 테두리 + 번호 배지 */
export function Part({
  n,
  show,
  children,
  className,
  inset = -3,
}: {
  n: number;
  show: boolean;
  children: React.ReactNode;
  className?: string;
  inset?: number;
}) {
  return (
    <View className={cn('relative', className)}>
      {children}
      {show ? (
        <>
          <View
            pointerEvents="none"
            className="absolute rounded-md border border-dashed border-pink-500"
            style={{ top: inset, left: inset, right: inset, bottom: inset }}
          />
          <View
            pointerEvents="none"
            className="absolute h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pink-600 px-1"
            style={{ top: inset - 9, left: inset - 9, zIndex: 10 }}>
            <Text className="text-[10px] font-bold text-white" style={{ fontFamily: undefined }}>
              {n}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

export function PartBadge({ n }: { n: number }) {
  return (
    <View className="h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 px-1">
      <Text className="text-[11px] font-bold text-white">{n}</Text>
    </View>
  );
}

export function copyText(text: string) {
  if (Platform.OS === 'web' && navigator.clipboard) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => false
    );
  }
  return Promise.resolve(false);
}

export function downloadText(filename: string, text: string) {
  if (Platform.OS !== 'web') return;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function CodeBlock({
  code,
  filename,
  maxHeight,
  download = true,
}: {
  code: string;
  filename?: string;
  maxHeight?: number;
  download?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  return (
    <View className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <View className="flex-row items-center justify-between border-b border-slate-800 px-4 py-2">
        <Text className="font-mono text-xs text-slate-400">{filename ?? 'code'}</Text>
        <View className="flex-row gap-2">
          {filename && download ? (
            <Pressable onPress={() => downloadText(filename.split('/').pop() ?? filename, code)} className="rounded-md px-2 py-1">
              <Text className="text-xs font-semibold text-slate-300">내려받기</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() =>
              copyText(code).then((ok) => {
                setCopied(ok);
                setTimeout(() => setCopied(false), 1500);
              })
            }
            className="rounded-md bg-slate-800 px-2.5 py-1">
            <Text className="text-xs font-semibold text-white">{copied ? '복사됨' : '복사'}</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView style={maxHeight ? { maxHeight } : undefined}>
        <ScrollView horizontal>
          <Text className="p-4 font-mono text-[12px] leading-5 text-slate-100" selectable>
            {code}
          </Text>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
