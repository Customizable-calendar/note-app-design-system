import {
  CelebrateCard,
  DaySectionTitle,
  MarkLegend,
  MonthMarks,
  TaskCheckRow,
  WeekMarks,
  WeekStrip,
  type DayMark,
  type WeekDay,
} from '@/components/app/calendar';
import { CardListRow, RailCard, SwipeRow, type CardState } from '@/components/app/cards';
import { AgendaRow, Briefing, NoteRow } from '@/components/app/home';
import { NavDesignContext, SortButton, SpeedDial, TabBar, TopBar } from '@/components/app/navigation';
import { BottomSheet, Scrim, Toast } from '@/components/app/overlays';
import {
  ActionRow,
  AiNotice,
  CountTabs,
  NextActionRow,
  SummaryHeader,
  SummaryLine,
  SummarySection,
  type NextAction,
} from '@/components/app/record';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { CardType } from '@/lib/design/tokens';
import {
  BellIcon,
  CalendarClockIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  MenuIcon,
  MicIcon,
  PencilLineIcon,
  QuoteIcon,
  SearchIcon,
  ShareIcon,
  SparklesIcon,
  Trash2Icon,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

// 개편안 화면이에요. 클로바노트와 네이버 캘린더의 화면 구조를 바탕으로 다시 짰어요.
// 어떤 요소를 어디서 가져왔는지는 docs/redesign.md 에 있어요.

// ---------- 홈 ----------
// 캘린더 화면과 같은 문법이에요: 위에 한 주 날짜 줄, 아래에 그날 목록. 상자를 쓰지 않고 구분선과 색 띠만 써요.
// 가져온 것: 클로바노트 홈(검색과 알림, 일정 줄에서 녹음, 최근과 공유 받은 탭), 네이버 캘린더 하루 화면(브리핑, 일정 줄, 바로 체크)

const HOME_WEEK: WeekDay[] = [
  { label: '일', date: 18 },
  { label: '월', date: 19, accounts: [1] },
  { label: '화', date: 20, accounts: [1, 2] },
  { label: '수', date: 21, accounts: [1] },
  { label: '목', date: 22, accounts: [1, 2] },
  { label: '금', date: 23, accounts: [1] },
  { label: '토', date: 24, accounts: [1, 2] },
];

const Line = () => <View className="h-px bg-border" />;

export function HomeScreen({ quickTools = true }: { quickTools?: boolean }) {
  const nav = React.useContext(NavDesignContext);
  const [open, setOpen] = React.useState(false);
  const [day, setDay] = React.useState(6);
  const [tab, setTab] = React.useState('recent');
  const [done, setDone] = React.useState<Record<string, boolean>>({});
  const toggle = (k: string) => setDone((d) => ({ ...d, [k]: !d[k] }));
  const left = 2 - Object.values(done).filter(Boolean).length;
  return (
    <View className="flex-1">
      <View className="h-14 flex-row items-center px-3">
        {nav.open !== 'edge' ? (
          <View className="h-11 w-11 items-center justify-center">
            <Icon as={MenuIcon} size={24} className="text-foreground" />
          </View>
        ) : (
          <View className="w-2" />
        )}
        <Text className="flex-1 pl-1 text-[15px] font-bold text-foreground">10월 {HOME_WEEK[day].date}일 {HOME_WEEK[day].label}요일</Text>
        <View className="h-11 w-11 items-center justify-center">
          <Icon as={SearchIcon} size={22} className="text-foreground" />
        </View>
        <View className="h-11 w-11 items-center justify-center">
          <Icon as={BellIcon} size={22} className="text-foreground" />
          <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-secondary" />
        </View>
      </View>
      <ScrollView contentContainerClassName="gap-6 pb-28 pt-2">
        <View className="gap-4 px-5">
          <Briefing lead="40분 뒤" title="팀 회의" detail="그 전에 견적서 보내기가 남았어요" />
          <WeekStrip days={HOME_WEEK} selected={day} onSelect={setDay} />
        </View>

        <View className="px-5">
          <DaySectionTitle label="일정" count={3} action="캘린더" />
          <AgendaRow start="10:00" end="11:30" title="자료구조 수업" meta="녹음 41분" tone="cal-2" past />
          <Line />
          <AgendaRow
            start="15:00"
            end="16:00"
            title="팀 회의"
            meta="3층 회의실"
            tone="cal-1"
            action={{ icon: MicIcon, label: '이 일정 녹음하기' }}
          />
          <Line />
          <AgendaRow start="19:00" end="20:00" title="운동" tone="ai" meta="아직 저장 안 됨" />
        </View>

        <View className="px-5">
          <DaySectionTitle label="할 일" count={left} />
          <TaskCheckRow flat title="견적서 보내기" meta="팀 회의 전에" status={done.quote ? 'done' : undefined} onToggle={() => toggle('quote')} />
          <Line />
          <TaskCheckRow flat title="과제 제출" meta="23:59 까지" status={done.hw ? 'done' : undefined} onToggle={() => toggle('hw')} />
          <Line />
          <View className="h-12 flex-row items-center justify-between">
            <Text className="text-[15px] text-foreground">확인할 카드 2장</Text>
            <Text className="text-[15px] font-bold text-primary">보기</Text>
          </View>
        </View>

        <View>
          <CountTabs
            items={[
              { key: 'recent', label: '최근 문서' },
              { key: 'shared', label: '공유됨', count: 1 },
            ]}
            active={tab}
            onChange={setTab}
          />
          <View className="px-5">
            {tab === 'recent' ? (
              <>
                <NoteRow icon={MicIcon} title="팀 회의 10/24" status="받아쓰는 중 62%" when="방금" isNew />
                <Line />
                <NoteRow icon={FileTextIcon} title="업무일지 10/23" preview="API 연동 테스트를 끝냈고 견적서는 내일로" when="어제" badge="카드 3" />
                <Line />
                <NoteRow icon={MicIcon} title="자료구조 7주차" preview="트리 순회 세 가지와 과제 안내" when="11:30" />
              </>
            ) : (
              <NoteRow icon={FileTextIcon} title="기획 회의록" preview="지우 님이 공유했어요" when="2일 전" isNew />
            )}
            <Line />
            <View className="h-12 justify-center">
              <Text className="text-[15px] font-bold text-primary">{tab === 'recent' ? '전체 문서' : '공유됨 전체'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {quickTools ? (
        <>
          {open ? <Scrim /> : null}
          <View className="absolute bottom-[88px] right-5">
            <SpeedDial
              open={open}
              onOpenChange={setOpen}
              items={[
                { icon: MicIcon, label: '녹음' },
                { icon: SparklesIcon, label: 'AI에게 묻기', ai: true },
              ]}
            />
          </View>
        </>
      ) : null}
      <TabBar active="home" />
    </View>
  );
}

// ---------- 오늘 카드 ----------
// 상자 없는 목록이에요. 카드 한 장은 색 띠가 붙은 한 줄이고, 상태는 구역으로 나눠요.
// 가져온 것: 클로바노트의 개수 붙는 탭과 길게 누르기 시트, 네이버 캘린더 할 일 화면의 정렬과 목록에서 바로 처리

type Row = { id: string; type: CardType; title: string; meta: string; state: CardState };

const ROWS: Row[] = [
  { id: 'a', type: 'event', title: '기획 회의', meta: '내일 15:00, 강남, 민수', state: 'suggested' },
  { id: 'b', type: 'task', title: '견적서 보내기', meta: '기획 회의 전에', state: 'suggested' },
  { id: 'c', type: 'event', title: '팀 회의', meta: '오늘 15:00', state: 'confirmed' },
  { id: 'd', type: 'task', title: '과제 제출', meta: '오늘 23:59', state: 'confirmed' },
  { id: 'e', type: 'person', title: '지우', meta: '팀 회의 참석', state: 'confirmed' },
  { id: 'f', type: 'idea', title: '카페 창업 아이디어', meta: '메모', state: 'confirmed' },
];

const TYPE_TABS: [string, string][] = [
  ['all', '전체'],
  ['event', '일정'],
  ['task', '할 일'],
  ['person', '사람'],
  ['idea', '아이디어'],
];

export function CardsScreen({ sheet = false, swipe = false }: { sheet?: boolean; swipe?: boolean }) {
  const [rows, setRows] = React.useState(ROWS);
  const [type, setType] = React.useState('all');
  const [more, setMore] = React.useState<string | null>(sheet ? 'a' : null);
  const [toast, setToast] = React.useState<string | null>(null);
  const live = rows.filter((r) => r.state !== 'dismissed');
  const shown = live.filter((r) => type === 'all' || r.type === type);
  const waiting = shown.filter((r) => r.state === 'suggested');
  const kept = shown.filter((r) => r.state === 'confirmed');
  const keptAll = live.filter((r) => r.state === 'confirmed').length;
  const set = (id: string, next: CardState) => {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, state: next } : r)));
    setToast(next === 'confirmed' ? '카드를 저장했어요' : '카드를 버렸어요');
    setMore(null);
  };
  const picked = rows.find((r) => r.id === more);
  const list = (items: Row[]) =>
    items.map((r, i) => (
      <View key={r.id}>
        {i > 0 ? <Line /> : null}
        <SwipeRow
          peek={swipe && r.id === 'a' ? 96 : swipe && r.id === 'c' ? -96 : 0}
          onConfirm={r.state === 'suggested' ? () => set(r.id, 'confirmed') : undefined}
          onDismiss={() => set(r.id, 'dismissed')}>
          <CardListRow
            type={r.type}
            title={r.title}
            meta={r.meta}
            state={r.state}
            selected={r.id === more}
            onConfirm={() => set(r.id, 'confirmed')}
            onMore={() => setMore(r.id)}
          />
        </SwipeRow>
      </View>
    ));
  return (
    <View className="flex-1">
      <View className="h-14 flex-row items-center gap-2 pl-5 pr-3">
        <Text className="flex-1 text-xl font-bold tracking-tight text-foreground">오늘 카드</Text>
        <SortButton options={['최근 만든 순', '시간 빠른 순']} />
      </View>
      <CountTabs
        items={TYPE_TABS.map(([key, label]) => ({
          key,
          label,
          count: key === 'all' ? live.length : undefined,
        }))}
        active={type}
        onChange={setType}
      />
      <ScrollView contentContainerClassName="gap-6 px-5 pb-36 pt-4">
        {waiting.length ? (
          <View>
            <DaySectionTitle
              label="확인할 카드"
              count={waiting.length}
              action="모두 확인"
              onAction={() => {
                setRows((l) => l.map((r) => (r.state === 'suggested' ? { ...r, state: 'confirmed' } : r)));
                setToast(`카드 ${waiting.length}장을 저장했어요`);
              }}
            />
            {list(waiting)}
          </View>
        ) : null}
        {kept.length ? (
          <View>
            <DaySectionTitle label="확인한 카드" count={kept.length} />
            {list(kept)}
          </View>
        ) : null}
        {shown.length === 0 ? (
          <Text className="py-10 text-center text-[15px] text-muted-foreground">이 종류의 카드가 없어요</Text>
        ) : null}
      </ScrollView>
      <View className="absolute bottom-[72px] left-0 right-0">
        {toast && !picked ? (
          <View className="px-5 pb-2">
            <Toast message={toast} action="되돌리기" />
          </View>
        ) : null}
        <View className="h-14 flex-row items-center justify-between border-t border-border bg-background px-5">
          <Text className="text-[15px] text-foreground">확인한 카드 {keptAll}장</Text>
          <View className="flex-row items-center gap-1.5">
            <Icon as={SparklesIcon} size={16} className="text-ai" />
            <Text className="text-[15px] font-bold text-ai">초안 만들기</Text>
          </View>
        </View>
      </View>
      <TabBar active="cards" />
      {picked ? (
        <>
          <Pressable onPress={() => setMore(null)} className="absolute inset-0 bg-black/25" accessibilityLabel="닫기" />
          <View className="absolute bottom-0 left-0 right-0">
            <BottomSheet>
              <Text className="text-xs text-muted-foreground">
                {picked.title}, {picked.meta}
              </Text>
              <View className="-my-1">
                {picked.state === 'suggested' ? (
                  <Pressable onPress={() => set(picked.id, 'confirmed')}>
                    <ActionRow icon={CheckIcon} label="확인하고 저장" />
                  </Pressable>
                ) : null}
                <ActionRow icon={PencilLineIcon} label="고치기" />
                {picked.type === 'task' ? <ActionRow icon={CalendarClockIcon} label="시간 잡기" /> : null}
                <ActionRow icon={QuoteIcon} label="원문 보기" />
                <Pressable onPress={() => set(picked.id, 'dismissed')}>
                  <ActionRow icon={Trash2Icon} label="버리기" />
                </Pressable>
              </View>
            </BottomSheet>
          </View>
        </>
      ) : null}
    </View>
  );
}

