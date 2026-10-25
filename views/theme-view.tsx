import { ChoiceRow, ColorField, FieldLabel, PanelSection, Slider } from '@/components/ds/controls';
import { Phone } from '@/components/ds/frame';
import { ThemeScope } from '@/components/ds/theme-scope';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { contrast, contrastGrade, isHex, normalizeHex } from '@/lib/design/color';
import { useDesign } from '@/lib/design/store';
import {
  buildTokens,
  CARD_TYPES,
  DEFAULT_STATE,
  FONTS,
  PRESETS,
  TOKEN_GROUPS,
  TOKEN_LABEL,
  type FontKey,
  type Mode,
  type Neutral,
  type TokenKey,
} from '@/lib/design/tokens';
import { cn } from '@/lib/utils';
import { SCREENS } from '@/screens/registry';
import { MainSection, Sheet, Workspace } from '@/views/workspace';
import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';

const MAIN_SWATCHES = ['#0b6b8a', '#2f5bd3', '#2f6b4f', '#6247c9', '#1d2125', '#c2410c', '#0f766e', '#be185d'];
const SUB_SWATCHES = ['#b5470b', '#e0882f', '#c2603a', '#e2586b', '#0b6b8a', '#ca8a04', '#7c3aed', '#16a34a'];

export function ThemePanel() {
  const { state, set } = useDesign();
  return (
    <>
      <PanelSection title="시작 프리셋" hint="눌러서 바로 비교. 이후 아래에서 세부 조정.">
        <View className="flex-row flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Pressable
              key={p.name}
              onPress={() => set({ ...DEFAULT_STATE, ...p.patch, mode: state.mode, ai: state.ai, nav: state.nav, overrides: { light: {}, dark: {} } })}
              className="flex-row items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
              <View className="flex-row">
                <View className="h-4 w-4 rounded-full" style={{ backgroundColor: p.patch.primary ?? DEFAULT_STATE.primary }} />
                <View className="-ml-1.5 h-4 w-4 rounded-full border border-white" style={{ backgroundColor: p.patch.secondary ?? DEFAULT_STATE.secondary }} />
              </View>
              <View>
                <Text className="text-xs font-bold text-slate-800">{p.name}</Text>
                <Text className="text-[10px] text-slate-500">{p.note}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </PanelSection>
      <PanelSection title="메인 색 (primary)" hint="주 버튼, 선택 상태, 링크, 포커스. 연한 면·글자색은 자동으로 만들어져요.">
        <ColorField label="메인" value={state.primary} onChange={(v) => set({ primary: v })} swatches={MAIN_SWATCHES} />
      </PanelSection>
      <PanelSection title="서브 색 (secondary)" hint="녹음 중, 외부 캘린더 출처, 보조 강조. 메인과 확실히 다른 색이 좋아요.">
        <ColorField label="서브" value={state.secondary} onChange={(v) => set({ secondary: v })} swatches={SUB_SWATCHES} />
      </PanelSection>
      <PanelSection title="배경 · 글자 톤">
        <ChoiceRow<Neutral>
          label="회색 계열"
          value={state.neutral}
          onChange={(v) => set({ neutral: v })}
          options={[
            { value: 'cool', label: '푸른 회색' },
            { value: 'warm', label: '따뜻한 회색' },
            { value: 'pure', label: '무채색' },
          ]}
        />
        <ColorField label="삭제 · 오류" value={state.destructive} onChange={(v) => set({ destructive: v })} compact />
      </PanelSection>
      <PanelSection title="카드 4종 색" hint="글자색 기준. 배경(연한 면)은 자동. 일정과 서브 색이 겹치지 않는지 보세요.">
        {CARD_TYPES.map((t) => (
          <ColorField
            key={t.key}
            label={t.label}
            value={state.cardColors[t.key]}
            onChange={(v) => set({ cardColors: { ...state.cardColors, [t.key]: v } })}
            compact
          />
        ))}
      </PanelSection>
      <PanelSection title="모서리 · 글꼴">
        <View className="gap-1.5">
          <View className="flex-row justify-between">
            <FieldLabel>기준 모서리 (--radius)</FieldLabel>
            <Text className="font-mono text-xs text-slate-600">{state.radius}px</Text>
          </View>
          <Slider value={state.radius} min={0} max={28} onChange={(v) => set({ radius: v })} />
          <Text className="text-[11px] text-slate-500">
            버튼 = 기준 - 4 · 카드 = 기준 · 큰 카드 = 기준 + 4 · 시트 = 기준 + 10
          </Text>
        </View>
        <ChoiceRow<FontKey>
          label="글꼴"
          value={state.font}
          onChange={(v) => set({ font: v })}
          options={(Object.keys(FONTS) as FontKey[]).map((k) => ({ value: k, label: FONTS[k].label }))}
        />
        <Text className="text-[11px] text-slate-500">{FONTS[state.font].note}</Text>
      </PanelSection>
      <OverridePanel />
    </>
  );
}

