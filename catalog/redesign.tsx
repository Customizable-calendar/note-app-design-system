import { CelebrateCard, MarkLegend, MonthMarks, WeekMarks, type DayMark } from '@/components/app/calendar';
import { CardListRow, RailCard } from '@/components/app/cards';
import { AgendaRow, Briefing, NoteRow } from '@/components/app/home';
import { ScrollChips, SortButton } from '@/components/app/navigation';
import { FoldHeading, HistoryRow, OutlineRow, SaveStatus } from '@/components/app/doc';
import { TreeRow } from '@/components/app/tree';
import type { ComponentSpec } from '@/catalog/components';
import { Part } from '@/components/ds/frame';
import { FileTextIcon, FolderIcon, FolderOpenIcon, InboxIcon, MicIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

// 개편안에서 더한 컴포넌트예요. 어디서 가져왔는지는 docs/redesign.md

const WEEK: { label: string; date: number; mark: DayMark; detail: string }[] = [
  { label: '월', date: 19, mark: 'half', detail: '3개 중 2개' },
  { label: '화', date: 20, mark: 'none', detail: '2개 모두 못 함' },
  { label: '수', date: 21, mark: 'full', detail: '3개 모두' },
  { label: '목', date: 22, mark: 'some', detail: '3개 중 1개' },
  { label: '금', date: 23, mark: 'future', detail: '아직' },
];

export const REDESIGN_COMPONENTS: ComponentSpec[] = [
  {
    id: 'briefing',
    name: '오늘 브리핑',
    source: '앱 전용',
    file: 'components/app/home.tsx',
    desc: '홈 맨 위에서 지금 가장 먼저 알아야 할 것 하나를 말해요. 상자나 배경 없이 글자 크기로만 강조해요. (네이버 캘린더의 브리핑에서 내용만 가져오고 모양은 글자로 바꿨어요)',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <Briefing lead="40분 뒤" title="팀 회의" detail="그 전에 견적서 보내기가 남았어요" />
      </Part>
    ),
    parts: [{ name: '브리핑', cls: '때 13 굵게 text-primary, 제목 26 굵게, 덧붙이는 말 15 회색. 배경과 테두리 없음' }],
    Variants: () => (
      <View className="w-[335px]">
        <Briefing lead="오늘" title="일정이 없어요" detail="밀린 할 일 2개가 있어요" />
      </View>
    ),
    code: `<Briefing lead="40분 뒤" title="팀 회의" detail="그 전에 견적서 보내기가 남았어요" />`,
  },
  {
    id: 'agenda',
    name: '일정 줄',
    source: '앱 전용',
    file: 'components/app/home.tsx',
    desc: '왼쪽 색 막대, 시간 두 줄(시작과 끝), 제목과 설명. 오른쪽에는 그 일정으로 바로 하는 동작 하나(녹음)를 아이콘으로 둘 수 있어요. (네이버 캘린더의 일정 줄, 클로바노트의 일정에서 녹음 시작)',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <AgendaRow start="15:00" end="16:00" title="팀 회의" meta="3층 회의실" action={{ icon: MicIcon, label: '녹음' }} />
      </Part>
    ),
    parts: [{ name: '일정 줄', cls: '색 막대 w-1 계정 색, 시작 13 굵게, 끝 11 회색, 제목 16 굵게, 동작 아이콘 20 (누르는 영역 44)' }],
    Variants: () => (
      <View className="w-[335px]">
        <AgendaRow start="10:00" end="11:30" title="자료구조 수업" meta="녹음 있음" tone="cal-2" past />
        <AgendaRow start="19:00" end="20:00" title="운동" meta="아직 저장 안 된 후보" tone="ai" />
      </View>
    ),
    code: `<AgendaRow start="15:00" end="16:00" title="팀 회의" meta="3층 회의실" tone="cal-1" action={{ icon: MicIcon, label: '녹음', onPress: record }} />`,
  },
  {
    id: 'note-row',
    name: '문서 줄',
    source: '앱 전용',
    file: 'components/app/home.tsx',
    desc: '종류 아이콘, 제목, 진행 상태나 요약 미리보기 한 줄, 오른쪽에 시각과 배지. 새 것은 제목 옆 점으로 알려요. 옆으로 밀거나 길게 누르면 옮기기와 휴지통이 나와요. (클로바노트의 노트 줄)',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <NoteRow icon={FileTextIcon} title="업무일지 10/23" preview="API 연동 테스트를 끝냈고 견적서는 내일로" when="어제" badge="카드 3" />
      </Part>
    ),
    parts: [{ name: '문서 줄', cls: '아이콘 20 회색(칸 없음), 제목 15 굵게, 미리보기 12 회색, 상태와 배지는 text-primary 굵게 글자만' }],
    Variants: () => (
      <View className="w-[335px]">
        <NoteRow icon={MicIcon} title="팀 회의 10/24" status="받아쓰는 중 62%" when="방금" isNew />
      </View>
    ),
    code: `<NoteRow icon={MicIcon} title="팀 회의 10/24" status="받아쓰는 중 62%" when="방금" isNew />`,
  },
  {
    id: 'scroll-chips',
    name: '칩 두 줄과 정렬',
    source: '앱 전용',
    file: 'components/app/navigation.tsx',
    desc: '옆으로 넘기는 칩 줄을 두 개 쌓아서 서로 다른 기준을 같이 걸러요. 윗줄은 상태, 아랫줄은 종류예요. 정렬은 오른쪽 위 버튼으로 골라요. (네이버 캘린더 할 일 화면)',
    Anatomy: ({ show }) => (
      <View className="w-[375px] gap-2">
        <Part n={1} show={show}>
          <ScrollChips
            active="wait"
            items={[
              { key: 'all', label: '전체' },
              { key: 'wait', label: '확인할 카드', count: 2 },
              { key: 'kept', label: '확인한 카드' },
            ]}
          />
        </Part>
        <Part n={2} show={show}>
          <ScrollChips
            active="all"
            items={[
              { key: 'all', label: '종류 전체' },
              { key: 'event', label: '일정', dot: 'bg-event' },
              { key: 'task', label: '할 일', dot: 'bg-task' },
            ]}
          />
        </Part>
      </View>
    ),
    parts: [
      { name: '상태 칩', cls: 'h-8 rounded-full, 고르면 bg-foreground text-background, 개수는 text-primary 굵게' },
      { name: '종류 칩', cls: '앞에 종류 색 점 8, 글자 이름을 항상 같이' },
    ],
    Variants: () => <SortButton options={['최근 만든 순', '시간 빠른 순', '종류별']} />,
    code: `<ScrollChips items={stateChips} active={state} onChange={setState} />
<ScrollChips items={typeChips} active={type} onChange={setType} />
<SortButton options={['최근 만든 순', '시간 빠른 순', '종류별']} />`,
  },
  {
    id: 'card-row',
    name: '카드 목록 줄',
    source: '앱 전용',
    file: 'components/app/cards.tsx',
    desc: '카드 한 장은 상자가 아니라 한 줄이에요. 왼쪽 색 띠와 종류 이름 글자로 종류를 알리고, 확인할 카드에는 오른쪽에 「확인」 글자 버튼이 붙어요. 길게 누르면 동작 시트가 열려요. 줄 사이는 구분선으로 나눠요.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <CardListRow type="event" title="기획 회의" meta="내일 15:00, 강남, 민수" />
      </Part>
    ),
    parts: [{ name: '카드 줄', cls: '색 띠 w-1 종류 색, 제목 16 굵게, 종류 이름 12 굵게 종류 색, 확인 15 굵게 text-primary (누르는 영역 44). 배경과 테두리 없음' }],
    Variants: () => (
      <View className="w-[335px] gap-2">
        <CardListRow type="task" title="과제 제출" meta="오늘 23:59" state="confirmed" />
        <RailCard type="task" title="API 연동 테스트" meta="2번 미룸" />
      </View>
    ),
    code: `<CardListRow type="event" title="기획 회의" meta="내일 15:00" state="suggested" onConfirm={confirm} onMore={openSheet} />`,
  },
  {
    id: 'marks',
    name: '달성 동그라미, 축하',
    source: '캘린더',
    file: 'components/app/calendar.tsx',
    desc: '하루를 동그라미 하나로 보여 줘요. 다 함은 채운 체크, 절반 넘김은 아래부터 차오른 모양, 못 함은 서브 연한 면이에요(빨강을 쓰지 않아요). 한 달은 작은 동그라미로 줄여요. 절반이나 전부를 채우면 맨 위에서 큰 글자로 축하해요. (네이버 캘린더 습관)',
    anatomyScale: 1,
    Anatomy: ({ show }) => (
      <View className="w-[335px] gap-3">
        <Part n={1} show={show}>
          <WeekMarks days={WEEK} />
        </Part>
        <Part n={2} show={show}>
          <MarkLegend />
        </Part>
        <Part n={3} show={show}>
          <CelebrateCard title="이번 주 절반을 넘겼어요" detail="14개 중 9개를 끝냈어요." />
        </Part>
      </View>
    ),
    parts: [
      { name: '요일 동그라미', cls: '32, 다 함 bg-primary, 절반 border-primary 와 bg-primary/40, 못 함 bg-secondary-soft' },
      { name: '뜻 설명', cls: '동그라미 12 와 글자 12. 항상 같이 둬요' },
      { name: '축하', cls: '상자 없음. 딱지 글자 13 굵게 text-primary, 제목 26 굵게, 덧말 15 회색' },
    ],
    Variants: () => (
      <View className="w-[335px] gap-3">
        <MonthMarks
          current={1}
          weeks={[
            ['rest', 'half', 'none', 'half', 'some', 'half', 'rest'],
            ['rest', 'full', 'half', 'some', 'future', 'future', 'future'],
          ]}
        />
        <CelebrateCard tone="full" title="이번 주 일을 모두 끝냈어요" detail="12개 중 12개" />
      </View>
    ),
    code: `<WeekMarks days={week} />
<MarkLegend />
<MonthMarks weeks={month} current={3} />
<CelebrateCard title="이번 주 절반을 넘겼어요" detail="14개 중 9개를 끝냈어요." />`,
  },
  {
    id: 'tree',
    name: '펼치는 목록 줄',
    source: '앱 전용',
    file: 'components/app/tree.tsx',
    desc: '폴더처럼 펼치고 접는 목록의 한 줄이에요. 단계마다 24씩 들여써요. 폴더 줄은 눌러서 펼치고, 길게 누르면 동작 시트가 열려요. 문서 줄 오른쪽에는 지금 상태나 고친 때를 글자로만 보여 줘요. (클로바노트 폴더 화면, personal-memo 의 폴더 트리)',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[335px]">
        <TreeRow icon={InboxIcon} label="전체 문서" strong count={24} expanded onAdd={() => {}} />
        <TreeRow icon={FolderOpenIcon} label="업무일지" depth={1} count={12} expanded />
        <TreeRow icon={FileTextIcon} label="업무일지 10/24" depth={2} status="고치는 중" />
        <TreeRow icon={FolderIcon} label="회의록" depth={1} count={7} expanded={false} />
      </Part>
    ),
    parts: [{ name: '줄', cls: 'h-12, 들여쓰기 24씩, 바깥 묶음 17 굵게, 나머지 16, 개수와 때는 회색, 상태는 text-primary 굵게' }],
    Variants: () => (
      <View className="w-[335px]">
        <TreeRow icon={MicIcon} label="주간 회의 10/24" depth={1} meta="오늘" />
        <TreeRow icon={FolderIcon} label="블로그" depth={1} count={4} expanded={false} selected />
      </View>
    ),
    code: `<TreeRow icon={FolderOpenIcon} label="업무일지" depth={1} count={12} expanded onPress={toggle} onLongPress={openSheet} />
<TreeRow icon={FileTextIcon} label="업무일지 10/24" depth={2} status="고치는 중" />`,
  },
  {
    id: 'save-status',
    name: '저장 상태',
    source: '앱 전용',
    file: 'components/app/doc.tsx',
    desc: '지금 문서가 어디에 저장됐는지 아이콘과 글자로만 알려요. 로그인 전이거나 연결이 끊기면 "기기에 보관", 둘 다 못 하면 "저장 안 됨"이에요. (personal-memo)',
    Anatomy: ({ show }) => (
      <Part n={1} show={show}>
        <SaveStatus state="editing" />
      </Part>
    ),
    parts: [{ name: '상태', cls: '아이콘 13, 글자 12. 고치는 중 text-primary 굵게, 저장됨 회색, 기기에 보관 text-foreground 굵게, 저장 안 됨 text-destructive 굵게' }],
    Variants: () => (
      <View className="gap-3">
        <SaveStatus state="editing" />
        <SaveStatus state="saved" />
        <SaveStatus state="local" />
        <SaveStatus state="failed" />
      </View>
    ),
    code: `<SaveStatus state="local" /> // editing | saved | local | failed`,
  },
  {
    id: 'doc-tools',
    name: '구역 접기, 목차, 고친 기록',
    source: '앱 전용',
    file: 'components/app/doc.tsx',
    desc: '긴 문서를 다루는 세 가지예요. 제목 왼쪽 화살표로 구역을 접고, 목차에서 제목으로 바로 가고, 고친 기록에서 골라 되돌려요. AI 초안으로도 되돌릴 수 있어요. (personal-memo)',
    anatomyScale: 1,
    Anatomy: ({ show }) => (
      <View className="w-[335px] gap-4">
        <Part n={1} show={show}>
          <FoldHeading>오늘 한 일</FoldHeading>
        </Part>
        <Part n={2} show={show}>
          <View>
            <OutlineRow label="오늘 한 일" current note="3줄" />
            <OutlineRow label="기획 회의" level={2} />
          </View>
        </Part>
        <Part n={3} show={show}>
          <HistoryRow when="오후 9:01" who="AI 초안" change="카드 7장으로 처음 만듦" />
        </Part>
      </View>
    ),
    parts: [
      { name: '접는 제목', cls: '화살표 18 회색, 제목 18 굵게' },
      { name: '목차 줄', cls: 'h-11, 지금 있는 곳은 왼쪽 막대 bg-primary 와 굵게, 한 단계 들여쓰기 20' },
      { name: '기록 줄', cls: '때 16 굵게, 누가 12 회색, 되돌리기 15 굵게 text-primary (누르는 영역 44)' },
    ],
    Variants: () => (
      <View className="w-[335px]">
        <FoldHeading open={false}>이슈</FoldHeading>
        <HistoryRow when="오후 9:12" who="내가 고침" change="남은 일 1줄 더함" current />
      </View>
    ),
    code: `<FoldHeading open={open} onPress={toggle}>오늘 한 일</FoldHeading>
<OutlineRow label="오늘 한 일" current note="3줄" />
<HistoryRow when="오후 9:01" who="AI 초안" change="카드 7장으로 처음 만듦" onRestore={restore} />`,
  },
];