// ---------- 주간 회고 ----------
// 네이버 캘린더 습관(요일별 달성 표시, 한 달 진행, 절반과 전부 달성 축하, 공유)과
// 클로바노트 요약(양식 줄, 접는 구역, 다음 할 일, 틀릴 수 있다는 안내)을 합쳤어요.

const WEEK: { label: string; date: number; mark: DayMark; detail: string }[] = [
  { label: '일', date: 18, mark: 'rest', detail: '잡은 일이 없었어요.' },
  { label: '월', date: 19, mark: 'half', detail: '3개 중 2개를 끝내고 1개는 부분만 했어요.' },
  { label: '화', date: 20, mark: 'half', detail: '3개 중 2개를 끝내고 1개는 못 했어요.' },
  { label: '수', date: 21, mark: 'full', detail: '3개를 모두 끝냈어요.' },
  { label: '목', date: 22, mark: 'some', detail: '3개 중 1개만 끝냈어요.' },
  { label: '금', date: 23, mark: 'half', detail: '2개 중 1개를 끝내고 1개는 부분만 했어요.' },
  { label: '토', date: 24, mark: 'future', detail: '오늘이에요. 저녁에 확인해요.' },
];

const MONTH: DayMark[][] = [
  ['rest', 'half', 'none', 'half', 'some', 'half', 'rest'],
  ['rest', 'full', 'half', 'some', 'half', 'none', 'rest'],
  ['rest', 'half', 'full', 'half', 'half', 'some', 'rest'],
  ['rest', 'half', 'half', 'full', 'some', 'half', 'future'],
];