function OverrideRow({ k, mode, value, overridden }: { k: TokenKey; mode: Mode; value: string; overridden: boolean }) {
  const { setOverride } = useDesign();
  const [text, setText] = React.useState(value);
  React.useEffect(() => setText(value), [value]);
  return (
    <View className="flex-row items-center gap-2">
      <View className="h-6 w-6 rounded-md border border-black/10" style={{ backgroundColor: value }} />
      <View className="flex-1">
        <Text className="text-xs font-semibold text-slate-800">{TOKEN_LABEL[k] ?? k}</Text>
        <Text className="font-mono text-[10px] text-slate-400">--{k}</Text>
      </View>
      {overridden ? (
        <Pressable onPress={() => setOverride(mode, k, null)}>
          <Text className="text-[11px] font-semibold text-pink-600">자동으로</Text>
        </Pressable>
      ) : null}
      <TextInput
        value={text}
        onChangeText={(t) => {
          setText(t);
          if (isHex(t)) setOverride(mode, k, normalizeHex(t.startsWith('#') ? t : `#${t}`));
        }}
        autoCapitalize="none"
        className={cn(
          'h-7 w-[84px] rounded-md border bg-white px-1.5 font-mono text-[12px] text-slate-900',
          overridden ? 'border-pink-400' : 'border-slate-300'
        )}
      />
    </View>
  );
}

function OverridePanel() {
  const { state } = useDesign();
  const [open, setOpen] = React.useState(false);
  const tokens = buildTokens(state, state.mode);
  const count = Object.keys(state.overrides[state.mode]).length;
  return (
    <PanelSection
      title="세부 토큰 직접 고치기"
      hint={`지금 미리보기 모드(${state.mode === 'light' ? '라이트' : '다크'}) 값만 바뀌어요. 고친 값 ${count}개.`}
      right={
        <Pressable onPress={() => setOpen((o) => !o)} className="rounded-md bg-slate-100 px-2.5 py-1.5">
          <Text className="text-xs font-semibold text-slate-700">{open ? '접기' : '펼치기'}</Text>
        </Pressable>
      }>
      {open
        ? TOKEN_GROUPS.map((g) => (
            <View key={g.title} className="gap-2">
              <Text className="mt-1 text-[11px] font-bold text-slate-500">{g.title}</Text>
              {g.keys.map((k) => (
                <OverrideRow
                  key={k}
                  k={k as TokenKey}
                  mode={state.mode}
                  value={tokens[k as TokenKey]}
                  overridden={k in state.overrides[state.mode]}
                />
              ))}
            </View>
          ))
        : null}
    </PanelSection>
  );
}

const PAIRS: { fg: TokenKey; bg: TokenKey; label: string }[] = [
  { fg: 'foreground', bg: 'background', label: '기본 글자 / 배경' },
  { fg: 'muted-foreground', bg: 'background', label: '보조 글자 / 배경' },
  { fg: 'muted-foreground', bg: 'muted', label: '보조 글자 / 회색 면' },
  { fg: 'primary-foreground', bg: 'primary', label: '주 버튼 글자 / 메인' },
  { fg: 'primary', bg: 'background', label: '메인 글자(링크) / 배경' },
  { fg: 'primary-soft-foreground', bg: 'primary-soft', label: '배너 글자 / 메인 연한 면' },
  { fg: 'secondary-foreground', bg: 'secondary', label: '서브 위 글자 / 서브' },
  { fg: 'secondary', bg: 'background', label: '서브 글자 / 배경' },
  { fg: 'event', bg: 'event-soft', label: '일정 칩' },
  { fg: 'task', bg: 'task-soft', label: '할 일 칩' },
  { fg: 'person', bg: 'person-soft', label: '사람 칩' },
  { fg: 'idea', bg: 'idea-soft', label: '아이디어 칩' },
  { fg: 'bubble-user-foreground', bg: 'bubble-user', label: '내 말풍선' },
  { fg: 'ai', bg: 'background', label: 'AI 강조 글자 / 배경' },
];

function ContrastTable({ mode }: { mode: Mode }) {
  const { state } = useDesign();
  const t = buildTokens(state, mode);
  return (
    <View className="gap-1.5">
      {PAIRS.map((p) => {
        const ratio = contrast(t[p.fg], t[p.bg]);
        const grade = contrastGrade(ratio);
        const bad = ratio < 4.5;
        return (
          <View key={p.label} className="flex-row items-center gap-3">
            <View className="h-8 w-14 items-center justify-center rounded-md border border-black/5" style={{ backgroundColor: t[p.bg] }}>
              <Text className="text-[13px] font-bold" style={{ color: t[p.fg] }}>
                가Aa
              </Text>
            </View>
            <Text className="flex-1 text-[13px] text-slate-700">{p.label}</Text>
            <Text className="w-12 text-right font-mono text-xs text-slate-600">{ratio.toFixed(2)}</Text>
            <View className={cn('w-[76px] items-center rounded-full py-0.5', bad ? 'bg-amber-100' : 'bg-emerald-100')}>
              <Text className={cn('text-[11px] font-bold', bad ? 'text-amber-800' : 'text-emerald-800')}>{grade}</Text>
            </View>
          </View>
        );
      })}
      <Text className="mt-1 text-[11px] text-slate-500">
        본문은 4.5 이상(AA), 18px 이상 굵은 글자는 3 이상이면 통과. 칩처럼 작은 글자는 4.5를 목표로.
      </Text>
    </View>
  );
}

