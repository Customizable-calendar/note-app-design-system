import { hexToHslTriplet } from './color';
import {
  buildTokens,
  FONTS,
  TOKEN_GROUPS,
  type DesignState,
  type Mode,
  type TokenKey,
  type Tokens,
} from './tokens';

const rem = (px: number) => `${Math.round((px / 16) * 1000) / 1000}rem`;

function cssBlock(t: Tokens, indent: string) {
  return TOKEN_GROUPS.map(
    (g) =>
      `${indent}/* ${g.title} */\n` +
      g.keys.map((k) => `${indent}--${k}: ${hexToHslTriplet(t[k as TokenKey])};`).join('\n')
  ).join('\n');
}

/** NativeWind + react-native-reusables 용 global.css */
export function toGlobalCss(s: DesignState) {
  const light = buildTokens(s, 'light');
  const dark = buildTokens(s, 'dark');
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

/* note-app-design-system 에서 내보냄 · 메인 ${s.primary} / 서브 ${s.secondary} */
@layer base {
  :root {
${cssBlock(light, '    ')}
    --radius: ${rem(s.radius)};
  }

  .dark:root {
${cssBlock(dark, '    ')}
  }
}
`;
}

function camel(k: string) {
  return k.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function themeObject(t: Tokens, indent: string) {
  return (Object.keys(t) as TokenKey[])
    .map((k) => `${indent}${camel(k)}: 'hsl(${hexToHslTriplet(t[k])})',`)
    .join('\n');
}

/** lib/theme.ts — 네비게이션 테마와 JS에서 색이 필요할 때(아이콘, 그래프 등) */
export function toThemeTs(s: DesignState) {
  const light = buildTokens(s, 'light');
  const dark = buildTokens(s, 'dark');
  return `import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';

export const THEME = {
  light: {
${themeObject(light, '    ')}
    radius: '${rem(s.radius)}',
  },
  dark: {
${themeObject(dark, '    ')}
    radius: '${rem(s.radius)}',
  },
};

export const FONT_FAMILY = '${FONTS[s.font].family}';

/** AI 채팅 화면 설정 — components/chat/* 에서 읽어서 씀 */
export const CHAT_DESIGN = ${JSON.stringify(s.ai, null, 2)} as const;

/** 하단 탭 · LNB 설정 — components/app/navigation.tsx, lnb.tsx 에서 읽어서 씀 */
export const NAV_DESIGN = ${JSON.stringify(s.nav, null, 2)} as const;

/** 캘린더 · 시간 잡기 · 수행 확인 설정 — components/app/calendar.tsx 에서 읽어서 씀 */
export const CALENDAR_DESIGN = ${JSON.stringify(s.calendar, null, 2)} as const;

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
`;
}

/** HeroUI Native(Uniwind, Tailwind v4)로 갈 경우의 global.css 변수 매핑 */
export function toHeroUiCss(s: DesignState) {
  const block = (mode: Mode) => {
    const t = buildTokens(s, mode);
    const rows: [string, string][] = [
      ['background', t.background],
      ['foreground', t.foreground],
      ['surface', t.card],
      ['surface-foreground', t['card-foreground']],
      ['surface-secondary', t.muted],
      ['surface-secondary-foreground', t.foreground],
      ['overlay', t.popover],
      ['overlay-foreground', t['popover-foreground']],
      ['muted', t['muted-foreground']],
      ['default', t.muted],
      ['default-foreground', t.foreground],
      ['accent', t.primary],
      ['accent-foreground', t['primary-foreground']],
      ['warning', t.secondary],
      ['warning-foreground', t['secondary-foreground']],
      ['danger', t.destructive],
      ['danger-foreground', t['destructive-foreground']],
      ['field-background', t.background],
      ['field-foreground', t.foreground],
      ['field-placeholder', t['muted-foreground']],
      ['field-border', t.input],
      ['border', t.border],
      ['separator', t.border],
      ['focus', t.ring],
      ['link', t.primary],
    ];
    return rows.map(([k, v]) => `      --${k}: ${v};`).join('\n');
  };
  const t = buildTokens(s, 'light');
  return `/* HeroUI Native 를 고를 경우 — global.css
 * 이름 매핑: primary → accent, secondary → warning, muted → default, card → surface
 * 공식 문서의 @layer theme / @variant 형식을 따름. 설치한 버전의 variables.css 와 꼭 대조할 것.
 */
@import 'tailwindcss';
@import 'uniwind';
@import 'heroui-native/styles';

@layer theme {
  @variant light {
${block('light')}
  }
  @variant dark {
${block('dark')}
  }
}

/* 앱 전용 토큰 (카드 4종, AI 채팅, 캘린더 계정) */
@theme {
  --color-event: ${t.event};
  --color-event-soft: ${t['event-soft']};
  --color-task: ${t.task};
  --color-task-soft: ${t['task-soft']};
  --color-person: ${t.person};
  --color-person-soft: ${t['person-soft']};
  --color-idea: ${t.idea};
  --color-idea-soft: ${t['idea-soft']};
  --color-ai: ${t.ai};
  --color-ai-soft: ${t['ai-soft']};
  --color-cal-1: ${t['cal-1']};
  --color-cal-1-soft: ${t['cal-1-soft']};
  --color-cal-2: ${t['cal-2']};
  --color-cal-2-soft: ${t['cal-2-soft']};
  --radius: ${rem(s.radius)};
}
`;
}

/** 디자인 결정 원본 — 이 페이지로 다시 불러오거나 Figma 토큰 플러그인에 넣을 때 */
export function toJson(s: DesignState) {
  return JSON.stringify(
    {
      $source: 'note-app-design-system',
      state: s,
      tokens: { light: buildTokens(s, 'light'), dark: buildTokens(s, 'dark') },
    },
    null,
    2
  );
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const tailwindTheme = require('../../design/tailwind-theme');

/** tailwind.config.js — 토큰 이름을 클래스로 쓰게 해 주는 설정 (값은 global.css 가 가짐) */
export function toTailwindConfig() {
  const body = JSON.stringify({ colors: tailwindTheme.colors, borderRadius: tailwindTheme.borderRadius }, null, 2)
    .split('\n')
    .map((l, i) => (i === 0 ? l : `    ${l}`))
    .join('\n');
  return `const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: ${body.replace(/^\{/, '{').replace(/\n {4}\}$/, ',\n      borderWidth: { hairline: hairlineWidth() },\n    }')},
  },
  plugins: [require('tailwindcss-animate')],
};
`;
}