const NEXT_WEEK: NextAction[] = [
  { type: 'task', title: 'API 연동 테스트를 화요일 오전으로', meta: '오후 4시 뒤에 잡은 건 2번 다 못 했어요' },
  { type: 'task', title: '운동을 30분으로 줄이기', meta: '1시간짜리는 3주째 못 했어요' },
];

export function ReviewScreen() {
  const [next, setNext] = React.useState(NEXT_WEEK);
  return (
    <View className="flex-1">
      <TopBar title="주간 회고" right={<Icon as={ShareIcon} size={20} className="text-foreground" />} />
      <ScrollView contentContainerClassName="gap-5 px-5 pb-28 pt-4">
        <View className="flex-row items-center justify-between">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-muted">
            <Icon as={ChevronLeftIcon} size={18} className="text-foreground" />
          </View>
          <View className="items-center">
            <Text className="text-[17px] font-bold text-foreground">10월 4주</Text>
            <Text className="text-xs text-muted-foreground">18일 ~ 24일</Text>
          </View>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-muted opacity-40">
            <Icon as={ChevronRightIcon} size={18} className="text-foreground" />
          </View>
        </View>

        <CelebrateCard title={'이번 주 절반을 넘겼어요'} detail="14개 중 9개를 끝냈어요. 지난주보다 2개 더 했어요." />

        <View className="gap-2.5">
          <DaySectionTitle label="이번 주" />
          <WeekMarks days={WEEK} />
          <MarkLegend />
        </View>

        <View className="gap-2.5">
          <DaySectionTitle label="10월 한 달" />
          <MonthMarks weeks={MONTH} current={3} />
        </View>

        <View>
          <View className="pb-3">
            <SummaryHeader template="주간 회고 양식" />
          </View>
          <SummarySection title="잘 된 것">
            <SummaryLine>오전에 잡은 집중 작업 3개를 모두 끝냈어요.</SummaryLine>
            <SummaryLine>수요일은 잡은 일을 다 했어요.</SummaryLine>
          </SummarySection>
          <SummarySection title="밀린 것 2">
            <RailCard
              type="task"
              title="API 연동 테스트"
              meta="2번 미룸, 둘 다 오후 4시 뒤"
              right={<Text className="text-[13px] font-bold text-primary">다시 잡기</Text>}
            />
            <View className="border-t border-border">
              <RailCard
                type="task"
                title="운동"
                meta="목요일에 못 함"
                right={<Text className="text-[13px] font-bold text-primary">다시 잡기</Text>}
              />
            </View>
          </SummarySection>
          <SummarySection title={`다음 주에는 ${next.length}`}>
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
          <View className="border-t border-border pt-3">
            <AiNotice>기록이 20개보다 적어서 아직 참고용이에요. 이번 주 기록은 14개예요.</AiNotice>
          </View>
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 flex-row gap-2 border-t border-border bg-background px-5 pb-6 pt-3">
        <View className="h-11 flex-1 flex-row items-center gap-1.5">
          <Icon as={ShareIcon} size={16} className="text-foreground" />
          <Text className="text-[15px] text-foreground">그림으로 공유</Text>
        </View>
        <Button className="h-11 rounded-lg px-5">
          <Text>회고 문서로</Text>
        </Button>
      </View>
    </View>
  );
}

/** 카드 줄을 길게 눌렀을 때 */
export function CardActionsScreen() {
  return <CardsScreen sheet />;
}

/** 카드 줄을 옆으로 미는 중 (위는 오른쪽으로 밀어 확인, 아래는 왼쪽으로 밀어 버리기) */
export function CardSwipeScreen() {
  return <CardsScreen swipe />;
}
