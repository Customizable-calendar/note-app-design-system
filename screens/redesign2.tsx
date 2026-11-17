import {
  AccountDot,
  DaySectionTitle,
  FOLLOW_UP,
  SlotOption,
  StatusPicker,
  TaskCheckRow,
  type Status,
} from '@/components/app/calendar';
import { CardListRow, RailCard, TypeChip, type CardState } from '@/components/app/cards';
import { NoteRow } from '@/components/app/home';
import { Fab, ScrollChips, SortButton, TabBar, TopBar } from '@/components/app/navigation';
import { BottomSheet, Scrim } from '@/components/app/overlays';
import { ActionRow, AiNotice, CountTabs } from '@/components/app/record';
import { FoldHeading, HistoryRow, OutlineRow, SaveStatus, type SaveState } from '@/components/app/doc';
import { TreeRow } from '@/components/app/tree';
import { AiMessage, AiText, Composer, DateDivider, Sources, Thinking, UserBubble } from '@/components/chat/chat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { CardType } from '@/lib/design/tokens';
import { HomeScreen } from '@/screens/redesign';
import { cn } from '@/lib/utils';
import {
  AlignLeftIcon,
  BookmarkIcon,
  CheckIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  EyeIcon,
  FilePlusIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  HashIcon,
  InboxIcon,
  PencilLineIcon,
  Share2Icon,
  StarIcon,
  Trash2Icon,
  UserRoundCheckIcon,
  Heading1Icon,
  Heading2Icon,
  HeartIcon,
  HistoryIcon,
  ImageIcon,
  LayoutTemplateIcon,
  ListIcon,
  ListTreeIcon,
  MessageSquareIcon,
  MicIcon,
  MoreHorizontalIcon,
  PlusIcon,
  QuoteIcon,
  SearchIcon,
  ShareIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  BellIcon,
  XIcon,
  type LucideIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

// 개편안 두 번째 묶음이에요. 앞의 화면들과 같은 모양 규칙을 써요 (docs/redesign.md).
// 상단바 한 줄, 칩 줄로 거르기, 상자 대신 구분선과 색 띠, 동그라미로 바로 처리, 아래에 주 버튼 하나.

const Divider = () => <View className="h-px bg-border" />;

// ---------- 빠른 입력 ----------

type Found = { id: string; type: CardType; title: string; meta: string; state: CardState };
const FOUND: Found[] = [
  { id: 'a', type: 'event', title: '기획 회의', meta: '내일 15:00, 강남, 민수', state: 'suggested' },
  { id: 'b', type: 'task', title: '견적서 보내기', meta: '기획 회의 전에', state: 'suggested' },
  { id: 'c', type: 'person', title: '민수', meta: '처음 보는 이름', state: 'suggested' },
  { id: 'd', type: 'idea', title: '카페 창업 아이디어', meta: '나중에 정리', state: 'confirmed' },
];

const TOOLS: [LucideIcon, string][] = [
  [MicIcon, '말로 쓰기'],
  [CheckSquareIcon, '체크리스트'],
  [HashIcon, '해시태그'],
  [BellIcon, '리마인드'],
  [ImageIcon, '사진'],
];

export function CaptureScreen() {
  const [rows, setRows] = React.useState(FOUND);
  const waiting = rows.filter((r) => r.state === 'suggested').length;
  const kept = rows.length - waiting;
  const confirm = (id: string) => setRows((l) => l.map((r) => (r.id === id ? { ...r, state: 'confirmed' } : r)));
  return (
    <View className="flex-1">
      <TopBar title="빠른 입력" right={<Text className="text-[15px] font-bold text-primary">저장</Text>} />
      <ScrollView contentContainerClassName="gap-4 pb-28 pt-4">
        <View className="px-5">
          <Text className="text-[17px] leading-7 text-foreground">
            내일 3시 민수랑 강남에서 기획 회의. 그 전에 견적서 보내야 함. 카페 창업 아이디어도 나중에 정리하기
          </Text>
          <View className="mt-1 h-5 w-0.5 bg-primary" />
        </View>
        <View className="flex-row items-center gap-1 border-y border-border px-3 py-1">
          {TOOLS.map(([icon, label]) => (
            <View key={label} className="h-11 w-11 items-center justify-center" accessibilityLabel={label}>
              <Icon as={icon} size={20} className="text-foreground" />
            </View>
          ))}
          <View className="flex-1" />
          <Text className="pr-2 text-xs text-muted-foreground">오후 2:08</Text>
        </View>
        <View className="gap-2 px-5">
          <View className="flex-row items-center gap-1.5">
            <Icon as={SparklesIcon} size={14} className="text-ai" />
            <Text className="flex-1 text-[13px] font-bold text-ai">찾은 카드 {rows.length}</Text>
            {waiting ? (
              <Pressable onPress={() => setRows((l) => l.map((r) => ({ ...r, state: 'confirmed' })))}>
                <Text className="text-[13px] font-bold text-primary">모두 확인</Text>
              </Pressable>
            ) : null}
          </View>
          <View>
            {rows.map((r, i) => (
              <View key={r.id}>
                {i > 0 ? <Divider /> : null}
                <CardListRow type={r.type} title={r.title} meta={r.meta} state={r.state} onConfirm={() => confirm(r.id)} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-5 pb-6 pt-3">
        <Button className="h-12 rounded-lg">
          <Text className="text-[15px]">메모와 카드 {kept}장 저장</Text>
        </Button>
      </View>
    </View>
  );
}

// ---------- AI 채팅 ----------

export function ChatScreen({ state = 'normal' }: { state?: 'normal' | 'thinking' }) {
  const [rows, setRows] = React.useState<Found[]>(FOUND.slice(0, 2));
  const [ask, setAsk] = React.useState('');
  const confirm = (id: string) => setRows((l) => l.map((r) => (r.id === id ? { ...r, state: 'confirmed' } : r)));
  return (
    <View className="flex-1">
      <TopBar
        title="AI에게 묻기"
        right={
          <View className="flex-row items-center gap-4">
            <Icon as={HistoryIcon} size={20} className="text-foreground" />
            <Icon as={MoreHorizontalIcon} size={20} className="text-foreground" />
          </View>
        }
      />
      <ScrollView contentContainerClassName="gap-3.5 px-4 pb-4 pt-4">
        <DateDivider label="오늘 오후 2:10" />
        <UserBubble>내일 3시 민수랑 강남에서 기획 회의. 그 전에 견적서 보내야 함</UserBubble>
        <AiMessage>
          <AiText>메모에서 카드 2장을 찾았어요.</AiText>
          <View>
            {rows.map((r, i) => (
              <View key={r.id}>
                {i > 0 ? <Divider /> : null}
                <CardListRow type={r.type} title={r.title} meta={r.meta} state={r.state} onConfirm={() => confirm(r.id)} />
              </View>
            ))}
          </View>
          <Sources items={['메모 14:08']} />
        </AiMessage>
        <UserBubble>이번 주에 민수랑 뭐 하기로 했었지?</UserBubble>
        {state === 'thinking' ? (
          <Thinking label="카드와 문서를 찾는 중" />
        ) : (
          <AiMessage>
            <AiText>이번 주 민수 님과 관련된 카드는 3장이에요. 내일 기획 회의가 있고, 그 전에 견적서를 보내기로 했어요.</AiText>
            <Sources items={['기획 회의 카드', '회의록 10/21']} />
            <AiNotice />
          </AiMessage>
        )}
      </ScrollView>
      <View className="pb-2">
        <ScrollChips
          items={[
            { key: 'draft', label: '업무일지 초안' },
            { key: 'today', label: '오늘 정리' },
            { key: 'slot', label: '빈 시간 찾기' },
            { key: 'week', label: '이번 주 돌아보기' },
          ]}
          active={ask}
          onChange={setAsk}
        />
      </View>
      <Composer />
    </View>
  );
}

// ---------- 세션 (자료함) ----------
// 폴더처럼 펼치고 접는 목록이에요. 양식이 폴더이고 그 안에 문서가 있어요.
// 가져온 것: 클로바노트 폴더 화면(전체 노트 아래 폴더, 공유 받은, 공유한, 휴지통, 더하기 버튼),
// personal-memo 의 폴더 트리(펼치기, 줄 길게 누르기 메뉴, 문서 줄의 저장 상태, 즐겨찾기)

type Doc = { title: string; meta?: string; status?: string; icon?: LucideIcon; todo?: boolean; shared?: boolean };
const FOLDERS: { key: string; name: string; icon: LucideIcon; docs: Doc[]; more: number }[] = [
  {
    key: 'work',
    name: '업무일지',
    icon: LayoutTemplateIcon,
    more: 10,
    docs: [
      { title: '업무일지 10/24', status: '고치는 중' },
      { title: '업무일지 10/23', meta: '어제' },
    ],
  },
  {
    key: 'meet',
    name: '회의록',
    icon: AlignLeftIcon,
    more: 5,
    docs: [
      { title: '주간 회의 10/24', meta: '오늘', icon: MicIcon },
      { title: '기획 회의 10/21', meta: '3일 전' },
      { title: '회의실 예약하기', meta: '내일까지', todo: true },
    ],
  },
  { key: 'blog', name: '블로그', icon: ImageIcon, more: 3, docs: [{ title: '가을 카페 투어 3곳', meta: '3일 전', shared: true }] },
  { key: 'paper', name: '연구논문', icon: FileTextIcon, more: 0, docs: [{ title: '추천 시스템 정리', meta: '2주 전' }] },
];

export function SessionsScreen({ sheet = false }: { sheet?: boolean }) {
  const [all, setAll] = React.useState(true);
  const [open, setOpen] = React.useState<string[]>(['work', 'meet']);
  const [star, setStar] = React.useState(false);
  const [picked, setPicked] = React.useState<string | null>(sheet ? '업무일지' : null);
  const [todo, setTodo] = React.useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOpen((l) => (l.includes(k) ? l.filter((x) => x !== k) : [...l, k]));
  return (
    <View className="flex-1">
      <View className="h-14 flex-row items-center pl-5 pr-2">
        <Text className="flex-1 text-xl font-bold tracking-tight text-foreground">세션</Text>
        <View className="h-11 w-11 items-center justify-center">
          <Icon as={SearchIcon} size={22} className="text-foreground" />
        </View>
      </View>
      <ScrollView contentContainerClassName="px-4 pb-28 pt-1">
        <TreeRow icon={StarIcon} label="즐겨찾기" strong expanded={star} onPress={() => setStar((v) => !v)} />
        {star ? (
          <>
            <TreeRow icon={FileTextIcon} label="업무일지 10/24" depth={1} status="고치는 중" />
            <TreeRow icon={FileTextIcon} label="출시 점검 목록" depth={1} meta="2일 전" />
          </>
        ) : null}

        <TreeRow icon={InboxIcon} label="전체 문서" strong count={24} expanded={all} onPress={() => setAll((v) => !v)} onAdd={() => {}} />
        {all
          ? FOLDERS.map((f) => {
              const on = open.includes(f.key);
              return (
                <View key={f.key}>
                  <TreeRow
                    icon={on ? FolderOpenIcon : FolderIcon}
                    label={f.name}
                    depth={1}
                    count={f.docs.length + f.more}
                    expanded={on}
                    selected={picked === f.name}
                    onPress={() => toggle(f.key)}
                    onLongPress={() => setPicked(f.name)}
                  />
                  {on ? (
                    <>
                      {f.docs.map((d) => (
                        <TreeRow
                          key={d.title}
                          icon={d.icon ?? FileTextIcon}
                          label={d.title}
                          depth={2}
                          meta={d.meta}
                          status={d.status}
                          shared={d.shared}
                          done={d.todo ? !!todo[d.title] : undefined}
                          onToggleDone={() => setTodo((t) => ({ ...t, [d.title]: !t[d.title] }))}
                        />
                      ))}
                      {f.more ? (
                        <View className="h-11 justify-center" style={{ paddingLeft: 4 + 2 * 24 + 32 }}>
                          <Text className="text-[13px] font-bold text-primary">{f.more}개 더 보기</Text>
                        </View>
                      ) : null}
                    </>
                  ) : null}
                </View>
              );
            })
          : null}

        <TreeRow icon={FilePlusIcon} label="미지정" strong count={2} />
        <TreeRow icon={UserRoundCheckIcon} label="공유됨" strong count={1} />
        <TreeRow icon={Share2Icon} label="공유한 문서" strong />
        <TreeRow icon={Trash2Icon} label="휴지통" strong />
      </ScrollView>
      <View className="absolute bottom-5 right-5">
        <Fab icon={PlusIcon} />
      </View>
      {picked ? (
        <>
          <Pressable onPress={() => setPicked(null)} className="absolute inset-0 bg-black/25" accessibilityLabel="닫기" />
          <View className="absolute bottom-0 left-0 right-0">
            <BottomSheet>
              <Text className="text-xs text-muted-foreground">{picked}</Text>
              <View className="-my-1">
                <ActionRow icon={FilePlusIcon} label="이 양식으로 새 문서" />
                <ActionRow icon={PencilLineIcon} label="이름 바꾸기" />
                <ActionRow icon={StarIcon} label="즐겨찾기에 넣기" />
                <ActionRow icon={Share2Icon} label="공유" />
                <ActionRow icon={Trash2Icon} label="휴지통으로" />
              </View>
            </BottomSheet>
          </View>
        </>
      ) : null}
    </View>
  );
}

/** 폴더 줄을 길게 눌렀을 때 */
export function SessionActionsScreen() {
  return <SessionsScreen sheet />;
}

// ---------- 편집기 ----------
// 가져온 것: 클로바노트 메모 편집(키보드 위 서식 막대),
// personal-memo(저장 상태 네 가지, 구역 접기와 목차, 고친 기록 되돌리기, 문서끼리 잇기, 양식으로 저장, 찾아 바꾸기)

const FORMAT: [LucideIcon, string][] = [
  [Heading1Icon, '큰 제목'],
  [Heading2Icon, '작은 제목'],
  [ListIcon, '목록'],
  [CheckSquareIcon, '체크'],
  [QuoteIcon, '인용'],
  [ImageIcon, '사진'],
];

const SAVE_CYCLE: SaveState[] = ['editing', 'saved', 'local', 'failed'];

export function EditorScreen({ sheet }: { sheet?: 'outline' | 'history' | 'more' }) {
  const [done, setDone] = React.useState(false);
  const [save, setSave] = React.useState(0);
  const [fold, setFold] = React.useState<Record<string, boolean>>({});
  const [open, setOpen] = React.useState<typeof sheet | null>(sheet ?? null);
  const flip = (k: string) => setFold((f) => ({ ...f, [k]: !f[k] }));
  return (
    <View className="flex-1">
      <View className="h-14 flex-row items-center border-b border-border px-2">
        <View className="h-11 w-11 items-center justify-center">
          <Icon as={ChevronLeftIcon} size={24} className="text-foreground" />
        </View>
        <View className="flex-1 flex-row items-center justify-center gap-1">
          <Text className="text-[13px] text-muted-foreground">업무일지</Text>
          <Icon as={ChevronDownIcon} size={14} className="text-muted-foreground" />
        </View>
        <Pressable onPress={() => setOpen('outline')} className="h-11 w-11 items-center justify-center" accessibilityLabel="목차">
          <Icon as={ListTreeIcon} size={20} className="text-foreground" />
        </Pressable>
        <Pressable onPress={() => setOpen('more')} className="h-11 w-11 items-center justify-center" accessibilityLabel="더 보기">
          <Icon as={MoreHorizontalIcon} size={20} className="text-foreground" />
        </Pressable>
      </View>
      <ScrollView contentContainerClassName="gap-4 px-5 pb-8 pt-5">
        <Text className="text-2xl font-bold tracking-tight text-foreground">업무일지 10/24</Text>
        <View className="-mt-2 flex-row items-center gap-3">
          <Text className="text-xs text-muted-foreground">2026. 10. 24. 토</Text>
          <View className="flex-row items-center gap-1">
            <Icon as={SparklesIcon} size={12} className="text-ai" />
            <Text className="text-xs font-bold text-ai">AI 초안</Text>
          </View>
          <SaveStatus state={SAVE_CYCLE[save]} onPress={() => setSave((n) => (n + 1) % SAVE_CYCLE.length)} />
        </View>

        <FoldHeading open={!fold.did} onPress={() => flip('did')}>
          오늘 한 일
        </FoldHeading>
        {!fold.did ? (
          <View className="-mt-1.5 gap-1.5">
            <View className="flex-row gap-2">
              <View className="mt-[9px] h-1.5 w-1.5 rounded-full bg-foreground" />
              <Text className="flex-1 text-base leading-6 text-foreground">API 연동 테스트를 끝냈어요</Text>
            </View>
            <View className="flex-row gap-2">
              <View className="mt-[9px] h-1.5 w-1.5 rounded-full bg-foreground" />
              <Text className="flex-1 text-base leading-6 text-foreground">
                팀 회의에서 정한 것 3개는 <Text className="text-base font-semibold text-primary underline">주간 회의 10/24</Text>에 있어요
              </Text>
            </View>
            <RailCard type="event" title="기획 회의" meta="내일 15:00, 강남" />
          </View>
        ) : null}

        <FoldHeading open={!fold.left} onPress={() => flip('left')}>
          남은 일
        </FoldHeading>
        {!fold.left ? (
          <View className="-mt-1.5">
            <Pressable onPress={() => setDone((v) => !v)} className="flex-row items-center gap-3 py-1.5">
              <View
                className={cn(
                  'h-5 w-5 items-center justify-center rounded border-2',
                  done ? 'border-primary bg-primary' : 'border-input'
                )}>
                {done ? <Icon as={CheckIcon} size={12} className="text-primary-foreground" /> : null}
              </View>
              <Text className={cn('text-base text-foreground', done && 'text-muted-foreground line-through')}>
                로그인 오류 재현 경로 정리
              </Text>
            </Pressable>
            <View className="flex-row items-center gap-3 py-1.5">
              <View className="h-5 w-5 rounded border-2 border-input" />
              <View className="h-5 w-0.5 bg-primary" />
            </View>
          </View>
        ) : null}

        <View className="mt-2 border-t border-border pt-3">
          <DaySectionTitle label="이 문서를 건 곳" count={2} />
          <TreeRow icon={FileTextIcon} label="10월 4주 회고" meta="어제" />
          <TreeRow icon={FileTextIcon} label="출시 점검 목록" meta="2일 전" />
        </View>
      </ScrollView>
      <View className="h-12 flex-row items-center border-t border-border bg-background pl-1 pr-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
          {FORMAT.map(([icon, label]) => (
            <View key={label} className="h-12 w-11 items-center justify-center" accessibilityLabel={label}>
              <Icon as={icon} size={20} className="text-foreground" />
            </View>
          ))}
        </ScrollView>
        <View className="mx-1 h-6 w-px bg-border" />
        <View className="h-12 w-11 items-center justify-center">
          <Icon as={MicIcon} size={20} className="text-foreground" />
        </View>
        <View className="h-12 w-11 items-center justify-center" accessibilityLabel="AI">
          <Icon as={SparklesIcon} size={20} className="text-ai" />
        </View>
      </View>
      {open ? (
        <>
          <Pressable onPress={() => setOpen(null)} className="absolute inset-0 bg-black/25" accessibilityLabel="닫기" />
          <View className="absolute bottom-0 left-0 right-0">
            {open === 'outline' ? (
              <BottomSheet title="목차">
                <View className="-my-1">
                  <OutlineRow label="오늘 한 일" current note="3줄" />
                  <OutlineRow label="기획 회의" level={2} />
                  <OutlineRow label="남은 일" note="2줄" />
                  <OutlineRow label="이슈" note="접힘" />
                  <OutlineRow label="내일 할 일" note="비어 있음" />
                </View>
                <Text className="text-[15px] font-bold text-primary">모두 펼치기</Text>
              </BottomSheet>
            ) : open === 'history' ? (
              <BottomSheet title="고친 기록">
                <View className="-my-1">
                  <HistoryRow when="오후 9:12" who="내가 고침" change="남은 일 1줄 더함" current />
                  <Divider />
                  <HistoryRow when="오후 9:05" who="내가 고침" change="오늘 한 일 2줄 고침" />
                  <Divider />
                  <HistoryRow when="오후 9:01" who="AI 초안" change="카드 7장으로 처음 만듦" />
                </View>
              </BottomSheet>
            ) : (
              <BottomSheet>
                <View className="-my-1">
                  <Pressable onPress={() => setOpen('outline')}>
                    <ActionRow icon={ListTreeIcon} label="목차" />
                  </Pressable>
                  <ActionRow icon={SearchIcon} label="찾아 바꾸기" />
                  <Pressable onPress={() => setOpen('history')}>
                    <ActionRow icon={HistoryIcon} label="고친 기록" />
                  </Pressable>
                  <ActionRow icon={EyeIcon} label="꾸며서 보기" />
                  <ActionRow icon={LayoutTemplateIcon} label="내 양식으로 저장" />
                  <ActionRow icon={StarIcon} label="즐겨찾기에 넣기" />
                  <ActionRow icon={ShareIcon} label="공유" />
                  <ActionRow icon={Trash2Icon} label="휴지통으로" />
                </View>
              </BottomSheet>
            )}
          </View>
        </>
      ) : null}
    </View>
  );
}

export function EditorOutlineScreen() {
  return <EditorScreen sheet="outline" />;
}
export function EditorHistoryScreen() {
  return <EditorScreen sheet="history" />;
}
export function EditorMoreScreen() {
  return <EditorScreen sheet="more" />;
}

// ---------- 해시태그 ----------
// 가져온 것: personal-memo 의 태그 모아 보기. 자료함과 같은 펼치는 목록이에요.

const TAGS: { tag: string; count: number; docs: [LucideIcon, string, string][] }[] = [
  {
    tag: '출시',
    count: 8,
    docs: [
      [FileTextIcon, '출시 점검 목록', '2일 전'],
      [MicIcon, '주간 회의 10/24', '오늘'],
    ],
  },
  { tag: '민수', count: 5, docs: [[FileTextIcon, '기획 회의 10/21', '3일 전']] },
  { tag: '견적서', count: 3, docs: [] },
  { tag: '아이디어', count: 3, docs: [] },
  { tag: '자료구조', count: 2, docs: [] },
];

export function TagsScreen() {
  const [open, setOpen] = React.useState<string[]>(['출시']);
  return (
    <View className="flex-1">
      <TopBar
        title="해시태그"
        right={
          <View className="flex-row items-center">
            <SortButton options={['많이 쓴 순', '최근 쓴 순', '이름순']} />
            <View className="h-11 w-9 items-center justify-center">
              <Icon as={SearchIcon} size={20} className="text-foreground" />
            </View>
          </View>
        }
      />
      <ScrollView contentContainerClassName="px-4 pb-8 pt-1">
        {TAGS.map((t) => {
          const on = open.includes(t.tag);
          return (
            <View key={t.tag}>
              <TreeRow
                icon={HashIcon}
                label={t.tag}
                strong
                count={t.count}
                expanded={on}
                onPress={() => setOpen((l) => (on ? l.filter((x) => x !== t.tag) : [...l, t.tag]))}
              />
              {on
                ? t.docs.map(([icon, title, when]) => <TreeRow key={title} icon={icon} label={title} depth={1} meta={when} />)
                : null}
              {on && t.count > t.docs.length ? (
                <View className="h-11 justify-center" style={{ paddingLeft: 4 + 24 + 32 }}>
                  <Text className="text-[13px] font-bold text-primary">{t.count - t.docs.length}개 더 보기</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------- AI 초안 시트 ----------

const PICK: [CardType, string, number][] = [
  ['event', '일정', 3],
  ['task', '할 일', 2],
  ['person', '사람', 1],
  ['idea', '아이디어', 1],
];

export function DraftScreen() {
  const [form, setForm] = React.useState('work');
  const [off, setOff] = React.useState<string[]>(['idea']);
  const count = PICK.filter(([t]) => !off.includes(t)).reduce((n, [, , c]) => n + c, 0);
  return (
    <View className="flex-1">
      <TopBar title="오늘 카드" back={false} />
      <View className="gap-3 px-5 pt-4 opacity-50">
        <View className="h-8 w-3/5 rounded-full bg-muted" />
        <View className="h-14 rounded-lg bg-muted" />
        <View className="h-14 rounded-lg bg-muted" />
      </View>
      <Scrim />
      <View className="absolute bottom-0 left-0 right-0">
        <BottomSheet title="초안 만들기" icon={SparklesIcon}>
          <View className="gap-2">
            <Text className="text-[13px] font-bold text-muted-foreground">양식</Text>
            <View className="-mx-5">
              <ScrollChips
                items={[
                  { key: 'work', label: '업무일지' },
                  { key: 'meet', label: '회의록' },
                  { key: 'review', label: '주간 회고' },
                  { key: 'blog', label: '블로그' },
                  { key: 'mine', label: '내 양식 2' },
                ]}
                active={form}
                onChange={setForm}
              />
            </View>
          </View>
          <View className="gap-1">
            <Text className="text-[13px] font-bold text-muted-foreground">보낼 카드 {count}</Text>
            <View>
              {PICK.map(([type, label, n], i) => {
                const on = !off.includes(type);
                return (
                  <Pressable
                    key={type}
                    onPress={() => setOff((l) => (on ? [...l, type] : l.filter((x) => x !== type)))}
                    className={cn('h-12 flex-row items-center gap-3', i > 0 && 'border-t border-border')}>
                    <View
                      className={cn(
                        'h-6 w-6 items-center justify-center rounded-full border-2',
                        on ? 'border-primary bg-primary' : 'border-input bg-background'
                      )}>
                      {on ? <Icon as={CheckIcon} size={13} className="text-primary-foreground" /> : null}
                    </View>
                    <TypeChip type={type} className="self-center" />
                    <Text className={cn('flex-1 text-[15px]', on ? 'text-popover-foreground' : 'text-muted-foreground')}>
                      {label} {n}장
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View className="h-12 justify-center rounded-lg border border-input px-3">
            <Text className="text-[15px] text-muted-foreground">더 바라는 점 (안 써도 돼요)</Text>
          </View>
          <View className="gap-2">
            <Button className="h-12 rounded-lg bg-ai">
              <Icon as={SparklesIcon} size={16} className="text-ai-foreground" />
              <Text className="text-[15px] text-ai-foreground">초안 만들기</Text>
            </Button>
            <Text className="text-center text-xs text-muted-foreground">오늘 12번 남음</Text>
          </View>
        </BottomSheet>
      </View>
    </View>
  );
}

// ---------- 피드 ----------

function Post({
  initial,
  name,
  meta,
  title,
  body,
  photo = false,
  ai = false,
  likes,
  comments,
}: {
  initial: string;
  name: string;
  meta: string;
  title: string;
  body: string;
  photo?: boolean;
  ai?: boolean;
  likes: number;
  comments: number;
}) {
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  return (
    <View className="gap-2.5 py-4">
      <View className="flex-row items-center gap-2.5">
        <Avatar alt={name} className="size-9">
          <AvatarFallback className="bg-secondary-soft">
            <Text className="text-sm font-bold text-secondary">{initial}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-foreground">{name}</Text>
          <Text className="text-xs text-muted-foreground">{meta}</Text>
        </View>
        <Icon as={MoreHorizontalIcon} size={18} className="text-muted-foreground" />
      </View>
      <View className="flex-row gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-base font-bold text-foreground">{title}</Text>
          <Text numberOfLines={2} className="text-[13px] leading-5 text-muted-foreground">
            {body}
          </Text>
        </View>
        {photo ? (
          <View className="h-[60px] w-[60px] items-center justify-center rounded-md bg-muted">
            <Icon as={ImageIcon} size={18} className="text-muted-foreground" />
          </View>
        ) : null}
      </View>
      <View className="flex-row items-center gap-4">
        <Pressable onPress={() => setLiked((v) => !v)} className="h-9 flex-row items-center gap-1.5">
          <Icon as={HeartIcon} size={18} className={liked ? 'text-secondary' : 'text-foreground'} />
          <Text className="text-[13px] text-foreground">{likes + (liked ? 1 : 0)}</Text>
        </Pressable>
        <View className="h-9 flex-row items-center gap-1.5">
          <Icon as={MessageSquareIcon} size={18} className="text-foreground" />
          <Text className="text-[13px] text-foreground">{comments}</Text>
        </View>
        {ai ? (
          <View className="h-6 flex-row items-center gap-1 rounded-full bg-ai-soft px-2">
            <Icon as={SparklesIcon} size={11} className="text-ai" />
            <Text className="text-[11px] font-bold text-ai">AI 초안에서 고침</Text>
          </View>
        ) : null}
        <View className="flex-1" />
        <Pressable onPress={() => setSaved((v) => !v)} className="h-9 w-9 items-center justify-center" accessibilityLabel="저장">
          <Icon as={BookmarkIcon} size={18} className={saved ? 'text-primary' : 'text-foreground'} />
        </Pressable>
      </View>
    </View>
  );
}

export function FeedScreen() {
  const [kind, setKind] = React.useState('all');
  return (
    <View className="flex-1">
      <View className="h-14 flex-row items-center pl-5 pr-2">
        <Text className="flex-1 text-xl font-bold tracking-tight text-foreground">피드</Text>
        <View className="h-11 w-11 items-center justify-center">
          <Icon as={SearchIcon} size={22} className="text-foreground" />
        </View>
      </View>
      <View className="pb-1">
        <ScrollChips
          items={[
            { key: 'all', label: '전체' },
            { key: 'team', label: '우리 팀' },
            { key: 'work', label: '업무일지' },
            { key: 'blog', label: '블로그' },
            { key: 'saved', label: '저장한 글', count: 2 },
          ]}
          active={kind}
          onChange={setKind}
        />
      </View>
      <ScrollView contentContainerClassName="px-5 pb-8">
        <Post
          initial="민"
          name="민서"
          meta="블로그, 2시간 전"
          title="가을 카페 투어 3곳"
          body="성수에서 시작해 망원까지, 창가 자리가 좋은 카페 세 곳을 다녀왔어요."
          photo
          ai
          likes={12}
          comments={3}
        />
        <Divider />
        <Post
          initial="지"
          name="지우"
          meta="업무일지, 어제"
          title="10월 23일 업무일지"
          body="로그인 오류 원인을 찾았어요. 토큰이 만료된 뒤 다시 받는 순서가 꼬여 있었어요."
          likes={4}
          comments={1}
        />
        <Divider />
        <Post
          initial="현"
          name="현우"
          meta="회의록, 2일 전"
          title="기획 회의 10/21"
          body="출시 범위를 줄이고 받아쓰기부터 내기로 했어요."
          ai
          likes={7}
          comments={5}
        />
      </ScrollView>
      <TabBar active="feed" />
    </View>
  );
}

// ---------- 검색 ----------

function Hit({ before, hit, after }: { before?: string; hit: string; after?: string }) {
  return (
    <Text numberOfLines={1} className="text-xs text-muted-foreground">
      {before}
      <Text className="bg-primary-soft text-xs font-bold text-primary-soft-foreground">{hit}</Text>
      {after}
    </Text>
  );
}

export function SearchScreen() {
  const [tab, setTab] = React.useState('all');
  const show = (k: string) => tab === 'all' || tab === k;
  return (
    <View className="flex-1">
      <View className="h-14 flex-row items-center gap-2 px-3">
        <View className="h-10 flex-1 flex-row items-center gap-2 rounded-full bg-muted px-3.5">
          <Icon as={SearchIcon} size={17} className="text-muted-foreground" />
          <Text className="flex-1 text-[17px] text-foreground">민수</Text>
          <View className="h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/40">
            <Icon as={XIcon} size={12} className="text-background" />
          </View>
        </View>
        <View className="h-11 w-11 items-center justify-center">
          <Icon as={SlidersHorizontalIcon} size={20} className="text-foreground" />
        </View>
      </View>
      <CountTabs
        items={[
          { key: 'all', label: '전체', count: 6 },
          { key: 'card', label: '카드', count: 3 },
          { key: 'doc', label: '문서', count: 2 },
          { key: 'rec', label: '녹음', count: 1 },
        ]}
        active={tab}
        onChange={setTab}
      />
      <ScrollView contentContainerClassName="gap-4 px-5 pb-8 pt-4">
        {show('card') ? (
          <View className="gap-1">
            <DaySectionTitle label="카드" count={3} />
            <RailCard type="person" title="민수" meta="카드 3장에 나와요" />
            <Divider />
            <RailCard type="event" title="기획 회의" meta="내일 15:00, 강남, 민수" />
            <Divider />
            <RailCard type="task" title="견적서 보내기" meta="민수에게, 금요일까지" />
          </View>
        ) : null}
        {show('doc') ? (
          <View className="gap-1">
            <DaySectionTitle label="문서" count={2} />
            <View className="flex-row items-center gap-3 py-3">
              <Icon as={AlignLeftIcon} size={20} className="text-muted-foreground" />
              <View className="flex-1 gap-0.5">
                <Text className="text-[15px] font-semibold text-foreground">회의록 10/21</Text>
                <Hit before="견적서는 " hit="민수" after=" 님이 금요일까지" />
              </View>
              <Text className="text-[11px] text-muted-foreground">3일 전</Text>
            </View>
            <Divider />
            <View className="flex-row items-center gap-3 py-3">
              <Icon as={LayoutTemplateIcon} size={20} className="text-muted-foreground" />
              <View className="flex-1 gap-0.5">
                <Text className="text-[15px] font-semibold text-foreground">업무일지 10/20</Text>
                <Hit hit="민수" after="와 점심, 출시 일정 이야기" />
              </View>
              <Text className="text-[11px] text-muted-foreground">4일 전</Text>
            </View>
          </View>
        ) : null}
        {show('rec') ? (
          <View className="gap-1">
            <DaySectionTitle label="녹음" count={1} />
            <View className="flex-row items-center gap-3 py-3">
              <Icon as={MicIcon} size={20} className="text-muted-foreground" />
              <View className="flex-1 gap-0.5">
                <Text className="text-[15px] font-semibold text-foreground">주간 회의 10/24</Text>
                <Hit before="03:41 견적서는 " hit="민수" after=" 님이" />
              </View>
              <Text className="text-[11px] text-muted-foreground">오늘</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
      <TabBar active="search" />
    </View>
  );
}

// ---------- 시간 잡기 ----------

const SLOTS = [
  { time: '목 10:00 ~ 12:00', fit: 'good' as const, score: 86, reason: '회의 사이 빈 시간이에요. 오전 집중 작업은 8번 중 6번 끝냈어요' },
  { time: '금 09:00 ~ 11:00', fit: 'ok' as const, score: 71, reason: '마감 날 오전이에요. 뒤에 여유가 1시간 있어요' },
  { time: '목 16:00 ~ 18:00', fit: 'tight' as const, score: 48, reason: '오후 4시 뒤에 잡은 일은 2번 다 못 했어요' },
];

export function SlotScreen() {
  const [picked, setPicked] = React.useState(0);
  const [day, setDay] = React.useState('week');
  return (
    <View className="flex-1">
      <TopBar title="시간 잡기" />
      <ScrollView contentContainerClassName="gap-4 pb-28 pt-2">
        <View className="px-5">
          <RailCard type="task" title="제안서 초안 작성" meta="2시간, 금요일까지" />
        </View>
        <ScrollChips
          items={[
            { key: 'today', label: '오늘' },
            { key: 'tomorrow', label: '내일' },
            { key: 'week', label: '이번 주' },
            { key: 'pick', label: '직접 고르기' },
          ]}
          active={day}
          onChange={setDay}
        />
        <View className="gap-2 px-5">
          <View className="flex-row items-center gap-1.5">
            <Icon as={SparklesIcon} size={14} className="text-ai" />
            <Text className="flex-1 text-[13px] font-bold text-ai">겹치지 않는 시간 3개</Text>
            <Text className="text-[13px] font-bold text-primary">다른 시간</Text>
          </View>
          {SLOTS.map((s, i) => (
            <SlotOption key={s.time} {...s} selected={picked === i} onPress={() => setPicked(i)} />
          ))}
        </View>
        <View className="px-5">
          <Divider />
          <View className="h-12 flex-row items-center justify-between">
            <Text className="text-[15px] text-foreground">저장할 캘린더</Text>
            <View className="flex-row items-center gap-1.5">
              <AccountDot account={1} />
              <Text className="text-sm text-muted-foreground">회사</Text>
              <Icon as={ChevronDownIcon} size={16} className="text-muted-foreground" />
            </View>
          </View>
          <Divider />
          <View className="h-12 flex-row items-center justify-between">
            <Text className="text-[15px] text-foreground">1시간씩 나눠 잡기</Text>
            <Text className="text-sm text-muted-foreground">안 함</Text>
          </View>
          <Divider />
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-5 pb-6 pt-3">
        <Button className="h-12 rounded-lg">
          <Text className="text-[15px]">{SLOTS[picked].time}에 저장</Text>
        </Button>
      </View>
    </View>
  );
}

// ---------- 수행 확인 시트 ----------
// 대부분은 동그라미 한 번으로 끝나요. 줄을 누르면 4가지 선택이 펼쳐지고, 부분이나 못 함을 고르면 한 번 더 물어요.
// 가져온 것: 네이버 캘린더의 목록에서 바로 체크, 절반과 전부 달성 때 알려 주기

const TODAY: [string, string][] = [
  ['제안서 초안 작성', '10:00'],
  ['기획 회의', '14:00'],
  ['API 연동 테스트', '16:00'],
  ['디자인 리뷰', '17:00'],
];

export function CheckInScreen() {
  const [value, setValue] = React.useState<Record<string, Status | undefined>>({
    '제안서 초안 작성': 'partial',
    '기획 회의': 'done',
    'API 연동 테스트': 'missed',
  });
  const [why, setWhy] = React.useState<Record<string, string | undefined>>({ '제안서 초안 작성': '1시간 더 필요' });
  const [open, setOpen] = React.useState<string | null>('API 연동 테스트');
  const answered = TODAY.filter(([t]) => value[t]).length;
  const doneCount = TODAY.filter(([t]) => value[t] === 'done').length;
  const all = answered === TODAY.length;
  return (
    <View className="flex-1">
      <HomeScreen quickTools={false} />
      <Scrim />
      <View className="absolute bottom-0 left-0 right-0">
        <BottomSheet>
          <View className="gap-2.5">
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="text-xs text-muted-foreground">저녁 9:00</Text>
                <Text className="text-xl font-bold text-popover-foreground">오늘 한 일 확인</Text>
              </View>
              {all ? (
                <Text className="text-[13px] font-bold text-primary">
                  {doneCount}개 끝냄
                </Text>
              ) : (
                <Pressable
                  hitSlop={10}
                  onPress={() => {
                    setValue((v) => Object.fromEntries(TODAY.map(([t]) => [t, v[t] ?? 'done'])));
                    setOpen(null);
                  }}>
                  <Text className="text-[13px] font-bold text-primary">남은 {TODAY.length - answered}개 모두 완료</Text>
                </Pressable>
              )}
            </View>
            <View className="h-1 flex-row gap-1">
              {TODAY.map(([t]) => (
                <View key={t} className={cn('flex-1 rounded-full', value[t] ? 'bg-primary' : 'bg-muted')} />
              ))}
            </View>
          </View>
          <View>
            {TODAY.map(([title, time], i) => {
              const v = value[title];
              const on = open === title;
              const ask = v ? FOLLOW_UP[v] : undefined;
              return (
                <View key={title} className={cn(i > 0 && 'border-t border-border', on && 'pb-3')}>
                  <TaskCheckRow
                    flat
                    title={title}
                    meta={why[title] && v !== 'done' ? `${time}, ${why[title]}` : time}
                    status={v}
                    onToggle={() => {
                      setValue((x) => ({ ...x, [title]: x[title] === 'done' ? undefined : 'done' }));
                      setOpen(null);
                    }}
                    onPress={() => setOpen(on ? null : title)}
                  />
                  {on ? (
                    <View className="gap-2.5 pl-9">
                      <StatusPicker
                        value={v}
                        onChange={(s) => {
                          setValue((x) => ({ ...x, [title]: s }));
                          setWhy((x) => ({ ...x, [title]: undefined }));
                          if (!FOLLOW_UP[s]) setOpen(null);
                        }}
                      />
                      {ask ? (
                        <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1">
                          <Text className="text-[13px] text-muted-foreground">{ask.label}</Text>
                          {ask.options.map((o) => (
                            <Pressable
                              key={o}
                              hitSlop={8}
                              onPress={() => {
                                setWhy((x) => ({ ...x, [title]: o }));
                                setOpen(null);
                              }}>
                              <Text
                                className={cn(
                                  'text-[15px]',
                                  why[title] === o ? 'font-bold text-primary' : 'text-foreground'
                                )}>
                                {o}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] text-muted-foreground">나중에</Text>
            <Button className="h-11 rounded-lg px-6" disabled={answered === 0}>
              <Text>{all ? '저장' : `${answered}개만 저장`}</Text>
            </Button>
          </View>
        </BottomSheet>
      </View>
    </View>
  );
}
