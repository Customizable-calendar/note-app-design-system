import { ExtractedCard, TypeChip } from '@/components/app/cards';
import { TopBar } from '@/components/app/navigation';
import { BottomSheet, Scrim, SlashMenu } from '@/components/app/overlays';
import {
  AiMessage,
  AiText,
  CardExtractBlock,
  Composer,
  DateDivider,
  Sources,
  SuggestionChips,
  Thinking,
  UserBubble,
} from '@/components/chat/chat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  CheckSquareIcon,
  ImageIcon,
  LockIcon,
  MicIcon,
  ShareIcon,
  SlashIcon,
  SparklesIcon,
  SquareIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export function EditorScreen() {
  return (
    <View className="flex-1">
      <TopBar title="업무일지 세션" center right={<Icon as={ShareIcon} size={20} className="text-foreground" />} />
      <ScrollView contentContainerClassName="gap-4 px-5 pb-6 pt-5">
        <View className="self-start rounded-full bg-primary-soft px-3 py-1">
          <Text className="text-xs font-bold text-primary-soft-foreground">업무일지 테마</Text>
        </View>
        <Text className="text-[28px] font-bold tracking-tight text-foreground">업무일지 10/24</Text>
        <View className="gap-2">
          <View className="flex-row items-center">
            <Text className="w-20 text-sm text-muted-foreground">날짜</Text>
            <Text className="text-sm text-foreground">2026-10-24 (토)</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="w-20 text-sm text-muted-foreground">작성</Text>
            <Badge variant="outline" className="border-primary">
              <Text className="font-bold text-primary">AI 초안</Text>
            </Badge>
            <Text className="ml-1.5 text-sm text-foreground">+ 직접 수정</Text>
          </View>
        </View>
        <Text className="text-lg font-bold text-foreground">오늘 한 일</Text>
        <View className="-mt-1 gap-1.5">
          <Text className="text-[15px] text-foreground">•  API 연동 테스트 완료</Text>
          <Text className="text-[15px] text-foreground">
            •  팀 회의 — 결정 사항 3개 (<Text className="text-[15px] text-primary underline">회의록 10/24</Text>)
          </Text>
        </View>
        <View className="gap-2 rounded-lg border border-border bg-card p-3">
          <View className="flex-row items-center gap-2">
            <TypeChip type="event" />
            <Text className="text-xs text-muted-foreground">카드 블록</Text>
          </View>
          <Text className="text-[15px] font-bold text-card-foreground">기획 회의 · 내일 15:00</Text>
        </View>
        <Text className="text-lg font-bold text-foreground">이슈</Text>
        <View className="-mt-1 flex-row items-center gap-3">
          <Checkbox checked={false} onCheckedChange={() => {}} />
          <Text className="text-[15px] text-foreground">로그인 오류 재현 경로 정리</Text>
        </View>
        <Text className="text-lg font-bold text-primary">/카드</Text>
        <SlashMenu
          groups={[
            {
              title: '추천',
              items: [
                { icon: SquareIcon, label: '카드 넣기', hint: '오늘 확인한 카드 7장', selected: true },
                { icon: SparklesIcon, label: 'AI 초안', ai: true },
              ],
            },
            {
              title: '입력',
              items: [
                { icon: MicIcon, label: '녹음' },
                { icon: CalendarIcon, label: '캘린더' },
              ],
            },
          ]}
        />
      </ScrollView>
      <View className="h-16 flex-row items-center justify-around border-t border-border bg-muted/50">
        <Icon as={SlashIcon} size={22} className="text-foreground" />
        <Icon as={MicIcon} size={22} className="text-foreground" />
        <View className="h-12 w-12 items-center justify-center rounded-full bg-ai">
          <Icon as={SparklesIcon} size={22} className="text-ai-foreground" />
        </View>
        <Icon as={ImageIcon} size={22} className="text-foreground" />
        <Icon as={CheckSquareIcon} size={22} className="text-foreground" />
      </View>
    </View>
  );
}

