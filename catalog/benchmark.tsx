import { MonthGrid, QuickActionMenu, TaskCheckRow, type MonthDay } from '@/components/app/calendar';
import { SpeedDial } from '@/components/app/navigation';
import {
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
} from '@/components/app/record';
import { Part } from '@/components/ds/frame';
import type { ComponentSpec } from '@/catalog/components';
import { CalendarPlusIcon, CheckSquareIcon, MicIcon, PencilLineIcon, SparklesIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

// 클로바노트, 네이버 캘린더를 참고해 더한 컴포넌트예요. 근거는 docs/benchmark/README.md

const TOOLS = [
  { icon: MicIcon, label: '녹음' },
  { icon: SparklesIcon, label: 'AI에게 묻기', ai: true },
];

const WEEKS: MonthDay[][] = [
  [
    { date: 18 },
    { date: 19, events: [{ account: 1, title: '주간 회의' }] },
    { date: 20, events: [{ account: 1, title: '출시 점검' }, { account: 2, title: '점심' }] },
    { date: 21 },
    { date: 22, events: [{ account: 1, title: '주간 회의' }, { title: '제안서 초안' }, { account: 2, title: '점심' }] },
    { date: 23 },
    { date: 24, events: [{ account: 2, title: '가족 모임' }] },
  ],
];

const WORDS = '견적서는 민수 님이 금요일까지 보내 주시고'.split(' ').map((text, i) => ({ text, highlight: i < 2 }));

export const BENCHMARK_COMPONENTS: ComponentSpec[] = [
  {
    id: 'speed-dial',
    name: '빠른 도구',
    source: '앱 전용',
    file: 'components/app/navigation.tsx',
    desc: '홈에만 떠 있는 버튼 하나. 누르면 녹음, AI에게 묻기가 이름과 같이 위로 펼쳐지고, 다시 누르거나 바깥을 누르면 닫혀요. 탭을 옮기면 숨겨요.',
    anatomyScale: 1,
    Anatomy: ({ show }) => (
      <Part n={1} show={show}>
        <SpeedDial open items={TOOLS} />
      </Part>
    ),
    parts: [
      { name: '여닫는 버튼', cls: 'bg-primary 56, 열리면 border-border bg-background 와 닫기 아이콘' },
      { name: '도구 버튼', cls: '48, AI 는 bg-ai, 나머지는 border-border bg-background' },
      { name: '이름표', cls: 'bg-foreground text-background 13 굵게' },
    ],
    Variants: () => (
      <View className="flex-row items-end gap-10">
        <SpeedDial items={TOOLS} />
        <SpeedDial open items={TOOLS} />
      </View>
    ),
    code: `<SpeedDial items={[{ icon: MicIcon, label: '녹음' }, { icon: SparklesIcon, label: 'AI에게 묻기', ai: true }]} />`,
  },
  {
    id: 'record-panel',
    name: '녹음 시트, 작은 막대',
    source: '앱 전용',
    file: 'components/app/record.tsx',
    desc: '녹음은 전체 화면이 아니라 시트로 열어요. 끌어내리면 탭바 위 작은 막대로 줄고 녹음은 계속돼요. 막대에서도 북마크와 끝내기를 할 수 있어요.',
    anatomyScale: 1,
    Anatomy: ({ show }) => (
      <View className="w-[335px] gap-4">
        <Part n={1} show={show}>
          <RecordPanel time="12:04" bookmarks={2} preview={{ done: '견적서는 금요일까지 보내 주시고,', pending: '다음 회의는' }} />
        </Part>
        <Part n={2} show={show}>
          <RecordMiniBar time="12:04" />
        </Part>
      </View>
    ),
    parts: [
      { name: '시트 안쪽', cls: '시간 40 굵게, 파형 bg-secondary, 가운데 버튼 64 bg-secondary, 양옆 48 테두리' },
      { name: '작은 막대', cls: 'h-14 rounded-xl border-border bg-popover shadow-lg' },
    ],
    Variants: () => (
      <View className="w-[335px] gap-3">
        <RecordMiniBar time="12:04" />
        <RecordMiniBar time="12:04" paused />
      </View>
    ),
    code: `<BottomSheet><RecordPanel time="12:04" bookmarks={2} preview={{ done, pending }} /></BottomSheet>
<RecordMiniBar time="12:04" onOpen={open} />`,
  },
  {
    id: 'count-tabs',
    name: '개수 붙는 탭',
    source: '앱 전용',
    file: 'components/app/record.tsx',
    desc: '녹음 노트의 받아쓴 글, 요약, 메모 탭. 노트 안에서 검색하면 탭마다 찾은 개수를 붙여요.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <CountTabs
          active="text"
          items={[
            { key: 'text', label: '받아쓴 글', count: 4 },
            { key: 'summary', label: '요약', count: 1 },
            { key: 'memo', label: '메모' },
          ]}
        />
      </Part>
    ),
    parts: [{ name: '탭', cls: 'h-11, 고른 탭은 굵게와 아래 2px 줄, 개수는 text-primary 13 굵게' }],
    Variants: () => (
      <View className="w-[335px]">
        <CountTabs
          active="summary"
          items={[
            { key: 'text', label: '받아쓴 글' },
            { key: 'summary', label: '요약' },
            { key: 'memo', label: '메모', count: 3 },
          ]}
        />
      </View>
    ),
    code: `<CountTabs active={tab} onChange={setTab} items={[{ key: 'text', label: '받아쓴 글' }, { key: 'memo', label: '메모', count: 3 }]} />`,
  },
  {
    id: 'transcript',
    name: '받아쓴 글 구간',
    source: '앱 전용',
    file: 'components/app/record.tsx',
    desc: '단어를 누르면 그 자리부터 재생하고, 구간을 길게 누르면 동작 시트가 열려요. 재생 중인 단어는 메인 연한 면, 하이라이트는 아이디어 연한 면이에요.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <TranscriptBlock time="03:41" words={WORDS} playingIndex={3} bookmarked memo="03:50 금액은 지난번 기준으로" />
      </Part>
    ),
    parts: [
      { name: '시각과 북마크', cls: 'text-xs 굵게 text-muted-foreground, 북마크 text-secondary' },
      { name: '글', cls: 'text-base leading-7, 재생 중 bg-primary-soft, 하이라이트 bg-idea-soft' },
      { name: '구간 안 메모', cls: 'bg-muted text-[13px] text-muted-foreground' },
    ],
    Variants: () => (
      <View className="w-[335px] gap-1">
        <TranscriptBlock time="00:12" words={WORDS.map((w) => ({ text: w.text }))} />
        <TranscriptBlock time="03:41" words={WORDS} selected />
      </View>
    ),
    code: `<TranscriptBlock time="03:41" words={words} playingIndex={3} onWordPress={seek} onLongPress={openActions} />`,
  },
  {
    id: 'player',
    name: '재생 막대',
    source: '앱 전용',
    file: 'components/app/record.tsx',
    desc: '녹음 노트 맨 아래에 붙어요. 5초 뒤로, 재생, 5초 앞으로, 속도. 글을 스크롤해 재생 위치가 안 보이면 "재생 위치로"가 떠요.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <PlayerBar current="03:44" total="41:20" progress={0.09} playing />
      </Part>
    ),
    parts: [{ name: '막대', cls: '진행 줄 h-1 bg-primary, 재생 버튼 48 bg-primary, 속도 칸 border-border' }],
    Variants: () => (
      <View className="w-[335px] pt-12">
        <PlayerBar current="12:10" total="41:20" progress={0.3} showLocate />
      </View>
    ),
    code: `<PlayerBar current="03:44" total="41:20" progress={0.09} playing onToggle={toggle} />`,
  },
  {
    id: 'summary',
    name: 'AI 요약 구역',
    source: '앱 전용',
    file: 'components/app/record.tsx',
    desc: '요약은 구역마다 접을 수 있어요. 상자 없이 위쪽 구분선과 제목 줄만 써요. 맨 위 줄에서 어떤 양식으로 정리했는지 보여 주고, 맨 아래에 틀릴 수 있다는 안내를 붙여요.',
    anatomyScale: 1,
    Anatomy: ({ show }) => (
      <View className="w-[335px] gap-3">
        <Part n={1} show={show}>
          <SummaryHeader template="회의록 양식" left="12번 남음" />
        </Part>
        <Part n={2} show={show}>
          <SummarySection title="요약" edited>
            <SummaryLine>다음 주 출시 전에 남은 일을 나눠 맡았어요.</SummaryLine>
          </SummarySection>
        </Part>
        <Part n={3} show={show}>
          <AiNotice />
        </Part>
      </View>
    ),
    parts: [
      { name: '양식 줄', cls: 'AI 색 글자, 양식 이름은 글자와 화살표만' },
      { name: '구역', cls: '위쪽 구분선, 제목 줄 h-12 17 굵게, 상자 없음' },
      { name: '안내', cls: 'text-xs text-muted-foreground' },
    ],
    Variants: () => (
      <View className="w-[335px] gap-3">
        <SummarySection title="주요 주제" defaultOpen={false}>
          <SummaryLine>출시 일정</SummaryLine>
        </SummarySection>
      </View>
    ),
    code: `<SummaryHeader template="회의록 양식" left="12번 남음" />
<SummarySection title="요약" edited><SummaryLine>…</SummaryLine></SummarySection>
<AiNotice />`,
  },
  {
    id: 'next-action',
    name: '다음 할 일 카드',
    source: '앱 전용',
    file: 'components/app/record.tsx',
    desc: '요약의 "다음 할 일"은 글 목록이 아니라 카드 후보예요. 오늘 카드와 같은 줄 모양이고, 확인해야 저장돼요.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <NextActionRow action={{ type: 'task', title: '견적서 보내기', meta: '민수, 금요일까지' }} />
      </Part>
    ),
    parts: [{ name: '후보 줄', cls: '색 띠, 제목 16 굵게, 오른쪽 확인 글자 버튼. 저장되면 체크 아이콘' }],
    Variants: () => (
      <View className="w-[335px] gap-2">
        <NextActionRow action={{ type: 'event', title: '다음 회의', meta: '화요일 15:00' }} />
        <NextActionRow action={{ type: 'task', title: '제안서 초안 쓰기', state: 'confirmed' }} />
      </View>
    ),
    code: `<NextActionRow action={{ type: 'task', title: '견적서 보내기', meta: '금요일까지' }} onConfirm={save} />`,
  },
  {
    id: 'month-grid',
    name: '월 달력',
    source: '캘린더',
    file: 'components/app/calendar.tsx',
    desc: '달력만 볼 때는 일정을 막대로, 목록과 반반으로 볼 때는 점으로 보여 줘요. 날짜를 누르면 그날 목록이 열리고, 길게 누르면 빠른 메뉴가 떠요.',
    anatomyScale: 1,
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <MonthGrid weeks={WEEKS} selected={22} today={24} />
      </Part>
    ),
    parts: [
      { name: '날짜 칸', cls: '달력만 h-[68px], 반반 h-11, 고른 날 bg-primary-soft, 오늘 원 bg-primary' },
      { name: '일정 막대', cls: '계정 연한 면 h-3.5 글자 9, AI 후보는 점선 border-ai' },
    ],
    Variants: () => (
      <View className="w-[335px]">
        <MonthGrid weeks={WEEKS} selected={22} today={24} compact />
      </View>
    ),
    code: `<MonthGrid weeks={weeks} selected={22} today={24} compact={mode === 'dual'} onSelect={openDay} onLongPress={openQuickMenu} />`,
  },
  {
    id: 'quick-menu',
    name: '날짜 빠른 메뉴',
    source: '캘린더',
    file: 'components/app/calendar.tsx',
    desc: '날짜를 길게 누르면 그 자리 위에 뜨는 메뉴. 손을 떼지 않고 끌어서 고를 수 있어요.',
    anatomyScale: 1,
    Anatomy: ({ show }) => (
      <Part n={1} show={show}>
        <QuickActionMenu
          date="27"
          actions={[
            { icon: CalendarPlusIcon, label: '일정' },
            { icon: CheckSquareIcon, label: '할 일' },
            { icon: PencilLineIcon, label: '메모' },
            { icon: MicIcon, label: '녹음' },
          ]}
        />
      </Part>
    ),
    parts: [{ name: '메뉴 버튼', cls: '48 border-border bg-popover shadow-lg, 이름표 bg-foreground 11 굵게' }],
    Variants: () => (
      <QuickActionMenu
        date="27"
        actions={[
          { icon: CalendarPlusIcon, label: '일정' },
          { icon: CheckSquareIcon, label: '할 일' },
          { icon: SparklesIcon, label: 'AI 등록', ai: true },
        ]}
      />
    ),
    code: `<QuickActionMenu date="27" actions={[{ icon: CalendarPlusIcon, label: '일정' }, { icon: CheckSquareIcon, label: '할 일' }]} />`,
  },
  {
    id: 'task-check',
    name: '바로 체크하는 할 일',
    source: '캘린더',
    file: 'components/app/calendar.tsx',
    desc: '목록에서 둥근 칸을 눌러 바로 끝내요. 줄을 누르면 완료, 부분, 못 함, 모름을 고르는 시트가 열려요. 끝낸 줄은 "끝낸 일" 구역으로 내려가요.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <TaskCheckRow title="견적서 보내기" meta="14:00 로 잡음" />
      </Part>
    ),
    parts: [{ name: '할 일 줄', cls: '둥근 칸 24 border-input, 끝내면 bg-primary 와 줄 긋기, 상태 칩 h-6' }],
    Variants: () => (
      <View className="w-[335px] gap-2">
        <TaskCheckRow title="강남 회의실 예약" status="done" />
        <TaskCheckRow title="제안서 초안 쓰기" meta="10:00" status="partial" />
        <TaskCheckRow title="운동" status="missed" />
      </View>
    ),
    code: `<TaskCheckRow title="견적서 보내기" meta="14:00 로 잡음" status={status} onToggle={toggle} onPress={openStatusSheet} />`,
  },
];
