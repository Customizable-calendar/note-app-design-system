import { TabBar } from '@/components/app/navigation';
import { ChoiceRow, PanelSection, SwitchRow } from '@/components/ds/controls';
import { Phone, Tablet } from '@/components/ds/frame';
import { ThemeScope } from '@/components/ds/theme-scope';
import { Text } from '@/components/ui/text';
import { useDesign } from '@/lib/design/store';
import type { NavDesign, TabLayout } from '@/lib/design/tokens';
import { cn } from '@/lib/utils';
import { DrawerScreen, TabletHomeScreen } from '@/screens/navigation';
import { HomeScreen } from '@/screens/tabs';
import { MainSection, Sheet, Workspace } from '@/views/workspace';
import * as React from 'react';
import { Pressable, View } from 'react-native';

const LAYOUTS: { value: TabLayout; label: string; tabs: string; good: string; bad: string }[] = [
  {
    value: 'original',
    label: '기존 4칸',
    tabs: '홈 · 세션 · 피드 · 검색',
    good: '처음 목업 그대로. 문서 중심 앱이라는 게 분명함',
    bad: '절충안의 카드가 들어갈 자리가 없음',
  },
  {
    value: 'cards5',
    label: '카드 포함 5칸',
    tabs: '홈 · 카드 · 세션 · 피드 · 검색',
    good: '모든 주요 화면에 한 번에 이동',
    bad: '5칸은 한 칸이 좁고, LNB를 넣으면 세션이 두 군데 생김',
  },
  {
    value: 'lnb4',
    label: '세션을 LNB로',
    tabs: '홈 · 카드 · 피드 · 검색',
    good: '하단은 매일 쓰는 4개만. 세션 목록은 LNB에서 길게 관리',
    bad: '세션으로 가려면 한 번 더 눌러야 함',
  },
];

