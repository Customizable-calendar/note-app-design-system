import { SyncBanner } from '@/components/app/calendar';
import { ChoiceRow, ColorField, PanelSection, SwitchRow } from '@/components/ds/controls';
import { Phone } from '@/components/ds/frame';
import { ThemeScope } from '@/components/ds/theme-scope';
import { Text } from '@/components/ui/text';
import { contrast, contrastGrade } from '@/lib/design/color';
import { useDesign } from '@/lib/design/store';
import { buildTokens, type CalendarDesign } from '@/lib/design/tokens';
import { cn } from '@/lib/utils';
import { CalendarScreen, CheckInScreen, ReviewScreen, SlotScreen } from '@/screens/calendar';
import { MainSection, Sheet, Workspace } from '@/views/workspace';
import * as React from 'react';
import { View } from 'react-native';

const ACCOUNT_SWATCHES = ['#245ab8', '#a3366b', '#0f8a7e', '#7a4fc0', '#c27c0e', '#4b5563'];

function CalendarPanel() {
  const { state, setCalendar } = useDesign();
  const cal = state.calendar;
  const pick =
    <K extends keyof CalendarDesign>(key: K) =>
    (v: CalendarDesign[K]) =>
      setCalendar({ [key]: v } as Partial<CalendarDesign>);
  const setAccount = (i: 0 | 1) => (hex: string) => {
    const next: [string, string] = [...cal.accounts];
    next[i] = hex;
    setCalendar({ accounts: next });
  };
  const t = buildTokens(state, state.mode);
  const pairs: [string, string, string][] = [
    ['계정 1 글자 / 면', t['cal-1'], t['cal-1-soft']],
    ['계정 2 글자 / 면', t['cal-2'], t['cal-2-soft']],
  ];
  return (
    <>
      <PanelSection title="계정 색" hint="실제 앱에서는 연결한 계정마다 고르게 할 수도 있어요. 카드 4종 색 · 메인 색과 겹치지 않게">
        <ColorField label="계정 1 (예: 회사 Google)" value={cal.accounts[0]} onChange={setAccount(0)} swatches={ACCOUNT_SWATCHES} />
        <ColorField label="계정 2 (예: 개인 Google)" value={cal.accounts[1]} onChange={setAccount(1)} swatches={ACCOUNT_SWATCHES} />
        <View className="gap-1">
          {pairs.map(([label, fg, bg]) => {
            const ratio = contrast(fg, bg);
            return (
              <View key={label} className="flex-row items-center justify-between">
                <Text className="text-xs text-slate-600">{label}</Text>
                <Text className={cn('font-mono text-xs', ratio >= 4.5 ? 'text-emerald-700' : 'text-amber-700')}>
                  {ratio.toFixed(1)} · {contrastGrade(ratio)}
                </Text>
              </View>
            );
          })}
        </View>
      </PanelSection>
      <PanelSection title="캘린더 화면">
        <ChoiceRow
          label="일정 블록"
          value={cal.eventStyle}
          onChange={pick('eventStyle')}
          options={[
            { value: 'bar', label: '왼쪽 막대 + 연한 면' },
            { value: 'fill', label: '진한 면 채움' },
          ]}
        />
        <ChoiceRow
          label="AI 후보 일정"
          value={cal.suggestion}
          onChange={pick('suggestion')}
          options={[
            { value: 'dashed', label: '점선' },
            { value: 'soft', label: '연한 면' },
          ]}
        />
        <ChoiceRow
          label="1시간 높이"
          value={cal.density}
          onChange={pick('density')}
          options={[
            { value: 'regular', label: '보통 (64)' },
            { value: 'compact', label: '촘촘 (44)' },
          ]}
        />
      </PanelSection>
      <PanelSection title="시간 잡기">
        <ChoiceRow
          label="잘 맞는 정도"
          value={cal.fitLabel}
          onChange={pick('fitLabel')}
          options={[
            { value: 'word', label: '글자' },
            { value: 'score', label: '점수' },
            { value: 'none', label: '표시 안 함' },
          ]}
        />
        <SwitchRow label="이유 문장" hint="후보마다 왜 이 시간인지" value={cal.showReasons} onChange={pick('showReasons')} />
      </PanelSection>
      <PanelSection title="수행 확인">
        <ChoiceRow
          label="버튼 모양"
          value={cal.statusStyle}
          onChange={pick('statusStyle')}
          options={[
            { value: 'segment', label: '4칸 나눔' },
            { value: 'chip', label: '칩' },
          ]}
        />
      </PanelSection>
    </>
  );
}

const FEATURES: { name: string; what: string; where: string; when: '먼저' | '다음' }[] = [
  { name: '캘린더 연결', what: 'Google 계정 연결, 일 · 주 · 목록 보기, 계정별 색과 동기화 상태', where: '홈 오늘 일정, 캘린더 화면', when: '먼저' },
  { name: '시간 잡기', what: '충돌 없는 후보 3개와 이유. 골라야 저장하고, 저장 직전에 다시 확인', where: '일정 · 할 일 카드', when: '먼저' },
  { name: '수행 확인', what: '완료 · 부분 · 못 함 · 모름. 하루 최대 2번', where: '저녁 시트 → 업무일지 초안', when: '먼저' },
  { name: '주간 회고', what: '계획 대비 실제 시간, 밀린 일, 다음 주 제안', where: '주간 회고 템플릿', when: '다음' },
  { name: '시간 예산', what: '남은 시간보다 많이 넣으면 미리 알림', where: '시간 잡기 화면', when: '다음' },
];

