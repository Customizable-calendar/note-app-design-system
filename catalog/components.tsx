import { ExtractedCard, ScheduleRow, SourceChip, TypeChip } from '@/components/app/cards';
import { Fab, FilterChips, SegmentTabs, TabBar, TopBar } from '@/components/app/navigation';
import { Lnb, LnbItem, LnbProfile, LnbSection, UsageMeter } from '@/components/app/lnb';
import { BottomSheet, SlashMenu, Toast } from '@/components/app/overlays';
import { Part } from '@/components/ds/frame';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { CARD_TYPES } from '@/lib/design/tokens';
import {
  ArchiveIcon,
  LayoutTemplateIcon,
  PencilLineIcon,
  CalendarIcon,
  MicIcon,
  PlusIcon,
  ShareIcon,
  SparklesIcon,
  SquareIcon,
  Trash2Icon,
} from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export type ComponentSpec = {
  id: string;
  name: string;
  source: 'reusables' | '앱 전용';
  file: string;
  desc: string;
  /** 구성요소 번호가 붙는 해부도 */
  Anatomy: React.ComponentType<{ show: boolean }>;
  /** 해부도 확대 비율 (기본 1.4, 세로로 긴 컴포넌트는 1) */
  anatomyScale?: number;
  parts: { name: string; cls: string; note?: string }[];
  /** 종류·상태 모음 */
  Variants: React.ComponentType;
  code: string;
};

function Row({ children }: { children: React.ReactNode }) {
  return <View className="flex-row flex-wrap items-center gap-3">{children}</View>;
}

function Caption({ children }: { children: React.ReactNode }) {
  return <Text className="text-[11px] text-muted-foreground">{children}</Text>;
}

