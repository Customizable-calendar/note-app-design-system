import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';

export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(210 16% 9.8%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(210 16% 9.8%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(210 16% 9.8%)',
    primary: 'hsl(252.5 54.6% 53.3%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(19 100% 27.8%)',
    secondaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(200 14.3% 95.9%)',
    mutedForeground: 'hsl(208.6 10.3% 39.8%)',
    accent: 'hsl(252.9 53.8% 94.9%)',
    accentForeground: 'hsl(252.5 48.1% 46.9%)',
    destructive: 'hsl(357.7 63.1% 51.2%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(205.7 14.3% 90.4%)',
    input: 'hsl(207.3 15.1% 85.7%)',
    ring: 'hsl(252.5 54.6% 53.3%)',
    primarySoft: 'hsl(252.9 53.8% 94.9%)',
    primarySoftForeground: 'hsl(252.5 48.1% 46.9%)',
    secondarySoft: 'hsl(18.8 40% 92.2%)',
    secondarySoftForeground: 'hsl(19.2 100% 24.5%)',
    event: 'hsl(202.6 61.9% 42.2%)',
    eventSoft: 'hsl(203.1 44.8% 94.3%)',
    task: 'hsl(158 100% 22%)',
    taskSoft: 'hsl(158.2 28.2% 92.4%)',
    person: 'hsl(314.5 68.3% 32.2%)',
    personSoft: 'hsl(310.9 31.4% 93.1%)',
    idea: 'hsl(40.8 77.5% 33.1%)',
    ideaSoft: 'hsl(38.6 41.2% 93.3%)',
    ai: 'hsl(252.5 54.6% 53.3%)',
    aiForeground: 'hsl(0 0% 100%)',
    aiSoft: 'hsl(252.9 53.8% 94.9%)',
    bubbleUser: 'hsl(252.5 54.6% 53.3%)',
    bubbleUserForeground: 'hsl(0 0% 100%)',
    bubbleAi: 'hsl(252.9 53.8% 94.9%)',
    bubbleAiForeground: 'hsl(210 16% 9.8%)',
    bubbleAiBorder: 'hsl(252.9 53.8% 94.9%)',
    cal1: 'hsl(218.1 67.3% 43.1%)',
    cal1Soft: 'hsl(216 51.7% 94.3%)',
    cal2: 'hsl(330.8 50.2% 42.5%)',
    cal2Soft: 'hsl(332.7 37.9% 94.3%)',
    radius: '0.875rem',
  },
  dark: {
    background: 'hsl(202.5 21.1% 7.5%)',
    foreground: 'hsl(202.5 21.1% 92.5%)',
    card: 'hsl(202.5 21.1% 7.5%)',
    cardForeground: 'hsl(202.5 21.1% 92.5%)',
    popover: 'hsl(202.5 21.1% 7.5%)',
    popoverForeground: 'hsl(202.5 21.1% 92.5%)',
    primary: 'hsl(252.3 54.3% 68.2%)',
    primaryForeground: 'hsl(210 16% 9.8%)',
    secondary: 'hsl(17.9 61.1% 50.6%)',
    secondaryForeground: 'hsl(210 16% 9.8%)',
    muted: 'hsl(203.1 19.4% 13.1%)',
    mutedForeground: 'hsl(204.5 12.2% 64.7%)',
    accent: 'hsl(240 20% 21.6%)',
    accentForeground: 'hsl(252.3 53.4% 85.7%)',
    destructive: 'hsl(357.8 63.3% 66.9%)',
    destructiveForeground: 'hsl(210 16% 9.8%)',
    border: 'hsl(202.5 16% 19.6%)',
    input: 'hsl(204 15.6% 25.1%)',
    ring: 'hsl(252.3 54.3% 68.2%)',
    primarySoft: 'hsl(240 20% 21.6%)',
    primarySoftForeground: 'hsl(252.3 53.4% 85.7%)',
    secondarySoft: 'hsl(16 17.2% 17.1%)',
    secondarySoftForeground: 'hsl(19.5 38.1% 77.8%)',
    event: 'hsl(203.6 88.2% 70%)',
    eventSoft: 'hsl(203.1 47% 16.3%)',
    task: 'hsl(154 56.1% 50%)',
    taskSoft: 'hsl(165 59.3% 10.6%)',
    person: 'hsl(323.3 46.2% 56.3%)',
    personSoft: 'hsl(302.5 35.3% 13.3%)',
    idea: 'hsl(43.1 87.1% 45.5%)',
    ideaSoft: 'hsl(44.4 38% 13.9%)',
    ai: 'hsl(252.3 54.3% 68.2%)',
    aiForeground: 'hsl(210 16% 9.8%)',
    aiSoft: 'hsl(240 20% 21.6%)',
    bubbleUser: 'hsl(252.3 54.3% 68.2%)',
    bubbleUserForeground: 'hsl(210 16% 9.8%)',
    bubbleAi: 'hsl(240 20% 21.6%)',
    bubbleAiForeground: 'hsl(202.5 21.1% 92.5%)',
    bubbleAiBorder: 'hsl(240 20% 21.6%)',
    cal1: 'hsl(218.1 51.4% 71.8%)',
    cal1Soft: 'hsl(214.9 51.8% 16.3%)',
    cal2: 'hsl(331.1 37% 71.4%)',
    cal2Soft: 'hsl(320.9 28.4% 15.9%)',
    radius: '0.875rem',
  },
};

export const FONT_FAMILY = 'Pretendard';

/** AI 채팅 화면 설정 — components/chat/* 에서 읽어서 씀 */
export const CHAT_DESIGN = {
  "color": "primary",
  "customColor": "#6d4aff",
  "userBubble": "primary",
  "aiBubble": "soft",
  "shape": "tail",
  "avatar": "sparkle",
  "thinking": "dots",
  "suggestions": "chip",
  "cardView": "full",
  "composer": "pill",
  "showSources": true,
  "showCost": true
} as const;

/** 하단 탭 · LNB 설정 — components/app/navigation.tsx, lnb.tsx 에서 읽어서 씀 */
export const NAV_DESIGN = {
  "tabs": "lnb4",
  "open": "avatar",
  "selected": "soft",
  "density": "regular",
  "showQuick": true,
  "showCards": true,
  "showUsage": true
} as const;

/** 캘린더 · 시간 잡기 · 수행 확인 설정 — components/app/calendar.tsx 에서 읽어서 씀 */
export const CALENDAR_DESIGN = {
  "accounts": [
    "#245ab8",
    "#a3366b"
  ],
  "eventStyle": "bar",
  "suggestion": "dashed",
  "fitLabel": "word",
  "showReasons": true,
  "density": "regular",
  "statusStyle": "segment"
} as const;

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
