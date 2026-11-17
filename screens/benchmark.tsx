import {
  DaySectionTitle,
  DualHandle,
  EventBlock,
  MonthGrid,
  QuickActionMenu,
  TaskCheckRow,
  type MonthDay,
  type Status,
} from '@/components/app/calendar';
import { SectionLabel } from '@/components/app/cards';
import { Fab, SegmentTabs, TabBar, TopBar } from '@/components/app/navigation';
import { BottomSheet, Scrim } from '@/components/app/overlays';
import {
  ActionRow,
  AiNotice,
  CountTabs,
  NextActionRow,
  PlayerBar,
  RecordMiniBar,
  RecordPanel,
  SummaryHeader,
  SummaryLine,
  SummarySection,
  TranscriptBlock,
  type NextAction,
  type TranscriptWord,
} from '@/components/app/record';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { HomeScreen } from '@/screens/redesign';
import {
  BookmarkIcon,
  CalendarPlusIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CopyIcon,
  HighlighterIcon,
  LayersIcon,
  MenuIcon,
  MicIcon,
  MoreHorizontalIcon,
  PencilLineIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

// 클로바노트, 네이버 캘린더의 구조를 참고해 다시 짠 화면이에요.
// 무엇을 왜 가져왔는지는 docs/benchmark/README.md 에 있어요.

// ---------- 녹음 ----------

/** 녹음 시트. 손잡이를 누르면 작은 막대로 줄고, 막대를 누르면 다시 열려요 */
export function RecordSheetScreen() {
  const [mini, setMini] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [marks, setMarks] = React.useState(2);
  return (
    <View className="flex-1">
      <HomeScreen quickTools={false} />
      {mini ? (
        <View className="absolute bottom-[84px] left-4 right-4">
          <RecordMiniBar
            time="12:04"
            paused={paused}
            onOpen={() => setMini(false)}
            onBookmark={() => setMarks((m) => m + 1)}
          />
        </View>
      ) : (
        <>
          <Scrim />
          <View className="absolute bottom-0 left-0 right-0">
            <Pressable onPress={() => setMini(true)} accessibilityLabel="녹음 시트 줄이기">
              <BottomSheet>
                <RecordPanel
                  time="12:04"
                  paused={paused}
                  bookmarks={marks}
                  preview={{
                    done: '그러면 견적서는 민수 님이 금요일까지 보내 주시고,',
                    pending: '다음 회의는 화요일 세 시로',
                  }}
                  onPause={() => setPaused((p) => !p)}
                  onBookmark={() => setMarks((m) => m + 1)}
                />
              </BottomSheet>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

// ---------- 받아쓴 글, 요약, 메모 ----------

const words = (text: string, highlight: number[] = []): TranscriptWord[] =>
  text.split(' ').map((t, i) => ({ text: t, highlight: highlight.includes(i) }));

const BLOCKS = [
  { time: '00:12', words: words('오늘은 다음 주 출시 일정부터 정리할게요. 먼저 남은 일부터 볼까요?') },
  {
    time: '03:41',
    bookmarked: true,
    words: words('견적서는 민수 님이 금요일까지 보내 주시고, 저는 제안서 초안을 수요일까지 쓸게요.', [0, 1, 2, 3, 4, 5]),
    memo: '03:50 견적서 금액은 지난번 기준으로',
  },
  { time: '07:05', words: words('다음 회의는 화요일 세 시에 강남에서 하는 걸로 하죠.') },
  { time: '09:30', words: words('디자인 시안은 두 가지로 좁혔고, 이번 주 안에 하나로 정할게요.') },
];

const NEXT: NextAction[] = [
  { type: 'task', title: '견적서 보내기', meta: '민수, 금요일까지' },
  { type: 'task', title: '제안서 초안 쓰기', meta: '수요일까지' },
  { type: 'event', title: '다음 회의', meta: '화요일 15:00, 강남' },
];

function NoteTop() {
  return (
    <TopBar
      title="주간 회의 10/24"
      right={
        <View className="flex-row items-center gap-4">
          <Icon as={SearchIcon} size={20} className="text-foreground" />
          <Icon as={MoreHorizontalIcon} size={20} className="text-foreground" />
        </View>
      }
    />
  );
}

function TranscriptList({ selected, onLongPress }: { selected?: number; onLongPress?: (i: number) => void }) {
  const [at, setAt] = React.useState<[number, number]>([1, 3]);
  return (
    <ScrollView contentContainerClassName="gap-1 px-2 pb-6 pt-3">
      {BLOCKS.map((b, i) => (
        <TranscriptBlock
          key={b.time}
          time={b.time}
          words={b.words}
          bookmarked={b.bookmarked}
          memo={b.memo}
          selected={selected === i}
          playingIndex={at[0] === i ? at[1] : undefined}
          onWordPress={(w) => setAt([i, w])}
          onLongPress={() => onLongPress?.(i)}
        />
      ))}
    </ScrollView>
  );
}

function SummaryTab() {
  const [next, setNext] = React.useState(NEXT);
  return (
    <ScrollView contentContainerClassName="px-5 pb-6 pt-4">
      <View className="pb-3">
        <SummaryHeader template="회의록 양식" left="이번 달 12번 남음" />
      </View>
      <SummarySection title="요약" edited>
        <SummaryLine>다음 주 출시 전에 남은 일을 나눠 맡았어요.</SummaryLine>
        <SummaryLine>디자인 시안은 두 가지로 좁혔고 이번 주 안에 정해요.</SummaryLine>
      </SummarySection>
      <SummarySection title="주요 주제" defaultOpen={false}>
        <SummaryLine>출시 일정</SummaryLine>
        <SummaryLine>견적서와 제안서</SummaryLine>
      </SummarySection>
      <SummarySection title={`다음 할 일 ${next.length}`}>
        <View className="gap-2">
          {next.map((n, i) => (
            <NextActionRow
              key={n.title}
              action={n}
              onConfirm={() => setNext((list) => list.map((x, j) => (j === i ? { ...x, state: 'confirmed' } : x)))}
            />
          ))}
        </View>
      </SummarySection>
      <View className="border-t border-border py-3">
        <AiNotice />
      </View>
      <View className="h-12 flex-row items-center gap-1.5 border-t border-border">
        <Icon as={SparklesIcon} size={16} className="text-ai" />
        <Text className="text-[15px] font-bold text-ai">이 요약으로 문서 초안 만들기</Text>
      </View>
    </ScrollView>
  );
}

function MemoTab() {
  return (
    <ScrollView contentContainerClassName="gap-2.5 px-5 pb-6 pt-4">
      <SectionLabel>녹음 전에 적은 메모</SectionLabel>
      <Text className="pb-2 text-base leading-6 text-foreground">견적서 금액 확인하기, 시안 두 개 가져가기</Text>
      <SectionLabel>녹음 중에 적은 메모</SectionLabel>
      {[
        ['03:50', '견적서 금액은 지난번 기준으로'],
        ['07:20', '강남 회의실 예약 필요'],
      ].map(([t, m]) => (
        <View key={t} className="h-12 flex-row items-center gap-3 border-t border-border">
          <View className="w-14 flex-row items-center gap-1">
            <Icon as={PlayIcon} size={11} className="text-primary" />
            <Text className="text-[13px] font-bold text-primary">{t}</Text>
          </View>
          <Text className="flex-1 text-base text-foreground">{m}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

/** 녹음 노트 상세. 탭 3개와 재생 막대. 단어를 누르면 거기부터 재생해요 */
export function NoteDetailScreen({ initialTab = 'text' }: { initialTab?: 'text' | 'summary' | 'memo' }) {
  const [tab, setTab] = React.useState<string>(initialTab);
  const [playing, setPlaying] = React.useState(true);
  return (
    <View className="flex-1">
      <NoteTop />
      <CountTabs
        items={[
          { key: 'text', label: '받아쓴 글' },
          { key: 'summary', label: '요약' },
          { key: 'memo', label: '메모', count: 3 },
        ]}
        active={tab}
        onChange={setTab}
      />
      <View className="flex-1">{tab === 'text' ? <TranscriptList /> : tab === 'summary' ? <SummaryTab /> : <MemoTab />}</View>
      <PlayerBar current="03:44" total="41:20" progress={0.09} playing={playing} onToggle={() => setPlaying((p) => !p)} />
    </View>
  );
}

export function NoteSummaryScreen() {
  return <NoteDetailScreen initialTab="summary" />;
}

/** 구간을 길게 눌렀을 때. 동작을 시트 하나에 모아요 */
export function BlockActionsScreen() {
  return (
    <View className="flex-1">
      <NoteTop />
      <CountTabs
        items={[
          { key: 'text', label: '받아쓴 글' },
          { key: 'summary', label: '요약' },
          { key: 'memo', label: '메모', count: 3 },
        ]}
        active="text"
      />
      <View className="flex-1">
        <TranscriptList selected={1} />
      </View>
      <Scrim />
      <View className="absolute bottom-0 left-0 right-0">
        <BottomSheet>
          <Text className="text-xs text-muted-foreground">03:41 견적서는 민수 님이 금요일까지 보내 주시고…</Text>
          <View className="-my-1">
            <ActionRow icon={PlayIcon} label="여기부터 듣기" />
            <ActionRow icon={LayersIcon} label="카드로 만들기" />
            <ActionRow icon={PencilLineIcon} label="고치기" />
            <ActionRow icon={HighlighterIcon} label="하이라이트" />
            <ActionRow icon={BookmarkIcon} label="북마크 빼기" />
            <ActionRow icon={CopyIcon} label="복사" />
          </View>
        </BottomSheet>
      </View>
    </View>
  );
}

// ---------- 캘린더 ----------

const d = (date: number, events?: MonthDay['events'], out = false): MonthDay => ({ date, events, out });
const WORK = (title: string) => ({ account: 1 as const, title });
const MINE = (title: string) => ({ account: 2 as const, title });

const OCTOBER: MonthDay[][] = [
  [d(27, undefined, true), d(28, undefined, true), d(29, undefined, true), d(30, undefined, true), d(1), d(2, [WORK('주간 회의')]), d(3)],
  [d(4), d(5, [WORK('주간 회의')]), d(6), d(7, [MINE('치과')]), d(8), d(9, [WORK('주간 회의')]), d(10)],
  [d(11), d(12, [WORK('주간 회의')]), d(13), d(14), d(15, [WORK('디자인 리뷰'), MINE('저녁 약속')]), d(16), d(17, [MINE('등산')])],
  [d(18), d(19, [WORK('주간 회의')]), d(20, [WORK('출시 점검'), MINE('점심')]), d(21), d(22, [WORK('주간 회의'), { title: '제안서 초안' }, MINE('점심')]), d(23), d(24, [MINE('가족 모임')])],
  [d(25), d(26, [WORK('주간 회의')]), d(27, [{ title: '다음 회의' }]), d(28), d(29), d(30, [WORK('월말 정리')]), d(31)],
];

type Dual = 'month' | 'dual' | 'day';
const NEXT_DUAL: Record<Dual, Dual> = { month: 'dual', dual: 'day', day: 'month' };

function CalendarTop() {
  const [view, setView] = React.useState('목록');
  return (
    <View className="h-14 flex-row items-center gap-3 border-b border-border px-4">
      <Icon as={MenuIcon} size={22} className="text-foreground" />
      <View className="flex-1 flex-row items-center gap-1">
        <Text className="text-lg font-bold text-foreground">2026. 10</Text>
        <Icon as={ChevronDownIcon} size={18} className="text-muted-foreground" />
      </View>
      <SegmentTabs items={['목록', '시간표']} active={view} onChange={setView} />
      <Icon as={SearchIcon} size={20} className="text-foreground" />
    </View>
  );
}

function DayList({ date }: { date: number }) {
  const [status, setStatus] = React.useState<Record<string, Status | undefined>>({ 견적서: undefined, 회의실: 'done' });
  const toggle = (k: string) => setStatus((s) => ({ ...s, [k]: s[k] === 'done' ? undefined : 'done' }));
  const open = ['견적서', '회의실'].filter((k) => status[k] !== 'done');
  const done = ['견적서', '회의실'].filter((k) => status[k] === 'done');
  const label: Record<string, [string, string]> = {
    견적서: ['견적서 보내기', '14:00 로 잡음, 기획 회의 전'],
    회의실: ['강남 회의실 예약', '메모에서 만든 카드'],
  };
  return (
    <ScrollView contentContainerClassName="gap-2 px-4 pb-24 pt-3">
      <View className="flex-row items-baseline gap-2">
        <Text className="text-lg font-bold text-foreground">10월 {date}일</Text>
        <Text className="text-[13px] text-muted-foreground">목요일</Text>
      </View>
      <DaySectionTitle label="일정" count={3} />
      <EventBlock account={1} title="주간 회의" meta="09:00 ~ 10:00, 회사" />
      <EventBlock title="제안서 초안" meta="10:00 ~ 12:00, 아직 저장 안 됨" />
      <EventBlock account={2} title="점심, 민수" meta="12:00 ~ 13:00, 개인" />
      <DaySectionTitle label="할 일" count={open.length} action="저녁에 한 번에 확인" />
      {open.map((k) => (
        <TaskCheckRow key={k} title={label[k][0]} meta={label[k][1]} status={status[k]} onToggle={() => toggle(k)} />
      ))}
      {done.length ? <DaySectionTitle label="끝낸 일" count={done.length} /> : null}
      {done.map((k) => (
        <TaskCheckRow key={k} title={label[k][0]} meta={label[k][1]} status="done" onToggle={() => toggle(k)} />
      ))}
      <DaySectionTitle label="기록" count={1} />
      <View className="py-1">
        <Text className="text-[15px] font-semibold text-foreground">주간 회의 10/22</Text>
        <Text className="text-xs text-muted-foreground">녹음 41분, 카드 3장</Text>
      </View>
    </ScrollView>
  );
}

/** 캘린더: 위는 달력, 아래는 그날 목록. 손잡이로 달력만, 반반, 하루만을 오가요 */
export function CalendarDualScreen({ initial = 'dual' }: { initial?: Dual }) {
  const [mode, setMode] = React.useState<Dual>(initial);
  const [date, setDate] = React.useState(22);
  return (
    <View className="flex-1">
      <CalendarTop />
      {mode !== 'day' ? (
        <View className="px-2 pt-2">
          <MonthGrid
            weeks={OCTOBER}
            selected={date}
            today={24}
            compact={mode === 'dual'}
            onSelect={(n) => {
              setDate(n);
              setMode('dual');
            }}
          />
        </View>
      ) : null}
      <DualHandle onPress={() => setMode((m) => NEXT_DUAL[m])} />
      {mode !== 'month' ? (
        <View className="flex-1">
          <DayList date={date} />
        </View>
      ) : (
        <View className="flex-1" />
      )}
      <View className="absolute bottom-5 right-5">
        <Fab icon={PlusIcon} size={52} />
      </View>
    </View>
  );
}

export function CalendarMonthScreen() {
  return <CalendarDualScreen initial="month" />;
}

/** 날짜를 길게 눌렀을 때 뜨는 빠른 메뉴 */
export function QuickMenuScreen() {
  return (
    <View className="flex-1">
      <CalendarTop />
      <View className="px-2 pt-2">
        <MonthGrid weeks={OCTOBER} selected={28} today={24} />
      </View>
      <Scrim />
      <View className="absolute left-0 right-0 top-[264px] items-center">
        <QuickActionMenu
          date="28"
          actions={[
            { icon: CalendarPlusIcon, label: '일정' },
            { icon: CheckSquareIcon, label: '할 일' },
            { icon: PencilLineIcon, label: '메모' },
            { icon: MicIcon, label: '녹음' },
          ]}
        />
      </View>
    </View>
  );
}

// ---------- 설정 ----------

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text className="pb-1 text-[13px] font-bold text-muted-foreground">{title}</Text>
      <View className="border-t border-border">{children}</View>
    </View>
  );
}

function SettingRow({
  label,
  value,
  hint,
  toggle,
  last = false,
}: {
  label: string;
  value?: string;
  hint?: string;
  toggle?: boolean;
  last?: boolean;
}) {
  const [on, setOn] = React.useState(toggle ?? false);
  return (
    <View className={cn('min-h-[52px] flex-row items-center gap-3 py-2.5 border-b border-border', last && 'border-b-0')}>
      <View className="flex-1 gap-0.5">
        <Text className="text-base text-foreground">{label}</Text>
        {hint ? <Text className="text-xs text-muted-foreground">{hint}</Text> : null}
      </View>
      {toggle !== undefined ? (
        <Switch checked={on} onCheckedChange={setOn} />
      ) : (
        <>
          {value ? <Text className="text-sm text-muted-foreground">{value}</Text> : null}
          <Icon as={ChevronRightIcon} size={18} className="text-muted-foreground" />
        </>
      )}
    </View>
  );
}

/** 설정: 맨 위에 남은 사용량, 그 아래 기능별 묶음 */
export function SettingsNextScreen() {
  return (
    <View className="flex-1">
      <TopBar title="설정" />
      <ScrollView contentContainerClassName="gap-5 px-5 pb-10 pt-5">
        <View className="gap-2">
          <Text className="text-[13px] font-bold text-muted-foreground">오늘 팀 AI</Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text className="text-[26px] font-bold tracking-tight text-foreground">12번</Text>
            <Text className="text-[15px] text-muted-foreground">남음, 30번 중</Text>
          </View>
          <Progress value={60} className="h-1.5" />
        </View>
        <SettingGroup title="계정">
          <SettingRow label="서현" value="로그인됨" last />
        </SettingGroup>
        <SettingGroup title="AI">
          <SettingRow label="녹음이 끝나면 바로 요약" toggle />
          <SettingRow label="요약 양식" value="회의록 양식" />
          <SettingRow label="내 AI 키" hint="이 기기에만 저장해요" value="Claude" last />
        </SettingGroup>
        <SettingGroup title="받아쓰기">
          <SettingRow label="받아쓰는 말" value="한국어" />
          <SettingRow label="받아쓰기 모델" value="기본, 190MB" />
          <SettingRow label="자주 쓰는 단어" value="6개" last />
        </SettingGroup>
        <SettingGroup title="캘린더">
          <SettingRow label="구글 캘린더" value="2개 연결" />
          <SettingRow label="처음 여는 보기" value="달력과 목록" />
          <SettingRow label="달력 글자 크기" value="보통" last />
        </SettingGroup>
        <SettingGroup title="화면과 알림">
          <SettingRow label="화면 모드" value="기기 설정 따르기" />
          <SettingRow label="저녁 수행 확인 알림" toggle />
          <SettingRow label="요약이 끝나면 알림" toggle={false} last />
        </SettingGroup>
      </ScrollView>
    </View>
  );
}