function Palette({ mode }: { mode: Mode }) {
  const { state } = useDesign();
  const t = buildTokens(state, mode);
  return (
    <View className="gap-4">
      {TOKEN_GROUPS.map((g) => (
        <View key={g.title} className="gap-2">
          <Text className="text-xs font-bold text-slate-500">{g.title}</Text>
          <View className="flex-row flex-wrap gap-2">
            {g.keys.map((k) => (
              <View key={k} className="w-[118px] overflow-hidden rounded-lg border border-slate-200 bg-white">
                <View className="h-10" style={{ backgroundColor: t[k as TokenKey] }} />
                <View className="gap-0.5 px-2 py-1.5">
                  <Text className="text-[11px] font-semibold text-slate-800" numberOfLines={1}>
                    {TOKEN_LABEL[k as TokenKey] ?? k}
                  </Text>
                  <Text className="font-mono text-[10px] text-slate-500">{t[k as TokenKey]}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function TypeScale() {
  return (
    <ThemeScope className="gap-3 rounded-xl border border-slate-200 p-5">
      {[
        ['화면 제목', 'text-[28px] font-bold tracking-tight', '28 · bold'],
        ['소제목', 'text-lg font-bold', '18 · bold'],
        ['카드 제목', 'text-[15px] font-bold', '15 · bold'],
        ['본문', 'text-[15px]', '15 · regular'],
        ['보조 글', 'text-sm text-muted-foreground', '14 · muted'],
        ['메타 · 칩', 'text-xs text-muted-foreground', '12 · muted'],
      ].map(([label, cls, spec]) => (
        <View key={label} className="flex-row items-baseline gap-4">
          <Text className="w-24 text-xs text-muted-foreground">{spec}</Text>
          <Text className={cls}>{label} 오늘 회의 카드 3장</Text>
        </View>
      ))}
      <View className="mt-2 flex-row flex-wrap gap-3">
        {['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl'].map((r) => (
          <View key={r} className="items-center gap-1">
            <View className={cn('h-14 w-20 border border-border bg-primary-soft', r)} />
            <Text className="font-mono text-[10px] text-muted-foreground">{r}</Text>
          </View>
        ))}
      </View>
      <View className="flex-row flex-wrap gap-2">
        <Button>
          <Text>주 버튼</Text>
        </Button>
        <Button variant="secondary">
          <Text>서브 버튼</Text>
        </Button>
        <Button variant="soft">
          <Text>연한 버튼</Text>
        </Button>
        <Button variant="outline">
          <Text>테두리</Text>
        </Button>
      </View>
    </ThemeScope>
  );
}

export function ThemeMain() {
  const { state } = useDesign();
  const [screenId, setScreenId] = React.useState('home');
  const screen = SCREENS.find((s) => s.id === screenId) ?? SCREENS[0];
  return (
    <>
      <MainSection
        title="미리보기"
        hint="왼쪽에서 바꾼 값이 바로 반영돼요. 라이트와 다크를 나란히 비교."
        right={
          <View className="flex-row flex-wrap gap-1.5">
            {SCREENS.slice(0, 6).map((s) => (
              <Pressable
                key={s.id}
                onPress={() => setScreenId(s.id)}
                className={cn('rounded-full px-3 py-1.5', s.id === screenId ? 'bg-slate-900' : 'bg-white')}>
                <Text className={cn('text-xs font-semibold', s.id === screenId ? 'text-white' : 'text-slate-700')}>{s.name}</Text>
              </Pressable>
            ))}
          </View>
        }>
        <View className="flex-row flex-wrap gap-8">
          <Phone mode="light" label="라이트">
            <screen.Component />
          </Phone>
          <Phone mode="dark" label="다크 (자동 계산)">
            <screen.Component />
          </Phone>
        </View>
      </MainSection>
      <MainSection title="글자 크기 · 모서리 · 버튼">
        <TypeScale />
      </MainSection>
      <MainSection title="대비 검사" hint="글자가 배경 위에서 잘 읽히는지 WCAG 기준으로 계산">
        <View className="flex-row flex-wrap gap-6">
          <Sheet className="min-w-[340px] flex-1 gap-3">
            <Text className="text-sm font-bold text-slate-800">라이트</Text>
            <ContrastTable mode="light" />
          </Sheet>
          <Sheet className="min-w-[340px] flex-1 gap-3">
            <Text className="text-sm font-bold text-slate-800">다크</Text>
            <ContrastTable mode="dark" />
          </Sheet>
        </View>
      </MainSection>
      <MainSection title={`전체 토큰 (${state.mode === 'light' ? '라이트' : '다크'})`} hint="global.css 변수와 같은 이름. 코드 내보내기 탭에서 그대로 복사할 수 있어요.">
        <Palette mode={state.mode} />
      </MainSection>
    </>
  );
}

export function ThemeView() {
  return (
    <Workspace panel={<ThemePanel />}>
      <ThemeMain />
    </Workspace>
  );
}
