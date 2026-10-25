import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

export const WIDE = 1000;

/** 왼쪽 편집 패널 + 오른쪽 미리보기. 좁은 화면에서는 위아래로 쌓는다. */
export function Workspace({ panel, children }: { panel: React.ReactNode; children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const wide = width >= WIDE;
  if (!wide) {
    return (
      <ScrollView className="flex-1 bg-slate-100">
        <View className="border-b border-slate-200 bg-white">{panel}</View>
        <View className="gap-8 p-4">{children}</View>
      </ScrollView>
    );
  }
  return (
    <View className="flex-1 flex-row">
      <ScrollView className="w-[380px] flex-none border-r border-slate-200 bg-white" contentContainerClassName="pb-16">
        {panel}
      </ScrollView>
      <ScrollView className="flex-1 bg-slate-100" contentContainerClassName="gap-8 p-8 pb-24">
        {children}
      </ScrollView>
    </View>
  );
}

export function MainSection({
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
    <View className="gap-4">
      <View className="flex-row flex-wrap items-end justify-between gap-2">
        <View className="gap-1">
          <Text className="text-lg font-bold text-slate-900">{title}</Text>
          {hint ? <Text className="text-[13px] leading-5 text-slate-500">{hint}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

export function Sheet({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={`rounded-2xl border border-slate-200 bg-white p-5 ${className ?? ''}`}>{children}</View>
  );
}