export const COMPONENTS: ComponentSpec[] = [
  {
    id: 'button',
    name: '버튼',
    source: 'reusables',
    file: 'components/ui/button.tsx',
    desc: '화면마다 주 행동(채움 버튼)은 하나만. soft 는 이 프로젝트에서 추가한 종류로, 칩처럼 켜고 끄는 선택에 씀.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show}>
        <Button>
          <Part n={3} show={show} inset={-2}>
            <Icon as={SparklesIcon} size={16} />
          </Part>
          <Part n={2} show={show} inset={-2}>
            <Text>초안 만들기</Text>
          </Part>
        </Button>
      </Part>
    ),
    parts: [
      { name: '컨테이너', cls: 'bg-primary · rounded-md · h-10 px-4', note: '모서리는 --radius - 4px' },
      { name: '라벨', cls: 'text-primary-foreground · text-sm font-semibold' },
      { name: '아이콘 (선택)', cls: 'size 16 · 라벨 색을 그대로 물려받음' },
    ],
    Variants: () => (
      <View className="gap-4">
        <Row>
          <Button>
            <Text>default</Text>
          </Button>
          <Button variant="secondary">
            <Text>secondary</Text>
          </Button>
          <Button variant="soft">
            <Text>soft</Text>
          </Button>
          <Button variant="outline">
            <Text>outline</Text>
          </Button>
          <Button variant="ghost">
            <Text>ghost</Text>
          </Button>
          <Button variant="link">
            <Text>link</Text>
          </Button>
          <Button variant="destructive">
            <Icon as={Trash2Icon} size={16} />
            <Text>삭제</Text>
          </Button>
        </Row>
        <Row>
          <Button size="sm">
            <Text>sm</Text>
          </Button>
          <Button>
            <Text>default</Text>
          </Button>
          <Button size="lg">
            <Text>lg</Text>
          </Button>
          <Button size="icon" variant="outline">
            <Icon as={PlusIcon} size={18} />
          </Button>
          <Button disabled>
            <Text>disabled</Text>
          </Button>
        </Row>
      </View>
    ),
    code: `<Button variant="default" size="default">
  <Icon as={SparklesIcon} size={16} />
  <Text>초안 만들기</Text>
</Button>
// variant: default | secondary | soft | outline | ghost | link | destructive
// size: sm | default | lg | icon`,
  },
  {
    id: 'chip',
    name: '카드 종류 칩 · 출처 칩',
    source: '앱 전용',
    file: 'components/app/cards.tsx',
    desc: '카드 4종은 색 + 글자로 구분 (색만으로 구분하지 않음). 출처 칩은 회색으로 한 단계 약하게.',
    Anatomy: ({ show }) => (
      <Row>
        <Part n={1} show={show}>
          <TypeChip type="event" />
        </Part>
        <Part n={2} show={show}>
          <SourceChip label="메모" />
        </Part>
      </Row>
    ),
    parts: [
      { name: '종류 칩', cls: 'bg-{type}-soft · text-{type} · text-[11px] bold · rounded-full px-2' },
      { name: '출처 칩', cls: 'bg-muted · text-muted-foreground · text-[11px]' },
    ],
    Variants: () => (
      <View className="gap-3">
        <Row>
          {CARD_TYPES.map((t) => (
            <TypeChip key={t.key} type={t.key} />
          ))}
        </Row>
        <Row>
          <SourceChip label="메모" />
          <SourceChip label="녹음" />
          <SourceChip label="캘린더" />
          <SourceChip label="대화" />
        </Row>
      </View>
    ),
    code: `<TypeChip type="event" />   // event | task | person | idea
<SourceChip label="메모" />`,
  },
  {
    id: 'extracted',
    name: 'AI 추출 카드',
    source: '앱 전용',
    file: 'components/app/cards.tsx',
    desc: '절충안의 핵심 컴포넌트. AI 결과는 제안(점선)으로만 보여주고, 사람이 확인해야 저장(실선).',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[320px]">
        <View className="gap-1.5 rounded-lg border-[1.5px] border-dashed border-primary/40 bg-primary-soft/40 px-3.5 py-3">
          <View className="flex-row items-center justify-between">
            <Part n={2} show={show}>
              <TypeChip type="event" />
            </Part>
            <Part n={3} show={show}>
              <SourceChip label="메모" />
            </Part>
          </View>
          <Part n={4} show={show} className="self-start">
            <Text className="text-[15px] font-bold text-card-foreground">기획 회의</Text>
          </Part>
          <Part n={5} show={show} className="self-start">
            <Text className="text-xs text-muted-foreground">내일 15:00 · 강남 · 민수</Text>
          </Part>
          <Part n={6} show={show} className="mt-1 self-start">
            <View className="flex-row gap-2">
              <Button size="sm" className="h-8 px-3">
                <Text className="text-[13px]">확인</Text>
              </Button>
              <Button size="sm" variant="outline" className="h-8 px-3">
                <Text className="text-[13px]">고치기</Text>
              </Button>
              <Button size="sm" variant="outline" className="h-8 px-3">
                <Text className="text-[13px]">버리기</Text>
              </Button>
            </View>
          </Part>
        </View>
      </Part>
    ),
    parts: [
      { name: '컨테이너', cls: 'border-dashed border-primary/40 · bg-primary-soft/40 · rounded-lg', note: '확정되면 실선 border-border + bg-card' },
      { name: '종류 칩', cls: 'TypeChip' },
      { name: '출처 칩', cls: 'SourceChip — 원문 출처를 항상 표시' },
      { name: '제목', cls: 'text-[15px] font-bold' },
      { name: '메타', cls: 'text-xs text-muted-foreground — 날짜·장소·사람' },
      { name: '행동 버튼', cls: 'Button sm: 확인(default) · 고치기/버리기(outline)' },
    ],
    Variants: () => (
      <View className="w-[320px] gap-2.5">
        <Caption>suggested · 제안</Caption>
        <ExtractedCard type="task" title="견적서 보내기" meta="기획 회의 전에" />
        <Caption>confirmed · 확정</Caption>
        <ExtractedCard type="task" title="견적서 보내기" meta="기획 회의 전에" state="confirmed" />
        <Caption>dismissed · 버림</Caption>
        <ExtractedCard type="task" title="견적서 보내기" state="dismissed" />
      </View>
    ),
    code: `<ExtractedCard
  type="event"
  title="기획 회의"
  meta="내일 15:00 · 강남 · 민수"
  source="메모"
  state="suggested"   // suggested | confirmed | dismissed
/>`,
  },
  {
    id: 'card',
    name: '카드 (기본)',
    source: 'reusables',
    file: 'components/ui/card.tsx',
    desc: '세션 목록, 설정 묶음 같은 일반 묶음 상자. 모서리는 --radius + 4px.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[300px]">
        <Card className="gap-3 py-4">
          <CardHeader className="px-4">
            <Part n={2} show={show} className="self-start">
              <CardTitle>업무일지</CardTitle>
            </Part>
            <Part n={3} show={show} className="self-start">
              <CardDescription>문서 12 · 매일 밤 9시 자동 초안</CardDescription>
            </Part>
          </CardHeader>
          <CardContent className="px-4">
            <Part n={4} show={show}>
              <Text className="text-sm">오늘 작성할 초안이 있어요.</Text>
            </Part>
          </CardContent>
        </Card>
      </Part>
    ),
    parts: [
      { name: '컨테이너', cls: 'bg-card · border-border · rounded-xl · shadow-sm' },
      { name: '제목', cls: 'CardTitle · font-semibold' },
      { name: '설명', cls: 'CardDescription · text-sm text-muted-foreground' },
      { name: '본문', cls: 'CardContent' },
    ],
    Variants: () => (
      <View className="w-[320px] gap-2.5">
        <ScheduleRow time="10:00" title="자료구조 수업" meta="노트: 자료구조 7주차" />
        <ScheduleRow time="15:00" title="팀 회의" meta="Google 캘린더" metaTone="external" />
      </View>
    ),
    code: `<Card>
  <CardHeader>
    <CardTitle>업무일지</CardTitle>
    <CardDescription>문서 12 · 매일 밤 9시 자동 초안</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>`,
  },
  {
    id: 'schedule',
    name: '일정 행',
    source: '앱 전용',
    file: 'components/app/cards.tsx',
    desc: '홈의 오늘 일정. 시간 열 너비를 고정해서 세로 정렬을 맞춤. 외부 캘린더 출처는 서브 색 점.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[320px]">
        <View className="flex-row items-center gap-4 rounded-lg border border-border bg-card px-4 py-3.5">
          <Part n={2} show={show}>
            <Text className="w-12 text-[15px] font-bold">15:00</Text>
          </Part>
          <View className="flex-1 gap-0.5">
            <Part n={3} show={show} className="self-start">
              <Text className="text-[15px] font-semibold">팀 회의</Text>
            </Part>
            <Part n={4} show={show} className="self-start">
              <View className="flex-row items-center gap-1.5">
                <View className="h-2 w-2 rounded-full bg-secondary" />
                <Text className="text-xs text-secondary">Google 캘린더</Text>
              </View>
            </Part>
          </View>
        </View>
      </Part>
    ),
    parts: [
      { name: '컨테이너', cls: 'border-border · bg-card · rounded-lg' },
      { name: '시간', cls: 'w-12 · text-[15px] font-bold' },
      { name: '제목', cls: 'text-[15px] font-semibold' },
      { name: '출처', cls: 'muted 글자 또는 서브 색 점 + 글자(외부 캘린더)' },
    ],
    Variants: () => (
      <View className="w-[320px] gap-2.5">
        <ScheduleRow time="10:00" title="자료구조 수업" meta="노트: 자료구조 7주차" />
        <ScheduleRow time="23:59" title="과제 마감" meta="노트: 자료구조 7주차" badge="D-7" />
      </View>
    ),
    code: `<ScheduleRow time="15:00" title="팀 회의" meta="Google 캘린더" metaTone="external" />`,
  },
  {
    id: 'input',
    name: '입력창',
    source: 'reusables',
    file: 'components/ui/input.tsx · textarea.tsx',
    desc: '한 줄은 Input, 메모·프롬프트는 Textarea. 포커스 때 ring 색(=메인)으로 테두리.',
    Anatomy: ({ show }) => (
      <View className="w-[300px] gap-1.5">
        <Part n={1} show={show} className="self-start">
          <Text className="text-sm text-muted-foreground">무엇을 써드릴까요?</Text>
        </Part>
        <Part n={2} show={show}>
          <Input placeholder="오늘 업무일지 초안 써줘" />
        </Part>
      </View>
    ),
    parts: [
      { name: '라벨', cls: 'text-sm text-muted-foreground' },
      { name: '입력 상자', cls: 'border-input · bg-background · rounded-md · h-10', note: '안내 글자 text-muted-foreground' },
    ],
    Variants: () => (
      <View className="w-[300px] gap-2.5">
        <Input placeholder="한 줄 입력" />
        <Input value="입력된 값" onChangeText={() => {}} />
        <Input placeholder="비활성" editable={false} />
        <Textarea placeholder="막 쓰는 메모" />
      </View>
    ),
    code: `<Input placeholder="검색" />
<Textarea placeholder="막 쓰는 메모" />`,
  },
  {
    id: 'badge',
    name: '배지',
    source: 'reusables',
    file: 'components/ui/badge.tsx',
    desc: '"AI 초안" 같은 상태 표시. 누를 수 없는 정보에만 씀.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show}>
        <Badge variant="outline" className="border-primary">
          <Part n={2} show={show} inset={-2}>
            <Text className="font-bold text-primary">AI 초안</Text>
          </Part>
        </Badge>
      </Part>
    ),
    parts: [
      { name: '테두리', cls: 'rounded-full · border px-2 py-0.5' },
      { name: '라벨', cls: 'text-xs font-medium' },
    ],
    Variants: () => (
      <Row>
        <Badge>
          <Text>default</Text>
        </Badge>
        <Badge variant="secondary">
          <Text>secondary</Text>
        </Badge>
        <Badge variant="outline">
          <Text>outline</Text>
        </Badge>
        <Badge variant="destructive">
          <Text>오류</Text>
        </Badge>
      </Row>
    ),
    code: `<Badge variant="outline"><Text>AI 초안</Text></Badge>`,
  },
  {
    id: 'filter',
    name: '필터 칩',
    source: '앱 전용',
    file: 'components/app/navigation.tsx',
    desc: '피드·오늘 카드 상단. 선택 칩은 글자색으로 채워서 확실하게.',
    Anatomy: ({ show }) => (
      <Row>
        <Part n={1} show={show}>
          <FilterChips items={['전체']} active="전체" />
        </Part>
        <Part n={2} show={show}>
          <FilterChips items={['블로그']} active="" />
        </Part>
      </Row>
    ),
    parts: [
      { name: '선택됨', cls: 'bg-foreground · text-background · font-bold' },
      { name: '기본', cls: 'border-border · bg-background · h-9 rounded-full px-4' },
    ],
    Variants: () => <FilterChips items={['전체 9', '일정', '할 일', '사람', '아이디어']} active="일정" />,
    code: `<FilterChips items={['전체', '블로그', '업무일지']} active="전체" onChange={setFilter} />`,
  },
  {
    id: 'segment',
    name: '세그먼트 전환',
    source: '앱 전용',
    file: 'components/app/navigation.tsx',
    desc: '같은 데이터를 다른 모양으로 볼 때 (목록/그래프). 필터 칩과 역할을 섞지 않기.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show}>
        <SegmentTabs items={['목록', '그래프']} active="그래프" />
      </Part>
    ),
    parts: [
      { name: '트랙 + 선택 칸', cls: 'bg-muted p-1 · 선택 칸 bg-background shadow-sm' },
    ],
    Variants: () => <SegmentTabs items={['일', '주', '월']} active="주" />,
    code: `<SegmentTabs items={['목록', '그래프']} active={view} onChange={setView} />`,
  },
  {
    id: 'tabbar',
    name: '하단 탭바',
    source: '앱 전용',
    file: 'components/app/navigation.tsx',
    desc: '3가지 구성을 3번 내비게이션 탭에서 바꿔 볼 수 있어요. 세션을 LNB로 옮기면 4칸으로 줄어요.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[340px]">
        <TabBar active="cards" />
      </Part>
    ),
    parts: [
      { name: '컨테이너', cls: 'h-[72px] · border-t border-border · bg-background', note: '아이콘 22 · 라벨 11 · 선택 text-primary bold' },
    ],
    Variants: () => (
      <View className="w-[340px] gap-3">
        <Caption>기존 4칸 · 홈 세션 피드 검색</Caption>
        <TabBar active="home" layout="original" />
        <Caption>카드 포함 5칸</Caption>
        <TabBar active="home" layout="cards5" />
        <Caption>세션을 LNB로 · 홈 카드 피드 검색</Caption>
        <TabBar active="home" layout="lnb4" />
      </View>
    ),
    code: `<TabBar active="home" />            // NAV_DESIGN.tabs 를 따름
<TabBar active="home" layout="lnb4" />  // original | cards5 | lnb4`,
  },
  {
    id: 'lnb',
    name: 'LNB 메뉴',
    source: '앱 전용',
    file: 'components/app/lnb.tsx',
    anatomyScale: 1.1,
    desc: '휴대폰은 왼쪽에서 밀어 여는 드로어(300px), 태블릿·웹은 고정 사이드바(260px). 메뉴 구성과 선택 표시는 3번 내비게이션 탭에서 바꿀 수 있어요.',
    Anatomy: ({ show }) => (
      <View className="w-[280px] rounded-xl border border-border bg-background">
        <Part n={1} show={show}>
          <LnbProfile />
        </Part>
        <Part n={2} show={show}>
          <View className="flex-row items-center justify-between px-5 pb-1 pt-2">
            <Text className="text-xs font-semibold text-muted-foreground">세션</Text>
          </View>
        </Part>
        <View className="px-3">
          <Part n={3} show={show}>
            <LnbItem icon={LayoutTemplateIcon} label="업무일지" count={12} active />
          </Part>
          <Part n={4} show={show}>
            <LnbItem icon={PencilLineIcon} label="빠른 입력" />
          </Part>
          <Part n={5} show={show}>
            <LnbItem dot="event" label="일정" count={3} />
          </Part>
          <Part n={6} show={show}>
            <LnbItem label="확인 대기" count={2} emphasis />
          </Part>
        </View>
        <Part n={7} show={show}>
          <View className="mt-2 border-t border-border">
            <UsageMeter percent={31} />
          </View>
        </Part>
      </View>
    ),
    parts: [
      { name: '프로필 · 공간 전환', cls: '아바타 bg-primary-soft · 이름 15 bold · 공간 이름 xs muted' },
      { name: '구역 제목', cls: 'text-xs font-semibold text-muted-foreground · 구역 사이 border-t' },
      { name: '선택된 항목', cls: 'bg-primary-soft + 글자 bold (또는 왼쪽 3px 막대 bg-primary)' },
      { name: '기본 항목', cls: 'h-11 (촘촘하게 h-9) · 아이콘 19 muted · 글자 15' },
      { name: '카드 종류 항목', cls: '아이콘 대신 카드 4종 색 점 · 개수 xs muted' },
      { name: '강조 개수', cls: 'bg-primary 원형 배지 — 확인 대기에만' },
      { name: 'AI 사용량', cls: '바닥 고정 · h-1.5 · 80%↑ 서브, 100% 오류 색' },
    ],
    Variants: () => (
      <View className="flex-row flex-wrap gap-6">
        <View className="gap-2">
          <Caption>드로어 (휴대폰)</Caption>
          <View className="h-[560px] overflow-hidden rounded-xl border border-border">
            <Lnb variant="drawer" />
          </View>
        </View>
        <View className="gap-2">
          <Caption>사이드바 (태블릿·웹) · 주 메뉴 포함</Caption>
          <View className="h-[560px] overflow-hidden rounded-xl border border-border">
            <Lnb variant="sidebar" active="home" />
          </View>
        </View>
        <View className="w-[260px] gap-2">
          <Caption>사용량 상태</Caption>
          <View className="rounded-xl border border-border">
            <UsageMeter percent={31} />
            <UsageMeter percent={86} />
            <UsageMeter percent={100} />
          </View>
          <Caption>기타 항목</Caption>
          <View className="rounded-xl border border-border">
            <LnbSection>
              <LnbItem icon={ArchiveIcon} label="보관함 · 버린 카드" />
            </LnbSection>
          </View>
        </View>
      </View>
    ),
    code: `<Lnb variant="drawer" active="session:worklog" />   // 휴대폰
<Lnb variant="sidebar" active="home" />              // 태블릿·웹

<LnbSection title="세션" action={PlusIcon}>
  <LnbItem icon={LayoutTemplateIcon} label="업무일지" count={12} active />
  <LnbItem dot="event" label="일정" count={3} />
  <LnbItem label="확인 대기" count={2} emphasis />
</LnbSection>`,
  },
  {
    id: 'topbar',
    name: '상단 바',
    source: '앱 전용',
    file: 'components/app/navigation.tsx',
    desc: '하위 화면 공통. 탭 화면은 상단 바 없이 큰 제목(28)을 씀.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[340px]">
        <TopBar title="업무일지 세션" center right={<Icon as={ShareIcon} size={20} />} />
      </Part>
    ),
    parts: [{ name: '컨테이너', cls: 'h-14 · border-b border-border · 뒤로 아이콘 24' }],
    Variants: () => (
      <View className="w-[340px] gap-3">
        <TopBar title="설정" />
        <TopBar title="빠른 입력" right={<Text className="text-[13px] font-bold text-primary">모두 확인</Text>} />
      </View>
    ),
    code: `<TopBar title="설정" />
<TopBar title="업무일지 세션" center right={<ShareButton />} />`,
  },
  {
    id: 'fab',
    name: '떠 있는 버튼',
    source: '앱 전용',
    file: 'components/app/navigation.tsx',
    desc: '홈의 AI(주) · 녹음(보조). 주 버튼만 채움.',
    Anatomy: ({ show }) => (
      <Row>
        <Part n={1} show={show}>
          <Fab icon={SparklesIcon} />
        </Part>
        <Part n={2} show={show}>
          <Fab icon={MicIcon} variant="outline" size={50} />
        </Part>
      </Row>
    ),
    parts: [
      { name: '주 버튼', cls: 'bg-primary · 56 · shadow-lg' },
      { name: '보조 버튼', cls: 'border-border bg-background · 50' },
    ],
    Variants: () => (
      <Row>
        <Fab icon={SparklesIcon} />
        <Fab icon={MicIcon} variant="outline" size={50} />
        <Fab icon={PlusIcon} size={48} />
      </Row>
    ),
    code: `<Fab icon={SparklesIcon} />
<Fab icon={MicIcon} variant="outline" size={50} />`,
  },
  {
    id: 'sheet',
    name: '바텀시트',
    source: '앱 전용',
    file: 'components/app/overlays.tsx',
    desc: 'AI 초안처럼 잠깐 입력받는 곳. 실제 앱에서는 @gorhom/bottom-sheet 같은 라이브러리에 이 모양을 입힘.',
    Anatomy: ({ show }) => (
      <View className="w-[340px]">
        <Part n={1} show={show}>
          <BottomSheet title="AI 초안" icon={SparklesIcon}>
            <Part n={2} show={show}>
              <Text className="text-sm text-muted-foreground">무엇을 써드릴까요?</Text>
            </Part>
            <Part n={3} show={show}>
              <Button>
                <Text>초안 만들기</Text>
              </Button>
            </Part>
          </BottomSheet>
        </Part>
      </View>
    ),
    parts: [
      { name: '시트', cls: 'bg-popover · rounded-t-2xl · 손잡이 h-1 w-10 bg-border' },
      { name: '내용', cls: '자유' },
      { name: '주 행동', cls: 'Button lg' },
    ],
    Variants: () => (
      <View className="w-[340px]">
        <BottomSheet title="카드 고치기">
          <Input value="기획 회의" onChangeText={() => {}} />
          <Button variant="outline">
            <Text>저장</Text>
          </Button>
        </BottomSheet>
      </View>
    ),
    code: `<BottomSheet title="AI 초안" icon={SparklesIcon}>
  …
</BottomSheet>`,
  },
  {
    id: 'slash',
    name: '슬래시 메뉴',
    source: '앱 전용',
    file: 'components/app/overlays.tsx',
    desc: '편집기에서 / 입력 시. /카드 로 확인한 카드를 문서에 끼움.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show}>
        <SlashMenu
          groups={[
            {
              title: '추천',
              items: [
                { icon: SquareIcon, label: '카드 넣기', hint: '오늘 확인한 카드 7장', selected: true },
                { icon: SparklesIcon, label: 'AI 초안', ai: true },
              ],
            },
          ]}
        />
      </Part>
    ),
    parts: [{ name: '메뉴', cls: 'bg-popover · rounded-xl · 선택 행 bg-accent · AI 항목 text-ai' }],
    Variants: () => (
      <SlashMenu
        groups={[
          { title: '입력', items: [{ icon: MicIcon, label: '녹음' }, { icon: CalendarIcon, label: '캘린더', hint: '이번 주 일정 블록' }] },
        ]}
      />
    ),
    code: `<SlashMenu groups={[{ title: '추천', items: [{ icon: SquareIcon, label: '카드 넣기', selected: true }] }]} />`,
  },
  {
    id: 'controls',
    name: '스위치 · 라디오 · 체크박스',
    source: 'reusables',
    file: 'components/ui/switch.tsx · radio-group.tsx · checkbox.tsx',
    desc: '켜짐 상태는 모두 메인 색. 직접 눌러 볼 수 있음.',
    Anatomy: ({ show }) => {
      const [on, setOn] = React.useState(true);
      const [checked, setChecked] = React.useState(true);
      const [radio, setRadio] = React.useState('a');
      return (
        <Row>
          <Part n={1} show={show}>
            <Switch checked={on} onCheckedChange={setOn} />
          </Part>
          <Part n={2} show={show}>
            <RadioGroup value={radio} onValueChange={setRadio} className="flex-row">
              <RadioGroupItem value="a" aria-label="a" />
              <RadioGroupItem value="b" aria-label="b" />
            </RadioGroup>
          </Part>
          <Part n={3} show={show}>
            <Checkbox checked={checked} onCheckedChange={setChecked} />
          </Part>
        </Row>
      );
    },
    parts: [
      { name: '스위치', cls: '켜짐 bg-primary · 꺼짐 bg-input' },
      { name: '라디오', cls: 'border-input · 선택 점 bg-primary' },
      { name: '체크박스', cls: '선택 bg-primary · 체크 text-primary-foreground' },
    ],
    Variants: () => (
      <Row>
        <Switch checked={false} onCheckedChange={() => {}} />
        <Switch checked onCheckedChange={() => {}} disabled />
        <Checkbox checked={false} onCheckedChange={() => {}} />
      </Row>
    ),
    code: `<Switch checked={on} onCheckedChange={setOn} />
<RadioGroup value={v} onValueChange={setV}><RadioGroupItem value="claude" /></RadioGroup>
<Checkbox checked={done} onCheckedChange={setDone} />`,
  },
  {
    id: 'progress',
    name: '진행 바',
    source: 'reusables',
    file: 'components/ui/progress.tsx',
    desc: 'API 사용량. 80% 넘으면 서브 색, 100%면 삭제·오류 색으로 바꾸는 규칙 제안.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[280px]">
        <Progress value={31} className="bg-muted" indicatorClassName="bg-primary" />
      </Part>
    ),
    parts: [{ name: '트랙 + 채움', cls: 'bg-muted · 채움 bg-primary · h-2 rounded-full' }],
    Variants: () => (
      <View className="w-[280px] gap-3">
        <Progress value={31} className="bg-muted" indicatorClassName="bg-primary" />
        <Progress value={84} className="bg-muted" indicatorClassName="bg-secondary" />
        <Progress value={100} className="bg-muted" indicatorClassName="bg-destructive" />
      </View>
    ),
    code: `<Progress value={31} className="bg-muted" indicatorClassName="bg-primary" />`,
  },
  {
    id: 'avatar',
    name: '아바타',
    source: 'reusables',
    file: 'components/ui/avatar.tsx',
    desc: '피드 작성자. 사진이 없으면 이름 첫 글자 + 연한 면.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show}>
        <Avatar alt="민서" className="size-10">
          <AvatarFallback className="bg-secondary-soft">
            <Text className="font-bold text-secondary">민</Text>
          </AvatarFallback>
        </Avatar>
      </Part>
    ),
    parts: [{ name: '원 + 첫 글자', cls: 'size-10 rounded-full · bg-*-soft · text-* bold' }],
    Variants: () => (
      <Row>
        {(['primary', 'secondary'] as const).map((t) => (
          <Avatar key={t} alt={t} className="size-10">
            <AvatarFallback className={t === 'primary' ? 'bg-primary-soft' : 'bg-secondary-soft'}>
              <Text className={t === 'primary' ? 'font-bold text-primary' : 'font-bold text-secondary'}>
                {t === 'primary' ? '지' : '민'}
              </Text>
            </AvatarFallback>
          </Avatar>
        ))}
      </Row>
    ),
    code: `<Avatar alt="민서"><AvatarFallback><Text>민</Text></AvatarFallback></Avatar>`,
  },
  {
    id: 'toast',
    name: '토스트',
    source: '앱 전용',
    file: 'components/app/overlays.tsx',
    desc: '카드 저장·삭제 직후. 되돌리기 하나만 붙임.',
    Anatomy: ({ show }) => (
      <Part n={1} show={show} className="w-[320px]">
        <Toast message="카드 3장을 저장했어요" action="되돌리기" />
      </Part>
    ),
    parts: [{ name: '알림', cls: 'bg-foreground · text-background · 행동 text-primary-soft' }],
    Variants: () => (
      <View className="w-[320px] gap-2">
        <Toast message="카드 3장을 저장했어요" action="되돌리기" />
        <Toast message="초안을 만들었어요" />
      </View>
    ),
    code: `<Toast message="카드 3장을 저장했어요" action="되돌리기" />`,
  },
];
