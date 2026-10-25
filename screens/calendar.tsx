import {
  AccountChip,
  AccountDot,
  CheckItem,
  CompletionBar,
  DayTimeline,
  SlotOption,
  StatTile,
  SyncBanner,
  useHourHeight,
  WeekStrip,
  type Account,
  type TimelineEvent,
  type WeekDay,
} from '@/components/app/calendar';
import { ExtractedCard, SectionLabel } from '@/components/app/cards';
import { SegmentTabs, TabBar, TopBar } from '@/components/app/navigation';
import { BottomSheet, Scrim } from '@/components/app/overlays';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, SparklesIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const WEEK: WeekDay[] = [
  { label: '월', date: 19, accounts: [1] },
  { label: '화', date: 20, accounts: [1, 2] },
  { label: '수', date: 21, accounts: [1] },
  { label: '목', date: 22, accounts: [1, 2] },
  { label: '금', date: 23, accounts: [1] },
  { label: '토', date: 24, accounts: [2] },
  { label: '일', date: 25 },
];

const TODAY: TimelineEvent[] = [
  { account: 1, title: '주간 회의', meta: '09:00–10:00 · 회사', start: 9, end: 10 },
  { title: '제안서 초안 · 후보', meta: '10:00–12:00 · 아직 저장 안 됨', start: 10, end: 12 },
  { account: 2, title: '점심 · 민수', meta: '12:00–13:00 · 개인', start: 12, end: 13 },
  { account: 1, title: '디자인 리뷰', meta: '14:00–15:00 · 회사', start: 14, end: 15 },
];

// 주 보기용: [요일 칸, 시작, 끝, 계정(없으면 후보)]
const WEEK_BLOCKS: [number, number, number, Account | null][] = [
  [0, 9, 10, 1],
  [1, 9, 10, 1],
  [1, 12, 13, 2],
  [2, 13, 15, 1],
  [3, 9, 10, 1],
  [3, 10, 12, null],
  [3, 12, 13, 2],
  [3, 14, 15, 1],
  [4, 9, 10, 1],
  [5, 11, 13, 2],
];

