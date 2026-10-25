import { COMPONENTS } from '@/catalog/components';
import { PanelSection } from '@/components/ds/controls';
import { Phone, Tablet } from '@/components/ds/frame';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { SCREENS } from '@/screens/registry';
import { MainSection, Sheet, Workspace } from '@/views/workspace';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';

const CHECK_KEY = 'note-app-design-system:checks';

function useChecks() {
  const [checks, setChecks] = React.useState<Record<string, boolean>>({});
  React.useEffect(() => {
    if (Platform.OS !== 'web') return;
    try {
      setChecks(JSON.parse(window.localStorage.getItem(CHECK_KEY) ?? '{}'));
    } catch {
      // 저장소를 못 쓰면 빈 상태로
    }
  }, []);
  const toggle = (key: string) =>
    setChecks((c) => {
      const next = { ...c, [key]: !c[key] };
      try {
        window.localStorage.setItem(CHECK_KEY, JSON.stringify(next));
      } catch {
        // 무시
      }
      return next;
    });
  return { checks, toggle };
}

export function ScreensView({
  selected,
  onSelect,
  onOpenComponent,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onOpenComponent: (id: string) => void;
}) {
  const screen = SCREENS.find((s) => s.id === selected) ?? SCREENS[0];
  const { checks, toggle } = useChecks();

  const panel = (
    <>
      {(['기존 목업', '절충안 (새 화면)', 'LNB · 내비게이션'] as const).map((g) => (
        <PanelSection key={g} title={g}>
          <View className="gap-1">
            {SCREENS.filter((s) => s.group === g).map((s) => {
              const done = s.checks.filter((c) => checks[`${s.id}:${c.title}`]).length;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => onSelect(s.id)}
                  className={cn('flex-row items-center rounded-lg px-3 py-2', s.id === screen.id ? 'bg-slate-900' : 'bg-transparent')}>
                  <Text className={cn('flex-1 text-[13px] font-semibold', s.id === screen.id ? 'text-white' : 'text-slate-700')}>
                    {s.name}
                  </Text>
                  <Text className={cn('font-mono text-[11px]', s.id === screen.id ? 'text-slate-300' : 'text-slate-400')}>
                    {done}/{s.checks.length}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </PanelSection>
      ))}
      <PanelSection title={`${screen.name} · 확인할 디자인 요소`} hint="회의에서 본 항목은 체크 (이 브라우저에만 저장)">
        <View className="gap-3">
          {screen.checks.map((c) => {
            const key = `${screen.id}:${c.title}`;
            const on = !!checks[key];
            return (
              <Pressable key={key} onPress={() => toggle(key)} className="flex-row gap-2.5">
                <View
                  className={cn(
                    'mt-0.5 h-[18px] w-[18px] items-center justify-center rounded border',
                    on ? 'border-slate-900 bg-slate-900' : 'border-slate-300 bg-white'
                  )}>
                  {on ? <Text className="text-[11px] font-bold text-white">✓</Text> : null}
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className={cn('text-[13px] font-bold', on ? 'text-slate-400 line-through' : 'text-slate-800')}>
                    {c.title}
                  </Text>
                  <Text className="text-xs leading-5 text-slate-500">{c.detail}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </PanelSection>
    </>
  );

  const used = COMPONENTS.filter((c) => screen.uses.includes(c.id));

  return (
    <Workspace panel={panel}>
      <MainSection title={screen.name} hint={`${screen.group} · 라이트와 다크를 같이 확인`}>
        {screen.frame === 'tablet' ? (
          <View className="gap-6">
            <Tablet mode="light" label="라이트">
              <screen.Component />
            </Tablet>
            <Tablet mode="dark" label="다크">
              <screen.Component />
            </Tablet>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-8">
            <Phone mode="light" label="라이트">
              <screen.Component />
            </Phone>
            <Phone mode="dark" label="다크">
              <screen.Component />
            </Phone>
          </View>
        )}
      </MainSection>
      <MainSection title="확인 포인트">
        <View className="flex-row flex-wrap gap-3">
          {screen.checks.map((c, i) => (
            <Sheet key={c.title} className="w-[260px] gap-1.5 p-4">
              <Text className="font-mono text-[11px] text-slate-400">{String(i + 1).padStart(2, '0')}</Text>
              <Text className="text-sm font-bold text-slate-800">{c.title}</Text>
              <Text className="text-xs leading-5 text-slate-500">{c.detail}</Text>
            </Sheet>
          ))}
        </View>
      </MainSection>
      <MainSection title="이 화면에 쓰인 컴포넌트" hint="누르면 컴포넌트 탭에서 구성요소를 볼 수 있어요">
        <View className="flex-row flex-wrap gap-2">
          {used.length ? (
            used.map((c) => (
              <Pressable key={c.id} onPress={() => onOpenComponent(c.id)} className="rounded-full border border-slate-300 bg-white px-3 py-1.5">
                <Text className="text-xs font-semibold text-slate-700">{c.name} →</Text>
              </Pressable>
            ))
          ) : (
            <Text className="text-[13px] text-slate-500">이 화면 전용 요소만 있어요 (녹음 파형 등).</Text>
          )}
        </View>
      </MainSection>
    </Workspace>
  );
}
