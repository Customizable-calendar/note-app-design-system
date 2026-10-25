import {
  AiMessage,
  AiText,
  Composer,
  ErrorNotice,
  SuggestionChips,
  Thinking,
  UserBubble,
} from '@/components/chat/chat';
import { ChoiceRow, ColorField, PanelSection, SwitchRow } from '@/components/ds/controls';
import { Phone } from '@/components/ds/frame';
import { ThemeScope } from '@/components/ds/theme-scope';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useDesign } from '@/lib/design/store';
import type { AiDesign } from '@/lib/design/tokens';
import { ChatScreen } from '@/screens/flows';
import { MainSection, Sheet, Workspace } from '@/views/workspace';
import { SparklesIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

function ChatPanel() {
  const { state, setAi } = useDesign();
  const ai = state.ai;
  const pick =
    <K extends keyof AiDesign>(key: K) =>
    (v: AiDesign[K]) =>
      setAi({ [key]: v } as Partial<AiDesign>);
  return (
    <>
      <PanelSection title="AI 강조색" hint="AI가 만든 것(반짝이 아이콘, 제안 칩, 보내기 버튼)에 쓰는 색">
        <ChoiceRow
          label="기준 색"
          value={ai.color}
          onChange={pick('color')}
          options={[
            { value: 'primary', label: '메인과 같게' },
            { value: 'secondary', label: '서브와 같게' },
            { value: 'custom', label: '따로 지정' },
          ]}
        />
        {ai.color === 'custom' ? (
          <ColorField label="AI 전용 색" value={ai.customColor} onChange={pick('customColor')} swatches={['#6d4aff', '#7c3aed', '#0891b2', '#db2777', '#059669']} />
        ) : null}
      </PanelSection>
      <PanelSection title="말풍선">
        <ChoiceRow
          label="내 말풍선"
          value={ai.userBubble}
          onChange={pick('userBubble')}
          options={[
            { value: 'primary', label: '메인 채움' },
            { value: 'soft', label: '연한 메인' },
            { value: 'muted', label: '회색' },
          ]}
        />
        <ChoiceRow
          label="AI 말풍선"
          value={ai.aiBubble}
          onChange={pick('aiBubble')}
          options={[
            { value: 'soft', label: '연한 면' },
            { value: 'outline', label: '테두리' },
            { value: 'plain', label: '말풍선 없음' },
          ]}
        />
        <ChoiceRow
          label="모양"
          value={ai.shape}
          onChange={pick('shape')}
          options={[
            { value: 'tail', label: '꼬리 모서리' },
            { value: 'round', label: '둥글게' },
            { value: 'square', label: '각지게' },
          ]}
        />
        <ChoiceRow
          label="AI 아바타"
          value={ai.avatar}
          onChange={pick('avatar')}
          options={[
            { value: 'sparkle', label: '반짝이' },
            { value: 'letter', label: 'AI 글자' },
            { value: 'none', label: '없음' },
          ]}
        />
      </PanelSection>
      <PanelSection title="AI 답 안의 요소">
        <ChoiceRow
          label="채팅 속 카드"
          value={ai.cardView}
          onChange={pick('cardView')}
          options={[
            { value: 'full', label: '카드 그대로' },
            { value: 'compact', label: '한 줄 목록' },
          ]}
        />
        <ChoiceRow
          label="다음 행동 제안"
          value={ai.suggestions}
          onChange={pick('suggestions')}
          options={[
            { value: 'chip', label: '칩' },
            { value: 'list', label: '목록' },
          ]}
        />
        <ChoiceRow
          label="생각 중 표시"
          value={ai.thinking}
          onChange={pick('thinking')}
          options={[
            { value: 'dots', label: '점 3개' },
            { value: 'text', label: '문구' },
            { value: 'skeleton', label: '빈 줄' },
          ]}
        />
        <SwitchRow label="출처 표시" hint="답의 근거가 된 카드·문서" value={ai.showSources} onChange={pick('showSources')} />
      </PanelSection>
      <PanelSection title="입력창">
        <ChoiceRow
          label="모양"
          value={ai.composer}
          onChange={pick('composer')}
          options={[
            { value: 'pill', label: '한 줄 알약' },
            { value: 'box', label: '여러 줄 상자' },
          ]}
        />
        <SwitchRow label="예상 비용 문구" hint="예상 토큰 · 모델 · 내 API 키" value={ai.showCost} onChange={pick('showCost')} />
      </PanelSection>
    </>
  );
}

const ELEMENTS = [
  ['내 말풍선', 'bubble-user · 오른쪽 정렬 · 최대 80%'],
  ['AI 아바타', 'ai-soft 원 + ai 아이콘'],
  ['AI 말풍선', 'bubble-ai · 연한 면/테두리/없음'],
  ['채팅 속 카드', 'ExtractedCard 재사용 → 빠른 입력 화면과 같은 모양'],
  ['출처', 'border-border 작은 칩 · 원문 보존 원칙'],
  ['다음 행동 제안', 'ai-soft 칩 또는 목록'],
  ['생각 중', '점 3개 / 문구 / 빈 줄'],
  ['오류', 'destructive/10 면 + 해결 행동 한 줄'],
  ['입력창', '첨부 · 마이크 · 보내기(ai) · 비용 문구'],
];

export function ChatView() {
  return (
    <Workspace panel={<ChatPanel />}>
      <MainSection title="AI 채팅 화면" hint="카드 추출 결과와 질문 답변이 한 대화에 섞이는 모습">
        <View className="flex-row flex-wrap gap-8">
          <Phone mode="light" label="라이트">
            <ChatScreen />
          </Phone>
          <Phone mode="dark" label="다크">
            <ChatScreen />
          </Phone>
        </View>
      </MainSection>
      <MainSection title="상태별 모습">
        <View className="flex-row flex-wrap gap-6">
          <ThemeScope className="w-[360px] gap-3 rounded-2xl border border-slate-200 p-5">
            <Text className="text-xs font-bold text-muted-foreground">첫 화면 (대화 없음)</Text>
            <View className="items-center gap-2 py-4">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-ai-soft">
                <Icon as={SparklesIcon} size={22} className="text-ai" />
              </View>
              <Text className="text-base font-bold text-foreground">오늘 무엇을 정리할까요?</Text>
              <Text className="text-center text-xs text-muted-foreground">막 쓰면 카드로 나눠 드려요. 확인한 것만 저장돼요.</Text>
            </View>
            <SuggestionChips items={['오늘 메모로 카드 뽑기', '이번 주 할 일 모아 보기', '업무일지 초안']} />
          </ThemeScope>
          <ThemeScope className="w-[360px] gap-3 rounded-2xl border border-slate-200 p-5">
            <Text className="text-xs font-bold text-muted-foreground">생각 중</Text>
            <UserBubble>회의록에서 할 일만 뽑아줘</UserBubble>
            <Thinking label="회의록을 읽는 중" />
          </ThemeScope>
          <ThemeScope className="w-[360px] gap-3 rounded-2xl border border-slate-200 p-5">
            <Text className="text-xs font-bold text-muted-foreground">오류</Text>
            <UserBubble>업무일지 초안 써줘</UserBubble>
            <AiMessage>
              <AiText>초안을 만들지 못했어요.</AiText>
            </AiMessage>
            <ErrorNotice message="API 키가 만료됐거나 한도를 넘었어요." action="설정에서 키 확인하기" />
          </ThemeScope>
          <ThemeScope className="w-[360px] overflow-hidden rounded-2xl border border-slate-200">
            <Text className="px-5 pt-5 text-xs font-bold text-muted-foreground">입력창</Text>
            <Composer />
          </ThemeScope>
        </View>
      </MainSection>
      <MainSection title="채팅 구성요소">
        <Sheet className="gap-2.5">
          {ELEMENTS.map(([n, d], i) => (
            <View key={n} className="flex-row gap-3">
              <Text className="w-5 text-right font-mono text-xs text-slate-400">{i + 1}</Text>
              <Text className="w-28 text-sm font-bold text-slate-800">{n}</Text>
              <Text className="flex-1 font-mono text-xs leading-5 text-slate-600">{d}</Text>
            </View>
          ))}
          <Text className="mt-2 text-xs text-slate-500">
            코드: components/chat/chat.tsx · 설정값은 lib/theme.ts 의 CHAT_DESIGN 으로 내보내져요.
          </Text>
        </Sheet>
      </MainSection>
    </Workspace>
  );
}