function WeekGrid() {
  const h = useHourHeight() * 0.7;
  const from = 9;
  const to = 16;
  return (
    <View className="flex-row" style={{ height: (to - from) * h }}>
      <View className="w-8">
        {Array.from({ length: to - from }, (_, i) => (
          <Text key={i} className="text-[10px] text-muted-foreground" style={{ height: h }}>
            {from + i}
          </Text>
        ))}
      </View>
      {WEEK.map((d, col) => (
        <View key={d.date} className={cn('relative flex-1 border-l border-border', col === 3 && 'bg-primary-soft/30')}>
          {WEEK_BLOCKS.filter((b) => b[0] === col).map(([, s, e, a]) => (
            <View
              key={`${s}-${e}`}
              className={cn(
                'absolute left-0.5 right-0.5 rounded-sm',
                a === 1 && 'bg-cal-1',
                a === 2 && 'bg-cal-2',
                a === null && 'border border-dashed border-ai bg-ai-soft'
              )}
              style={{ top: (s - from) * h + 1, height: (e - s) * h - 2 }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function ListView() {
  return (
    <View className="gap-4">
      {[
        ['오늘 · 목 22일', TODAY],
        [
          '내일 · 금 23일',
          [{ account: 1 as Account, title: '스프린트 회고', meta: '09:00–10:00 · 회사', start: 9, end: 10 }],
        ],
      ].map(([day, list]) => (
        <View key={day as string} className="gap-2">
          <Text className="text-xs font-bold text-muted-foreground">{day as string}</Text>
          {(list as TimelineEvent[]).map((e) => (
            <View key={e.title} className="flex-row items-center gap-3 border-b border-border pb-2.5">
              {e.account ? <AccountDot account={e.account} /> : <Icon as={SparklesIcon} size={10} className="text-ai" />}
              <View className="flex-1">
                <Text className={cn('text-[15px] font-semibold', e.account ? 'text-foreground' : 'text-ai')}>{e.title}</Text>
                <Text className="text-xs text-muted-foreground">{e.meta}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export function CalendarScreen() {
  const [view, setView] = React.useState('일');
  const [day, setDay] = React.useState(3);
  const [hidden, setHidden] = React.useState<Account[]>([]);
  const toggle = (a: Account) => setHidden((h) => (h.includes(a) ? h.filter((x) => x !== a) : [...h, a]));
  const events = TODAY.filter((e) => !e.account || !hidden.includes(e.account));
  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="gap-3 px-5 pb-6 pt-7">
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-sm text-muted-foreground">2026년 10월</Text>
            <Text className="text-[26px] font-bold tracking-tight text-foreground">
              {view === '주' ? '10월 4주' : `${WEEK[day].label}요일 ${WEEK[day].date}일`}
            </Text>
          </View>
          <Button size="sm" variant="outline" onPress={() => setDay(3)}>
            <Text>오늘</Text>
          </Button>
        </View>
        <SegmentTabs items={['일', '주', '목록']} active={view} onChange={setView} />
        {view === '일' ? <WeekStrip days={WEEK} selected={day} onSelect={setDay} /> : null}
        <View className="flex-row flex-wrap gap-1.5">
          <AccountChip account={1} label="회사 Google" off={hidden.includes(1)} onPress={() => toggle(1)} />
          <AccountChip account={2} label="개인 Google" off={hidden.includes(2)} onPress={() => toggle(2)} />
          <View className="rounded-full border border-dashed border-input px-2.5 py-1">
            <Text className="text-xs text-muted-foreground">+ 연결</Text>
          </View>
        </View>
        <SyncBanner state="reauth" text="회사 계정 다시 로그인 필요 · 개인은 2분 전 동기화" />
        <View className="mt-2">
          {view === '일' ? <DayTimeline from={9} to={15} events={events} /> : null}
          {view === '주' ? <WeekGrid /> : null}
          {view === '목록' ? <ListView /> : null}
        </View>
      </ScrollView>
      <TabBar active="calendar" />
    </View>
  );
}

const SLOTS = [
  {
    time: '목 10:00 – 12:00',
    fit: 'good' as const,
    score: 86,
    reason: '회의 사이 빈 시간 · 오전 집중 작업은 지난 4주 8번 중 6번 완료',
  },
  { time: '목 15:15 – 17:15', fit: 'ok' as const, score: 64, reason: '디자인 리뷰 뒤 15분 여유 포함' },
  { time: '금 09:00 – 11:00', fit: 'tight' as const, score: 41, reason: '마감 당일이라 밀리면 다시 잡을 시간이 없어요' },
];

export function SlotScreen() {
  const [picked, setPicked] = React.useState(0);
  return (
    <View className="flex-1">
      <TopBar title="시간 잡기" />
      <ScrollView contentContainerClassName="gap-3.5 px-5 pb-8 pt-5">
        <ExtractedCard type="task" title="제안서 초안 작성" meta="2시간 · 금요일까지 · 오전 선호" state="confirmed" />
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <Icon as={SparklesIcon} size={14} className="text-ai" />
            <Text className="text-[13px] font-bold text-ai">충돌 없는 후보 3개</Text>
          </View>
          <Text className="text-xs text-muted-foreground">15분 단위</Text>
        </View>
        {SLOTS.map((s, i) => (
          <SlotOption key={s.time} {...s} selected={picked === i} onPress={() => setPicked(i)} />
        ))}
        <View className="flex-row items-center justify-between border-t border-border pt-3">
          <Text className="text-[13px] text-muted-foreground">저장할 캘린더</Text>
          <View className="flex-row items-center gap-1.5">
            <AccountDot account={1} />
            <Text className="text-[13px] font-bold text-foreground">회사 Google</Text>
            <Icon as={ChevronDownIcon} size={14} className="text-foreground" />
          </View>
        </View>
        <View className="flex-row gap-2">
          <Button variant="outline" className="h-11 flex-1">
            <Text>1시간씩 나눠 잡기</Text>
          </Button>
          <Button variant="outline" className="h-11 flex-1">
            <Text>다른 후보</Text>
          </Button>
        </View>
        <Button size="lg" className="h-12 rounded-lg">
          <Text className="text-[15px] font-bold">이 시간으로 저장</Text>
        </Button>
        <Text className="text-center text-xs text-muted-foreground">저장 직전에 충돌을 한 번 더 확인해요</Text>
      </ScrollView>
    </View>
  );
}

export function CheckInScreen() {
  return (
    <View className="flex-1">
      <View className="gap-3 px-5 pt-8 opacity-50">
        <Text className="text-sm text-muted-foreground">목요일</Text>
        <Text className="text-[28px] font-bold text-foreground">10월 22일</Text>
        <View className="h-24 rounded-xl bg-primary-soft" />
        <View className="h-14 rounded-lg bg-muted" />
      </View>
      <Scrim />
      <View className="absolute bottom-0 left-0 right-0">
        <BottomSheet>
          <View className="gap-0.5">
            <Text className="text-xs text-muted-foreground">저녁 9:00 · 오늘 두 번째 확인</Text>
            <Text className="text-xl font-bold text-popover-foreground">오늘 계획한 일, 어땠나요?</Text>
          </View>
          <CheckItem title="기획 회의" meta="14:00 · 일정" initial="done" />
          <CheckItem title="제안서 초안 작성" meta="10:00 · 할 일" initial="partial" initialFollow="1시간 더 필요" />
          <CheckItem title="API 연동 테스트" meta="16:00 · 할 일" initial="missed" initialFollow="회의가 길어짐" />
          <CheckItem title="디자인 리뷰" meta="14:00 · 일정" />
          <Button size="lg" className="h-12 rounded-lg">
            <Icon as={SparklesIcon} size={16} />
            <Text className="text-[15px] font-bold">업무일지 초안에 반영</Text>
          </Button>
          <Text className="text-center text-xs text-muted-foreground">하루 최대 2번 물어봐요 · 나중에 하기</Text>
        </BottomSheet>
      </View>
    </View>
  );
}

export function ReviewScreen() {
  return (
    <View className="flex-1">
      <TopBar title="주간 회고" right={<Text className="text-[13px] font-bold text-primary">편집기로</Text>} />
      <ScrollView contentContainerClassName="gap-4 px-5 pb-8 pt-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-[22px] font-bold text-foreground">10월 4주</Text>
          <View className="flex-row items-center gap-1 rounded-full bg-ai-soft px-2.5 py-1">
            <Icon as={SparklesIcon} size={12} className="text-ai" />
            <Text className="text-xs font-bold text-ai">AI 초안</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <StatTile label="계획한 시간" value="18시간" />
          <StatTile label="실제로 한 시간" value="14시간" accent />
        </View>
        <CompletionBar done={9} partial={3} missed={2} />
        <View className="gap-1.5">
          <SectionLabel>잘 된 것</SectionLabel>
          <Text className="text-sm leading-6 text-foreground">오전 집중 작업 3개 모두 완료. 회의는 계획보다 평균 15분 길었어요.</Text>
        </View>
        <View className="gap-1.5">
          <SectionLabel>밀린 것</SectionLabel>
          <Text className="text-sm leading-6 text-foreground">API 연동 테스트 2번 미룸 · 둘 다 오후 4시 이후</Text>
        </View>
        <View className="gap-2">
          <SectionLabel>다음 주 제안</SectionLabel>
          <ExtractedCard
            type="task"
            title="API 연동 테스트를 화요일 오전으로"
            meta="오후 늦은 시간은 이번 주 2번 다 못 했어요"
            source="수행 기록"
            actions={[{ label: '시간 잡기', primary: true }, { label: '넘기기' }]}
          />
        </View>
        <View className="rounded-lg bg-muted px-3 py-2.5">
          <Text className="text-xs text-muted-foreground">기록이 20개 미만이라 아직 참고용이에요 (이번 주 14개)</Text>
        </View>
      </ScrollView>
      <TabBar active="calendar" />
    </View>
  );
}
