import { ShellButton } from '@/components/ds/controls';
import { copyText } from '@/components/ds/frame';
import { Text } from '@/components/ui/text';
import { FontContext } from '@/lib/font';
import { useDesign } from '@/lib/design/store';
import { cn } from '@/lib/utils';
import { ChatView } from '@/views/chat-view';
import { ComponentsView } from '@/views/components-view';
import { ExportView } from '@/views/export-view';
import { ScenariosView } from '@/views/scenarios-view';
import { ScreensView } from '@/views/screens-view';
import { ThemeView } from '@/views/theme-view';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type Tab = 'theme' | 'components' | 'chat' | 'screens' | 'scenarios' | 'export';

const TABS: { key: Tab; label: string }[] = [
  { key: 'theme', label: '1. 테마 색' },
  { key: 'components', label: '2. 컴포넌트' },
  { key: 'chat', label: '3. AI 채팅' },
  { key: 'screens', label: '4. 화면별 확인' },
  { key: 'scenarios', label: '5. 사용 시나리오' },
  { key: 'export', label: '6. 코드 내보내기' },
];

export default function DesignSystemPage() {
  const { state, set, reset, shareUrl } = useDesign();
  // ?tab=chat 처럼 링크로 특정 탭을 바로 열 수 있게
  const params = useLocalSearchParams<{ tab?: string; c?: string; screen?: string; sc?: string }>();
  const tab: Tab = TABS.some((t) => t.key === params.tab) ? (params.tab as Tab) : 'theme';
  const setTab = (t: Tab) => router.setParams({ tab: t });
  const componentId = params.c ?? 'button';
  const screenId = params.screen ?? 'home';
  const setComponentId = (c: string) => router.setParams({ c });
  const setScreenId = (screen: string) => router.setParams({ screen });
  const [notice, setNotice] = React.useState<string | null>(null);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2200);
  };

  return (
    <FontContext.Provider value="Pretendard">
      <Stack.Screen options={{ headerShown: false, title: '노트 앱 디자인 시스템' }} />
      <View className="flex-1 bg-white">
        <View className="flex-row flex-wrap items-center gap-x-6 gap-y-3 border-b border-slate-200 px-6 py-3.5">
          <View className="gap-0.5">
            <Text className="text-[17px] font-bold text-slate-900">노트 앱 디자인 시스템</Text>
            <Text className="text-xs text-slate-500">
              오르카짱 회의용 · 확정안 아님 · Expo + NativeWind + react-native-reusables
            </Text>
          </View>
          <View className="flex-1" />
          <View className="flex-row rounded-lg bg-slate-100 p-1">
            {(['light', 'dark'] as const).map((m) => (
              <Pressable
                key={m}
                onPress={() => set({ mode: m })}
                className={cn('rounded-md px-3 py-1.5', state.mode === m && 'bg-white shadow-sm')}>
                <Text className={cn('text-xs', state.mode === m ? 'font-bold text-slate-900' : 'text-slate-500')}>
                  {m === 'light' ? '라이트' : '다크'}
                </Text>
              </Pressable>
            ))}
          </View>
          <ShellButton
            label="처음 값으로"
            onPress={() => {
              reset();
              flash('목업 기본값으로 되돌렸어요');
            }}
          />
          <ShellButton
            label="이 설정 링크 복사"
            tone="dark"
            onPress={() => {
              const url = shareUrl();
              if (!url) return;
              copyText(url).then((ok) => flash(ok ? '링크를 복사했어요. 팀원에게 보내면 같은 설정으로 열려요.' : url));
            }}
          />
        </View>
        <ScrollView horizontal className="max-h-[52px] flex-none border-b border-slate-200" contentContainerClassName="gap-1 px-4">
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              className={cn('justify-center border-b-2 px-3.5 py-3', tab === t.key ? 'border-slate-900' : 'border-transparent')}>
              <Text className={cn('text-sm', tab === t.key ? 'font-bold text-slate-900' : 'font-medium text-slate-500')}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View className="flex-1">
          {tab === 'theme' ? <ThemeView /> : null}
          {tab === 'components' ? (
            <ComponentsView
              selected={componentId}
              onSelect={setComponentId}
              onOpenScreen={(id) => router.setParams({ tab: 'screens', screen: id })}
            />
          ) : null}
          {tab === 'chat' ? <ChatView /> : null}
          {tab === 'screens' ? (
            <ScreensView
              selected={screenId}
              onSelect={setScreenId}
              onOpenComponent={(id) => router.setParams({ tab: 'components', c: id })}
            />
          ) : null}
          {tab === 'scenarios' ? (
            <ScenariosView
              selected={params.sc ?? 'capture'}
              onSelect={(sc) => router.setParams({ sc })}
              onOpenScreen={(id) => router.setParams({ tab: 'screens', screen: id })}
            />
          ) : null}
          {tab === 'export' ? <ExportView /> : null}
        </View>
        {notice ? (
          <View pointerEvents="none" className="absolute bottom-6 left-0 right-0 items-center">
            <View className="max-w-[560px] rounded-xl bg-slate-900 px-4 py-3 shadow-lg">
              <Text className="text-[13px] text-white">{notice}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </FontContext.Provider>
  );
}