export function DraftScreen() {
  const [picked, setPicked] = React.useState<string[]>(['일정 3', '할 일 2', '사람 1']);
  const chips = ['일정 3', '할 일 2', '사람 1', '아이디어 1', '녹음 원문'];
  return (
    <View className="flex-1">
      <TopBar title="업무일지 10/24" />
      <View className="gap-3 px-5 pt-5 opacity-50">
        <Text className="text-[28px] font-bold text-foreground">업무일지 10/24</Text>
        <Text className="text-sm text-muted-foreground">날짜 2026-10-24 (토)</Text>
        <View className="h-3 w-3/5 rounded-full bg-muted" />
        <View className="h-3 w-2/5 rounded-full bg-muted" />
      </View>
      <Scrim />
      <View className="absolute bottom-0 left-0 right-0">
        <BottomSheet title="AI 초안" icon={SparklesIcon}>
          <Text className="text-sm text-muted-foreground">무엇을 써드릴까요?</Text>
          <View className="min-h-[72px] rounded-lg border border-input bg-background p-3">
            <Text className="text-[15px] text-foreground">오늘 업무일지 초안 써줘</Text>
          </View>
          <Text className="text-sm text-muted-foreground">사용할 카드 · 확인한 카드만 보내요</Text>
          <View className="flex-row flex-wrap gap-2">
            {chips.map((c) => {
              const on = picked.includes(c);
              return (
                <Button
                  key={c}
                  size="sm"
                  variant={on ? 'soft' : 'outline'}
                  className={cn('h-9 rounded-full px-3.5', on && 'border-[1.5px] border-primary')}
                  onPress={() => setPicked((p) => (on ? p.filter((x) => x !== c) : [...p, c]))}>
                  <Text className="text-[13px]">{c}</Text>
                </Button>
              );
            })}
          </View>
          <Button size="lg" className="h-12 rounded-lg">
            <Text className="text-[15px] font-bold">초안 만들기</Text>
          </Button>
          <Text className="text-center text-xs text-muted-foreground">예상 1,200 토큰 · Claude · 내 API 키 사용</Text>
        </BottomSheet>
      </View>
    </View>
  );
}

const WAVE = [14, 28, 44, 26, 52, 36, 20, 46, 32, 58, 30, 42, 18, 50, 34, 24, 44, 28, 16, 36, 22, 12];

export function RecordScreen() {
  return (
    <View className="flex-1">
      <View className="h-14 flex-row items-center gap-3 px-4">
        <Icon as={XIcon} size={22} className="text-foreground" />
        <Text className="text-base font-bold text-foreground">녹음</Text>
      </View>
      <View className="items-center gap-2 pt-6">
        <View className="flex-row items-center gap-1.5">
          <View className="h-2.5 w-2.5 rounded-full bg-secondary" />
          <Text className="text-sm font-bold text-secondary">녹음 중</Text>
        </View>
        <Text className="text-[52px] font-bold tracking-tight text-foreground">03:42</Text>
        <Text className="text-sm text-muted-foreground">저장 위치 · 회의록 세션</Text>
      </View>
      <View className="h-28 flex-row items-center justify-center gap-[5px]">
        {WAVE.map((h, i) => (
          <View key={i} className="w-[5px] rounded-full bg-primary" style={{ height: h * 1.2 }} />
        ))}
      </View>
      <View className="items-center gap-3">
        <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary-soft">
          <View className="h-7 w-7 rounded-md bg-primary" />
        </View>
        <Text className="text-sm text-muted-foreground">정지하면 회의록 양식으로 정리되고 카드도 뽑아요</Text>
      </View>
      <View className="gap-2 px-6 pt-8">
        <Text className="text-sm font-bold text-muted-foreground">받아쓰기 미리보기</Text>
        <View className="rounded-xl border border-border p-4">
          <Text className="text-[15px] leading-7 text-foreground">
            …그래서 API 연동은 다음 주 목요일까지 마무리하기로 하고, 로그인 오류는 재현 경로부터 정리해서 공유하기로…
          </Text>
        </View>
      </View>
    </View>
  );
}

