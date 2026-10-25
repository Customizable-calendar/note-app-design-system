import { SCENARIOS } from '@/catalog/scenarios';
import { PanelSection, SwitchRow } from '@/components/ds/controls';
import { PHONE_H, PHONE_W } from '@/components/ds/frame';
import { ThemeScope } from '@/components/ds/theme-scope';
import { Text } from '@/components/ui/text';
import { useDesign } from '@/lib/design/store';
import { cn } from '@/lib/utils';
import { SCREENS } from '@/screens/registry';
import { MainSection, Sheet, Workspace } from '@/views/workspace';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const SCALE = 0.62;

/** 단계별로 여러 화면을 한 줄에 보여주려고 줄인 휴대폰 */
function MiniPhone({ children }: { children: React.ReactNode }) {
  const w = (PHONE_W + 12) * SCALE;
  const h = (PHONE_H + 12) * SCALE;
  return (
    <View style={{ width: w, height: h }}>
      <View
        className="absolute left-0 top-0 overflow-hidden rounded-[40px] border-[6px] border-slate-900 bg-slate-900 shadow-lg"
        style={{
          width: PHONE_W + 12,
          height: PHONE_H + 12,
          transform: [{ scale: SCALE }],
          transformOrigin: 'top left',
        }}>
        <ThemeScope className="flex-1 overflow-hidden rounded-[34px]">{children}</ThemeScope>
      </View>
    </View>
  );
}

export function ScenariosView({
  selected,
  onSelect,
  onOpenScreen,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onOpenScreen: (id: string) => void;
}) {
  const { state, set } = useDesign();
  const sc = SCENARIOS.find((s) => s.id === selected) ?? SCENARIOS[0];

  const panel = (
    <>
      <PanelSection title="사용 시나리오" hint="상황별로 어떤 화면을 어떤 순서로 지나가는지">
        <View className="gap-1">
          {SCENARIOS.map((s, i) => (
            <Pressable
              key={s.id}
              onPress={() => onSelect(s.id)}
              className={cn('gap-0.5 rounded-lg px-3 py-2.5', s.id === sc.id ? 'bg-slate-900' : 'bg-transparent')}>
              <Text className={cn('text-[13px] font-semibold', s.id === sc.id ? 'text-white' : 'text-slate-800')}>
                {i + 1}. {s.name}
              </Text>
              <Text className={cn('text-[11px]', s.id === sc.id ? 'text-slate-300' : 'text-slate-500')}>
                화면 {s.steps.length}개
              </Text>
            </Pressable>
          ))}
        </View>
      </PanelSection>
      <PanelSection title="표시">
        <SwitchRow
          label="다크 모드로 보기"
          value={state.mode === 'dark'}
          onChange={(v) => set({ mode: v ? 'dark' : 'light' })}
        />
      </PanelSection>
      <PanelSection title="이 시나리오에서 같이 정할 것">
        {sc.checks.map((c) => (
          <View key={c} className="flex-row gap-2">
            <Text className="text-xs text-slate-400">•</Text>
            <Text className="flex-1 text-[13px] leading-5 text-slate-700">{c}</Text>
          </View>
        ))}
      </PanelSection>
    </>
  );

  return (
    <Workspace panel={panel}>
      <View className="gap-3">
        <Text className="text-2xl font-bold text-slate-900">{sc.name}</Text>
        <View className="flex-row flex-wrap gap-3">
          {[
            ['언제', sc.when],
            ['누가', sc.who],
            ['목표', sc.goal],
          ].map(([k, v]) => (
            <Sheet key={k} className="min-w-[240px] flex-1 gap-1 p-4">
              <Text className="text-[11px] font-bold text-slate-400">{k}</Text>
              <Text className="text-[13px] leading-5 text-slate-800">{v}</Text>
            </Sheet>
          ))}
        </View>
      </View>

      <MainSection title="흐름" hint="휴대폰을 누르면 5번 탭에서 그 화면을 크게 볼 수 있어요">
        <ScrollView horizontal contentContainerClassName="gap-4 pb-2">
          {sc.steps.map((st, i) => {
            const screen = SCREENS.find((s) => s.id === st.screen);
            if (!screen) return null;
            return (
              <View key={`${st.screen}-${i}`} className="flex-row items-start gap-4">
                <View className="w-[240px] gap-3">
                  <Pressable onPress={() => onOpenScreen(screen.id)}>
                    <MiniPhone>
                      <screen.Component />
                    </MiniPhone>
                  </Pressable>
                  <View className="gap-1.5">
                    <View className="flex-row items-center gap-2">
                      <View className="h-6 w-6 items-center justify-center rounded-full bg-slate-900">
                        <Text className="text-xs font-bold text-white">{i + 1}</Text>
                      </View>
                      <Text className="flex-1 text-sm font-bold text-slate-900">{st.title}</Text>
                    </View>
                    <Text className="text-[11px] text-slate-400">화면: {screen.name}</Text>
                    <Text className="text-[13px] leading-5 text-slate-700">{st.action}</Text>
                    <View className="mt-1 rounded-lg bg-pink-50 px-2.5 py-2">
                      <Text className="text-[11px] font-bold text-pink-700">디자인 확인</Text>
                      <Text className="text-xs leading-5 text-pink-900">{st.design}</Text>
                    </View>
                  </View>
                </View>
                {i < sc.steps.length - 1 ? (
                  <Text className="mt-[220px] text-xl text-slate-300">→</Text>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      </MainSection>
    </Workspace>
  );
}