function NavPanel() {
  const { state, setNav } = useDesign();
  const nav = state.nav;
  const pick =
    <K extends keyof NavDesign>(key: K) =>
    (v: NavDesign[K]) =>
      setNav({ [key]: v } as Partial<NavDesign>);
  return (
    <>
      <PanelSection title="하단 탭 구성" hint="LNB와 역할을 어떻게 나눌지">
        <View className="gap-2">
          {LAYOUTS.map((l) => {
            const on = nav.tabs === l.value;
            return (
              <Pressable
                key={l.value}
                onPress={() => setNav({ tabs: l.value })}
                className={cn('gap-1 rounded-xl border p-3', on ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white')}>
                <View className="flex-row items-center gap-2">
                  <View className={cn('h-4 w-4 items-center justify-center rounded-full border', on ? 'border-slate-900' : 'border-slate-300')}>
                    {on ? <View className="h-2 w-2 rounded-full bg-slate-900" /> : null}
                  </View>
                  <Text className="text-[13px] font-bold text-slate-900">{l.label}</Text>
                </View>
                <Text className="pl-6 text-xs text-slate-600">{l.tabs}</Text>
                <Text className="pl-6 text-[11px] leading-4 text-emerald-700">+ {l.good}</Text>
                <Text className="pl-6 text-[11px] leading-4 text-amber-700">− {l.bad}</Text>
              </Pressable>
            );
          })}
        </View>
      </PanelSection>
      <PanelSection title="LNB">
        <ChoiceRow
          label="여는 방법"
          value={nav.open}
          onChange={pick('open')}
          options={[
            { value: 'avatar', label: '프로필 아이콘' },
            { value: 'edge', label: '왼쪽 끝 밀기' },
            { value: 'both', label: '둘 다' },
          ]}
        />
        <ChoiceRow
          label="선택 표시"
          value={nav.selected}
          onChange={pick('selected')}
          options={[
            { value: 'soft', label: '연한 면' },
            { value: 'bar', label: '왼쪽 막대' },
          ]}
        />
        <ChoiceRow
          label="줄 높이"
          value={nav.density}
          onChange={pick('density')}
          options={[
            { value: 'regular', label: '보통 44' },
            { value: 'compact', label: '촘촘 36' },
          ]}
        />
      </PanelSection>
      <PanelSection title="LNB에 넣을 구역">
        <SwitchRow label="빠른 실행" hint="빠른 입력 · 녹음 · AI에게 묻기" value={nav.showQuick} onChange={pick('showQuick')} />
        <SwitchRow label="카드 종류 바로가기" hint="일정 · 할 일 · 사람 · 아이디어 · 확인 대기" value={nav.showCards} onChange={pick('showCards')} />
        <SwitchRow label="AI 사용량" hint="바닥 고정" value={nav.showUsage} onChange={pick('showUsage')} />
      </PanelSection>
    </>
  );
}

/** 기능마다 어디서 들어가는지: 하단 탭 / LNB / 둘 다 */
function MenuMap() {
  const { state } = useDesign();
  const t = state.nav.tabs;
  const rows: [string, boolean, boolean][] = [
    ['홈', true, false],
    ['오늘 카드', t !== 'original', state.nav.showCards],
    ['세션 목록', t !== 'lnb4', t === 'lnb4'],
    ['피드', true, false],
    ['검색', true, false],
    ['빠른 입력 · 녹음 · AI에게 묻기', false, state.nav.showQuick],
    ['카드 종류별 (일정 · 할 일 …)', false, state.nav.showCards],
    ['사람 목록 · 보관함', false, true],
    ['설정 · 연동 · AI 키', false, true],
  ];
  return (
    <Sheet className="gap-0 p-0">
      <View className="flex-row border-b border-slate-200 px-4 py-2.5">
        <Text className="flex-1 text-xs font-bold text-slate-500">기능</Text>
        <Text className="w-20 text-center text-xs font-bold text-slate-500">하단 탭</Text>
        <Text className="w-20 text-center text-xs font-bold text-slate-500">LNB</Text>
      </View>
      {rows.map(([name, tab, lnb]) => (
        <View key={name} className="flex-row items-center border-b border-slate-100 px-4 py-2.5">
          <Text className="flex-1 text-[13px] text-slate-800">{name}</Text>
          <Text className={cn('w-20 text-center text-sm', tab ? 'text-slate-900' : 'text-slate-300')}>{tab ? '●' : '–'}</Text>
          <Text className={cn('w-20 text-center text-sm', lnb ? 'text-slate-900' : 'text-slate-300')}>{lnb ? '●' : '–'}</Text>
        </View>
      ))}
      <Text className="px-4 py-3 text-[11px] text-slate-500">
        둘 다 ●인 곳은 중복이에요. 카드는 하단 탭(오늘)과 LNB(종류별)로 역할이 달라서 중복이어도 괜찮지만, 세션은 한 곳에만 두는 걸 추천.
      </Text>
    </Sheet>
  );
}

const DECISIONS = [
  ['하단 탭 구성', '3가지 중 하나. 세션을 LNB로 옮기면 4칸'],
  ['LNB 여는 방법', '프로필 아이콘을 둘지, 밀기만 할지. 밀기는 iOS 뒤로가기 제스처와 겹칠 수 있음'],
  ['설정 위치', 'LNB로 옮기면 홈 오른쪽 위 아이콘 자리를 다른 용도로'],
  ['태블릿·웹 지원 시점', '처음엔 휴대폰만, LNB 고정 레이아웃은 나중에 추가해도 컴포넌트는 같음'],
];

export function NavView() {
  return (
    <Workspace panel={<NavPanel />}>
      <MainSection title="휴대폰 · 하단 탭 + LNB 드로어" hint="왼쪽 설정이 바로 반영돼요">
        <View className="flex-row flex-wrap gap-8">
          <Phone label="홈 (LNB 닫힘)">
            <HomeScreen />
          </Phone>
          <Phone label="LNB 열림 · 라이트">
            <DrawerScreen />
          </Phone>
          <Phone mode="dark" label="LNB 열림 · 다크">
            <DrawerScreen />
          </Phone>
        </View>
      </MainSection>
      <MainSection title="하단 탭 3가지 비교">
        <ThemeScope className="gap-3 self-start rounded-2xl border border-slate-200 p-5">
          {LAYOUTS.map((l) => (
            <View key={l.value} className="gap-1.5">
              <Text className="text-xs font-bold text-muted-foreground">{l.label}</Text>
              <View className="w-[375px] overflow-hidden rounded-lg border border-border">
                <TabBar active="home" layout={l.value} />
              </View>
            </View>
          ))}
        </ThemeScope>
      </MainSection>
      <MainSection title="메뉴 지도" hint="지금 고른 구성에서 각 기능이 어디에 있는지">
        <MenuMap />
      </MainSection>
      <MainSection title="태블릿 · 웹" hint="같은 LNB 컴포넌트를 고정 사이드바로. 하단 탭바 대신 LNB 맨 위에 주 메뉴">
        <Tablet>
          <TabletHomeScreen />
        </Tablet>
      </MainSection>
      <MainSection title="회의에서 정할 것">
        <View className="flex-row flex-wrap gap-3">
          {DECISIONS.map(([t, d], i) => (
            <Sheet key={t} className="w-[280px] gap-1.5 p-4">
              <Text className="font-mono text-[11px] text-slate-400">{String(i + 1).padStart(2, '0')}</Text>
              <Text className="text-sm font-bold text-slate-800">{t}</Text>
              <Text className="text-xs leading-5 text-slate-500">{d}</Text>
            </Sheet>
          ))}
        </View>
      </MainSection>
    </Workspace>
  );
}