export function SettingsScreen() {
  const [model, setModel] = React.useState('claude');
  const [cal, setCal] = React.useState(true);
  const [slack, setSlack] = React.useState(false);
  return (
    <View className="flex-1">
      <TopBar title="설정" />
      <ScrollView contentContainerClassName="gap-3 px-5 pb-8 pt-5">
        <Text className="text-sm font-bold text-muted-foreground">AI 모델</Text>
        <RadioGroup value={model} onValueChange={setModel} className="gap-0 overflow-hidden rounded-xl border border-border">
          {[
            ['claude', 'Claude'],
            ['openai', 'OpenAI'],
            ['gemini', 'Gemini'],
          ].map(([v, l], i) => (
            <View key={v} className={cn('flex-row items-center px-4 py-3.5', i && 'border-t border-border')}>
              <Text className="flex-1 text-[15px] text-foreground">{l}</Text>
              <RadioGroupItem value={v} aria-label={l} />
            </View>
          ))}
        </RadioGroup>
        <Text className="mt-2 text-sm font-bold text-muted-foreground">내 API 키</Text>
        <View className="h-12 justify-center rounded-lg border border-input px-3.5">
          <Text className="text-[15px] tracking-widest text-foreground">••••••••••••••••••••</Text>
        </View>
        <View className="flex-row items-start gap-2">
          <Icon as={LockIcon} size={14} className="mt-0.5 text-primary" />
          <Text className="flex-1 text-xs leading-5 text-muted-foreground">
            키는 이 기기의 보안 저장소에만 저장되고 서버로 보내지 않아요.
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted-foreground">이번 달 사용량</Text>
          <Text className="text-sm font-bold text-foreground">31만 / 한도 100만 토큰</Text>
        </View>
        <Progress value={31} className="bg-muted" indicatorClassName="bg-primary" />
        <Text className="mt-3 text-sm font-bold text-muted-foreground">외부 연동</Text>
        <View className="overflow-hidden rounded-xl border border-border">
          <View className="flex-row items-center px-4 py-3.5">
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-foreground">Google Calendar</Text>
              <Text className="text-xs text-muted-foreground">연결됨 · 양방향 동기화</Text>
            </View>
            <Switch checked={cal} onCheckedChange={setCal} />
          </View>
          <View className="flex-row items-center border-t border-border px-4 py-3.5">
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-foreground">Slack</Text>
              <Text className="text-xs text-muted-foreground">연결 안 됨</Text>
            </View>
            <Switch checked={slack} onCheckedChange={setSlack} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export function CaptureScreen() {
  return (
    <View className="flex-1">
      <TopBar title="빠른 입력" right={<Text className="text-[13px] font-bold text-primary">모두 확인</Text>} />
      <ScrollView contentContainerClassName="gap-3.5 px-5 pb-8 pt-5">
        <View className="min-h-[110px] rounded-lg border border-input p-3.5">
          <Text className="text-base leading-7 text-foreground">
            내일 3시 민수랑 강남에서 기획 회의. 그 전에 견적서 보내야 함. 카페 창업 아이디어도 나중에 정리하기
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <Icon as={SparklesIcon} size={15} className="text-ai" />
            <Text className="text-[13px] font-bold text-ai">AI가 찾은 카드 4장</Text>
          </View>
          <Text className="text-xs text-muted-foreground">확인한 카드만 저장돼요</Text>
        </View>
        <ExtractedCard type="event" title="기획 회의" meta="내일 15:00 · 강남 · 민수" />
        <ExtractedCard type="task" title="견적서 보내기" meta="기획 회의 전에" />
        <ExtractedCard
          type="person"
          title="민수"
          meta="처음 보는 이름이에요. 사람 목록에 추가할까요?"
          actions={[{ label: '추가', primary: true }, { label: '사람 아님' }]}
        />
        <ExtractedCard type="idea" title="카페 창업 아이디어" state="confirmed" />
      </ScrollView>
    </View>
  );
}

export function ChatScreen({ state = 'normal' }: { state?: 'normal' | 'thinking' }) {
  return (
    <View className="flex-1">
      <TopBar
        title="AI에게 묻기"
        right={<Text className="text-xs text-muted-foreground">카드 · 문서 기반</Text>}
      />
      <ScrollView contentContainerClassName="gap-3.5 px-4 pb-4 pt-4">
        <DateDivider label="오늘 오후 2:10" />
        <UserBubble>내일 3시 민수랑 강남에서 기획 회의. 그 전에 견적서 보내야 함</UserBubble>
        <AiMessage>
          <AiText>메모에서 카드 2장을 찾았어요. 확인한 카드만 저장할게요.</AiText>
          <CardExtractBlock
            cards={[
              { type: 'event', title: '기획 회의', meta: '내일 15:00 · 강남 · 민수' },
              { type: 'task', title: '견적서 보내기', meta: '기획 회의 전에' },
            ]}
          />
          <Sources items={['메모 · 14:08']} />
        </AiMessage>
        <SuggestionChips items={['업무일지 초안 만들기', '캘린더에 추가']} />
        <UserBubble>이번 주에 민수랑 뭐 하기로 했었지?</UserBubble>
        {state === 'thinking' ? (
          <Thinking label="카드와 문서를 찾는 중" />
        ) : (
          <AiMessage>
            <AiText>이번 주 민수 님과 관련된 카드는 3장이에요. 내일 기획 회의가 있고, 그 전에 견적서를 보내기로 했어요.</AiText>
            <Sources items={['기획 회의 카드', '회의록 10/21']} />
          </AiMessage>
        )}
      </ScrollView>
      <Composer />
    </View>
  );
}
