import { COMPONENTS } from '@/catalog/components';
import { PanelSection, SwitchRow } from '@/components/ds/controls';
import { CodeBlock, PartBadge } from '@/components/ds/frame';
import { ThemeScope } from '@/components/ds/theme-scope';
import { Text } from '@/components/ui/text';
import { useDesign } from '@/lib/design/store';
import { cn } from '@/lib/utils';
import { SCREENS } from '@/screens/registry';
import { MainSection, Sheet, Workspace } from '@/views/workspace';
import * as React from 'react';
import { Pressable, View } from 'react-native';

export function ComponentsView({
  selected,
  onSelect,
  onOpenScreen,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onOpenScreen: (id: string) => void;
}) {
  const { state, set } = useDesign();
  const [anatomy, setAnatomy] = React.useState(true);
  const spec = COMPONENTS.find((c) => c.id === selected) ?? COMPONENTS[0];
  const usedIn = SCREENS.filter((s) => s.uses.includes(spec.id));

  const panel = (
    <>
      <PanelSection title="표시">
        <SwitchRow label="구성요소 번호 보기" hint="분홍 점선 = 구성요소" value={anatomy} onChange={setAnatomy} />
        <SwitchRow
          label="다크 모드로 보기"
          value={state.mode === 'dark'}
          onChange={(v) => set({ mode: v ? 'dark' : 'light' })}
        />
      </PanelSection>
      {(['reusables', '앱 전용', '캘린더'] as const).map((src) => (
        <PanelSection
          key={src}
          title={src === 'reusables' ? 'react-native-reusables' : src === '캘린더' ? '캘린더 컴포넌트' : '앱 전용 컴포넌트'}
          hint={
            src === 'reusables'
              ? 'components/ui · 라이브러리 코드를 복사해서 토큰만 입힌 것'
              : src === '캘린더'
                ? 'components/app/calendar.tsx · 캘린더 아이디어 채택안 (4번 탭에서 설정)'
                : 'components/app · 우리 앱 화면에서 뽑아낸 조합 컴포넌트'
          }>
          <View className="gap-1">
            {COMPONENTS.filter((c) => c.source === src).map((c) => (
              <Pressable
                key={c.id}
                onPress={() => onSelect(c.id)}
                className={cn('rounded-lg px-3 py-2', c.id === spec.id ? 'bg-slate-900' : 'bg-transparent')}>
                <Text className={cn('text-[13px] font-semibold', c.id === spec.id ? 'text-white' : 'text-slate-700')}>
                  {c.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </PanelSection>
      ))}
    </>
  );

  return (
    <Workspace panel={panel}>
      <View className="gap-2">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-2xl font-bold text-slate-900">{spec.name}</Text>
          <View className={cn('rounded-full px-2.5 py-1', spec.source === 'reusables' ? 'bg-sky-100' : spec.source === '캘린더' ? 'bg-amber-100' : 'bg-violet-100')}>
            <Text className={cn('text-[11px] font-bold', spec.source === 'reusables' ? 'text-sky-800' : spec.source === '캘린더' ? 'text-amber-800' : 'text-violet-800')}>
              {spec.source}
            </Text>
          </View>
          <Text className="font-mono text-xs text-slate-500">{spec.file}</Text>
        </View>
        <Text className="text-sm leading-6 text-slate-600">{spec.desc}</Text>
      </View>

      <MainSection title="구성요소">
        <View className="flex-row flex-wrap gap-6">
          <ThemeScope className="min-h-[260px] min-w-[480px] flex-1 items-center justify-center rounded-2xl border border-slate-200 p-16">
            {/* 구성요소가 잘 보이도록 1.4배 확대 */}
            <View style={{ transform: [{ scale: spec.anatomyScale ?? 1.4 }] }}>
              <spec.Anatomy show={anatomy} />
            </View>
          </ThemeScope>
          <Sheet className="min-w-[320px] flex-1 gap-3">
            {spec.parts.map((p, i) => (
              <View key={p.name} className="flex-row gap-3">
                <PartBadge n={i + 1} />
                <View className="flex-1 gap-0.5">
                  <Text className="text-sm font-bold text-slate-800">{p.name}</Text>
                  <Text className="font-mono text-xs leading-5 text-slate-600">{p.cls}</Text>
                  {p.note ? <Text className="text-xs text-slate-500">{p.note}</Text> : null}
                </View>
              </View>
            ))}
          </Sheet>
        </View>
      </MainSection>

      <MainSection title="종류 · 상태">
        <ThemeScope className="rounded-2xl border border-slate-200 p-8">
          <spec.Variants />
        </ThemeScope>
      </MainSection>

      <MainSection title="쓰이는 화면">
        <View className="flex-row flex-wrap gap-2">
          {usedIn.length ? (
            usedIn.map((s) => (
              <Pressable key={s.id} onPress={() => onOpenScreen(s.id)} className="rounded-full border border-slate-300 bg-white px-3 py-1.5">
                <Text className="text-xs font-semibold text-slate-700">{s.name} →</Text>
              </Pressable>
            ))
          ) : (
            <Text className="text-[13px] text-slate-500">아직 연결된 화면이 없어요.</Text>
          )}
        </View>
      </MainSection>

      <MainSection title="코드">
        <CodeBlock code={spec.code} filename={spec.file} download={false} />
      </MainSection>
    </Workspace>
  );
}
