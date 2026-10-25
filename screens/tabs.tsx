import { ExtractedCard, ScheduleRow, SectionLabel, TypeChip } from '@/components/app/cards';
import { Fab, FilterChips, SegmentTabs, TabBar } from '@/components/app/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME_ICON } from '@/screens/shared';
import {
  BookmarkIcon,
  FileTextIcon,
  HeartIcon,
  ImageIcon,
  LayoutTemplateIcon,
  MessageSquareIcon,
  MicIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  AlignLeftIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import { useCssColor } from '@/screens/shared';

export function HomeScreen() {
  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="gap-5 px-5 pb-28 pt-8">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-sm text-muted-foreground">토요일</Text>
            <Text className="text-[28px] font-bold tracking-tight text-foreground">10월 24일</Text>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-lg bg-muted">
            <Icon as={THEME_ICON} size={20} className="text-foreground" />
          </View>
        </View>
        <View className="gap-3 rounded-xl bg-primary-soft p-5">
          <View className="flex-row items-center gap-1.5">
            <Icon as={SparklesIcon} size={16} className="text-ai" />
            <Text className="text-[13px] font-bold text-ai">AI 추천</Text>
          </View>
          <Text className="text-[17px] font-bold leading-7 text-foreground">
            오늘 녹음 1개, 메모 5개, 일정 3개가 있어요.{'\n'}업무일지 초안을 만들어 볼까요?
          </Text>
          <Button className="self-start">
            <Text>초안 만들기</Text>
          </Button>
        </View>
        <SectionLabel>오늘 일정</SectionLabel>
        <View className="-mt-2 gap-2.5">
          <ScheduleRow time="10:00" title="자료구조 수업" meta="노트: 자료구조 7주차" />
          <ScheduleRow time="15:00" title="팀 회의" meta="Google 캘린더" metaTone="external" />
          <ScheduleRow time="23:59" title="과제 마감" meta="노트: 자료구조 7주차" badge="D-7" />
        </View>
        <SectionLabel>최근 문서</SectionLabel>
        <View className="-mt-2">
          {['업무일지 10/24', '가을 카페 투어 3곳'].map((d) => (
            <View key={d} className="border-b border-border py-3.5">
              <Text className="text-base text-foreground">{d}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View className="absolute bottom-[88px] right-5 items-center gap-3">
        <Fab icon={MicIcon} variant="outline" size={50} />
        <Fab icon={SparklesIcon} />
      </View>
      <TabBar active="home" />
    </View>
  );
}

const SESSION_TILES = [
  { name: '업무일지', meta: '문서 12 · 매일 밤 9시 자동 초안', icon: LayoutTemplateIcon, tone: 'primary', right: '오늘 작성' },
  { name: '블로그', meta: '문서 4 · 피드 공유 2', icon: ImageIcon, tone: 'secondary' },
  { name: '회의록', meta: '문서 7 · 녹음에서 자동 생성', icon: AlignLeftIcon, tone: 'muted' },
  { name: '연구논문', meta: '문서 1 · 참고 PDF 3', icon: FileTextIcon, tone: 'muted' },
] as const;

export function SessionsScreen() {
  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="gap-4 px-5 pb-8 pt-8">
        <View className="flex-row items-center justify-between">
          <Text className="text-[28px] font-bold tracking-tight text-foreground">세션</Text>
          <Button>
            <Icon as={PlusIcon} size={16} />
            <Text>새 세션</Text>
          </Button>
        </View>
        <SectionLabel>내 세션</SectionLabel>
        {SESSION_TILES.map((s) => (
          <View key={s.name} className="flex-row items-center gap-3.5 rounded-xl border border-border bg-card p-3.5">
            <View
              className={
                s.tone === 'primary'
                  ? 'h-11 w-11 items-center justify-center rounded-lg bg-primary-soft'
                  : s.tone === 'secondary'
                    ? 'h-11 w-11 items-center justify-center rounded-lg bg-secondary-soft'
                    : 'h-11 w-11 items-center justify-center rounded-lg bg-muted'
              }>
              <Icon
                as={s.icon}
                size={20}
                className={
                  s.tone === 'primary' ? 'text-primary' : s.tone === 'secondary' ? 'text-secondary' : 'text-muted-foreground'
                }
              />
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-base font-bold text-card-foreground">{s.name}</Text>
              <Text className="text-xs text-muted-foreground">{s.meta}</Text>
            </View>
            {'right' in s ? <Text className="text-[13px] font-bold text-primary">{s.right}</Text> : null}
          </View>
        ))}
        <SectionLabel>새 세션 · 템플릿 고르기</SectionLabel>
        <View className="flex-row flex-wrap gap-2.5">
          {[
            ['업무일지', '날짜 · 한 일 · 이슈 · 내일 할 일', false],
            ['블로그', '대표 사진 · 본문 · 태그', true],
            ['연구논문', '초록 · 서론 · 방법 · 결과', false],
            ['회의록', '참석자 · 결정 · 할 일', false],
          ].map(([n, d, on]) => (
            <View
              key={n as string}
              className={
                on
                  ? 'w-[48.5%] gap-1 rounded-xl border-2 border-primary bg-primary-soft p-3.5'
                  : 'w-[48.5%] gap-1 rounded-xl border border-border bg-card p-3.5'
              }>
              <Text className="text-[15px] font-bold text-card-foreground">{n as string}</Text>
              <Text className="text-xs leading-5 text-muted-foreground">{d as string}</Text>
            </View>
          ))}
        </View>
        <View className="h-12 flex-row items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-input">
          <Icon as={SparklesIcon} size={16} className="text-ai" />
          <Text className="text-[15px] font-semibold text-foreground">AI로 새 양식 만들기</Text>
        </View>
      </ScrollView>
      <TabBar active="sessions" />
    </View>
  );
}

export function FeedScreen() {
  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="gap-4 px-5 pb-8 pt-8">
        <Text className="text-[28px] font-bold tracking-tight text-foreground">피드</Text>
        <FilterChips items={['전체', '블로그', '업무일지']} active="전체" />
        <View className="flex-row items-center gap-3">
          <Avatar alt="민서" className="size-10">
            <AvatarFallback className="bg-secondary-soft">
              <Text className="font-bold text-secondary">민</Text>
            </AvatarFallback>
          </Avatar>
          <View>
            <Text className="font-bold text-foreground">민서</Text>
            <Text className="text-xs text-muted-foreground">블로그 · 2시간 전</Text>
          </View>
        </View>
        <View className="h-44 items-center justify-center rounded-xl bg-muted">
          <Text className="text-sm text-muted-foreground">[사진 3장]</Text>
        </View>
        <Text className="text-lg font-bold text-foreground">가을 카페 투어 3곳</Text>
        <Text className="-mt-2 text-sm leading-6 text-muted-foreground">
          성수에서 시작해 망원까지, 창가 자리가 좋은 카페 세 곳을 다녀왔어요.
        </Text>
        <View className="flex-row items-center gap-1 self-start rounded-full bg-ai-soft px-3 py-1">
          <Icon as={SparklesIcon} size={12} className="text-ai" />
          <Text className="text-xs text-ai">AI 초안 → 직접 수정</Text>
        </View>
        <View className="flex-row items-center gap-5 border-b border-border pb-4">
          <View className="flex-row items-center gap-1.5">
            <Icon as={HeartIcon} size={20} className="text-foreground" />
            <Text className="text-sm text-foreground">12</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Icon as={MessageSquareIcon} size={20} className="text-foreground" />
            <Text className="text-sm text-foreground">3</Text>
          </View>
          <View className="flex-1" />
          <View className="flex-row items-center gap-1.5">
            <Icon as={BookmarkIcon} size={20} className="text-foreground" />
            <Text className="text-sm text-foreground">저장</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <Avatar alt="지우" className="size-10">
            <AvatarFallback className="bg-primary-soft">
              <Text className="font-bold text-primary">지</Text>
            </AvatarFallback>
          </Avatar>
          <View>
            <Text className="font-bold text-foreground">지우</Text>
            <Text className="text-xs text-muted-foreground">업무일지 · 어제</Text>
          </View>
        </View>
        <Text className="text-lg font-bold text-foreground">팀플 3주차 진행 정리</Text>
      </ScrollView>
      <TabBar active="feed" />
    </View>
  );
}

const NODES = [
  { x: 175, y: 190, r: 16, kind: 'center', label: '자료구조 7주차' },
  { x: 70, y: 90, r: 11, kind: 'doc', label: '트리 순회' },
  { x: 285, y: 95, r: 11, kind: 'doc', label: '팀 회의록' },
  { x: 60, y: 300, r: 11, kind: 'doc', label: '데일리 10/24' },
  { x: 175, y: 350, r: 11, kind: 'doc', label: '업무일지 10/24' },
  { x: 290, y: 290, r: 11, kind: 'event', label: '과제 마감' },
];

export function SearchScreen() {
  const center = useCssColor('primary');
  const doc = useCssColor('muted-foreground');
  const event = useCssColor('event');
  const line = useCssColor('border');
  const soft = useCssColor('primary-soft');
  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="gap-4 px-5 pb-8 pt-8">
        <Text className="text-[28px] font-bold tracking-tight text-foreground">검색</Text>
        <View className="h-12 flex-row items-center gap-2.5 rounded-xl bg-muted px-4">
          <Icon as={SearchIcon} size={18} className="text-muted-foreground" />
          <Text className="text-[15px] text-muted-foreground">문서, 일정, 녹음 검색</Text>
        </View>
        <SegmentTabs items={['목록', '그래프']} active="그래프" />
        <View className="h-[400px] overflow-hidden rounded-xl border border-border bg-muted/40">
          <Svg width="100%" height="100%" viewBox="0 0 345 400">
            {NODES.slice(1).map((n) => (
              <Line key={n.label} x1={175} y1={190} x2={n.x} y2={n.y} stroke={line} strokeWidth={1.5} />
            ))}
            <Line x1={60} y1={300} x2={175} y2={350} stroke={line} strokeWidth={1.5} />
            {NODES.map((n) =>
              n.kind === 'event' ? (
                <Rect key={n.label} x={n.x - 10} y={n.y - 10} width={20} height={20} fill={event} transform={`rotate(45 ${n.x} ${n.y})`} />
              ) : (
                <React.Fragment key={n.label}>
                  {n.kind === 'center' ? <Circle cx={n.x} cy={n.y} r={n.r + 6} fill={soft} /> : null}
                  <Circle cx={n.x} cy={n.y} r={n.r} fill={n.kind === 'center' ? center : doc} />
                </React.Fragment>
              )
            )}
          </Svg>
          {NODES.map((n) => (
            <Text
              key={n.label}
              className={n.kind === 'center' ? 'absolute text-[13px] font-bold text-foreground' : 'absolute text-xs text-foreground'}
              style={{ left: n.x - 50, top: n.y + n.r + 6, width: 100, textAlign: 'center' }}>
              {n.label}
            </Text>
          ))}
        </View>
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <View className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
            <Text className="text-xs text-muted-foreground">문서</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="h-2.5 w-2.5 rotate-45 bg-event" />
            <Text className="text-xs text-muted-foreground">일정</Text>
          </View>
          <Text className="text-xs text-muted-foreground">점을 누르면 문서 열기</Text>
        </View>
      </ScrollView>
      <TabBar active="search" />
    </View>
  );
}