const ELEMENTS = [
  ['계정 칩', 'AccountChip · bg-cal-N-soft · 눌러서 숨기기'],
  ['일정 블록', 'EventBlock · 막대(border-l-cal-N) / 채움(bg-cal-N)'],
  ['AI 후보 블록', 'EventBlock(account 없음) · ai 색 + 점선/연한 면'],
  ['날짜 줄', 'WeekStrip · 선택 bg-primary · 점 = 계정'],
  ['동기화 상태', 'SyncBanner · ok / syncing / pending / partial / reauth'],
  ['시간 후보', 'SlotOption · 라디오 · 잘 맞는 정도 · 이유'],
  ['수행 확인', 'StatusPicker · CheckItem(부분·못 함이면 한 번 더 묻기)'],
  ['회고 숫자', 'StatTile · CompletionBar(버튼과 같은 색 규칙)'],
];

export function CalendarView() {
  return (
    <Workspace panel={<CalendarPanel />}>
      <Sheet className="gap-2">
        <Text className="text-sm font-bold text-slate-800">캘린더 아이디어 채택안</Text>
        <Text className="text-[13px] leading-6 text-slate-600">
          팀원의 AI 캘린더 기획에서 사용성만 가져온 화면이에요. 여러 Google 계정 일정을 한 화면에 모으고, 할 일 카드에 맞는 시간을 AI가 후보로 주고,
          저녁에 한 일을 체크하면 업무일지 초안과 주간 회고로 이어져요. AI는 제안만 하고 사람이 고른 것만 저장해요.
        </Text>
      </Sheet>
      <MainSection title="기능 화면 4개" hint="캘린더 → 시간 잡기 → 수행 확인 → 주간 회고. 화면 안의 버튼 · 칩은 눌러 볼 수 있어요">
        <View className="flex-row flex-wrap gap-8">
          <Phone label="캘린더 (일 · 주 · 목록)">
            <CalendarScreen />
          </Phone>
          <Phone label="시간 잡기">
            <SlotScreen />
          </Phone>
          <Phone label="수행 확인 시트">
            <CheckInScreen />
          </Phone>
          <Phone label="주간 회고">
            <ReviewScreen />
          </Phone>
        </View>
      </MainSection>
      <MainSection title="기능별로 하는 일" hint="먼저 = 처음 들일 것 · 다음 = 기록이 쌓인 뒤">
        <Sheet className="gap-0 p-0">
          {FEATURES.map((f, i) => (
            <View key={f.name} className={cn('flex-row flex-wrap gap-x-4 gap-y-1 px-5 py-3.5', i > 0 && 'border-t border-slate-100')}>
              <Text className="w-24 text-sm font-bold text-slate-900">{f.name}</Text>
              <Text className="min-w-[240px] flex-1 text-[13px] leading-5 text-slate-700">{f.what}</Text>
              <Text className="w-44 text-[13px] leading-5 text-slate-500">{f.where}</Text>
              <View className={cn('self-start rounded-full px-2.5 py-0.5', f.when === '먼저' ? 'bg-emerald-100' : 'bg-slate-100')}>
                <Text className={cn('text-[11px] font-bold', f.when === '먼저' ? 'text-emerald-800' : 'text-slate-600')}>{f.when}</Text>
              </View>
            </View>
          ))}
        </Sheet>
        <View className="flex-row flex-wrap gap-4">
          <Sheet className="min-w-[280px] flex-1 gap-1.5">
            <Text className="text-[13px] font-bold text-slate-800">지금은 빼는 것</Text>
            <Text className="text-[13px] leading-5 text-slate-600">
              Outlook · Apple 연동, 캘린더 간 복사, 성공 확률 표시(검증 전), 팀원끼리 시간 맞추기
            </Text>
          </Sheet>
          <Sheet className="min-w-[280px] flex-1 gap-1.5">
            <Text className="text-[13px] font-bold text-slate-800">회의에서 정할 것</Text>
            <Text className="text-[13px] leading-5 text-slate-600">
              하단 탭에 캘린더를 넣을지(3번 탭 "캘린더 포함 5칸"), 잘 맞는 정도 표시 방식, AI 키 위치(기기 vs 서버)
            </Text>
          </Sheet>
        </View>
      </MainSection>
      <MainSection title="동기화 상태" hint="외부 캘린더는 늦게 반영되거나 실패할 수 있어서 상태를 숨기지 않아요">
        <View className="flex-row flex-wrap gap-6">
          {(['light', 'dark'] as const).map((m) => (
            <ThemeScope key={m} mode={m} className="w-[360px] gap-2 rounded-2xl border border-slate-200 p-5">
              <Text className="text-xs font-bold text-muted-foreground">{m === 'light' ? '라이트' : '다크'}</Text>
              <SyncBanner state="ok" />
              <SyncBanner state="syncing" />
              <SyncBanner state="pending" />
              <SyncBanner state="partial" />
              <SyncBanner state="reauth" />
            </ThemeScope>
          ))}
        </View>
      </MainSection>
      <MainSection title="캘린더 구성요소">
        <Sheet className="gap-2.5">
          {ELEMENTS.map(([n, d], i) => (
            <View key={n} className="flex-row gap-3">
              <Text className="w-5 text-right font-mono text-xs text-slate-400">{i + 1}</Text>
              <Text className="w-28 text-sm font-bold text-slate-800">{n}</Text>
              <Text className="flex-1 font-mono text-xs leading-5 text-slate-600">{d}</Text>
            </View>
          ))}
          <Text className="mt-2 text-xs text-slate-500">
            코드: components/app/calendar.tsx · 설정값은 lib/theme.ts 의 CALENDAR_DESIGN, 계정 색은 global.css 의 --cal-1 · --cal-2 로 내보내져요.
          </Text>
        </Sheet>
      </MainSection>
    </Workspace>
  );
}