export function CardsScreen() {
  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="gap-4 px-5 pb-8 pt-8">
        <View className="flex-row items-center justify-between">
          <Text className="text-[28px] font-bold tracking-tight text-foreground">오늘 카드</Text>
          <Text className="text-sm text-muted-foreground">10월 24일</Text>
        </View>
        <FilterChips items={['전체 9', '일정', '할 일', '사람', '아이디어']} active="전체 9" />
        <View className="gap-2.5 rounded-xl bg-primary-soft/60 p-3">
          <View className="flex-row items-center justify-between px-1">
            <Text className="text-sm font-bold text-primary-soft-foreground">확인 대기 2</Text>
            <Text className="text-[13px] font-bold text-primary">모두 확인</Text>
          </View>
          <ExtractedCard type="task" title="견적서 보내기" meta="기획 회의 전에" />
          <ExtractedCard type="person" title="민수" meta="처음 보는 이름이에요" actions={[{ label: '추가', primary: true }, { label: '사람 아님' }]} />
        </View>
        <SectionLabel>확정 7</SectionLabel>
        <View className="-mt-1 overflow-hidden rounded-xl border border-border bg-card">
          {(
            [
              ['event', '기획 회의', '내일 15:00'],
              ['event', '자료구조 수업', '10:00'],
              ['task', 'API 연동 테스트', '완료'],
              ['idea', '카페 창업 아이디어', '메모'],
              ['person', '지우', '팀 회의 참석'],
            ] as const
          ).map(([t, title, meta], i) => (
            <View key={title} className={i ? 'flex-row items-center gap-3 border-t border-border px-4 py-3' : 'flex-row items-center gap-3 px-4 py-3'}>
              <TypeChip type={t} />
              <Text className="flex-1 text-[15px] font-semibold text-card-foreground">{title}</Text>
              <Text className="text-xs text-muted-foreground">{meta}</Text>
            </View>
          ))}
        </View>
        <Button size="lg" className="h-12 rounded-lg">
          <Icon as={SparklesIcon} size={16} />
          <Text className="text-[15px]">이 카드로 업무일지 초안</Text>
        </Button>
      </ScrollView>
      <TabBar active="cards" />
    </View>
  );
}
