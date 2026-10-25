import * as React from 'react';
import { Platform } from 'react-native';
import { DEFAULT_STATE, type AiDesign, type DesignState, type Mode, type TokenKey } from './tokens';

const STORAGE_KEY = 'note-app-design-system:v1';

type Store = {
  state: DesignState;
  set: (patch: Partial<DesignState>) => void;
  setAi: (patch: Partial<AiDesign>) => void;
  setOverride: (mode: Mode, key: TokenKey, hex: string | null) => void;
  reset: () => void;
  shareUrl: () => string | null;
};

const DesignContext = React.createContext<Store | null>(null);

function encode(s: DesignState) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(s))));
}

function decode(raw: string): DesignState | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(raw))));
    return merge(parsed);
  } catch {
    return null;
  }
}

/** 저장된 값에 빠진 필드가 있어도 기본값으로 채운다 */
function merge(parsed: Partial<DesignState>): DesignState {
  return {
    ...DEFAULT_STATE,
    ...parsed,
    cardColors: { ...DEFAULT_STATE.cardColors, ...parsed.cardColors },
    ai: { ...DEFAULT_STATE.ai, ...parsed.ai },
    overrides: {
      light: { ...parsed.overrides?.light },
      dark: { ...parsed.overrides?.dark },
    },
    version: 1,
  };
}

function loadInitial(): DesignState {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return DEFAULT_STATE;
  const hash = window.location.hash.match(/s=([^&]+)/);
  if (hash) {
    const fromHash = decode(decodeURIComponent(hash[1]));
    if (fromHash) return fromHash;
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) return merge(JSON.parse(saved));
  } catch {
    // 시크릿 창 등에서 저장소를 못 쓰면 기본값으로 시작
  }
  return DEFAULT_STATE;
}

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DesignState>(DEFAULT_STATE);
  const loaded = React.useRef(false);

  // 정적 렌더링과 어긋나지 않도록 브라우저에서 마운트된 뒤에 불러온다
  React.useEffect(() => {
    setState(loadInitial());
    loaded.current = true;
  }, []);

  React.useEffect(() => {
    if (!loaded.current || Platform.OS !== 'web') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 저장 실패는 무시 (화면은 그대로 동작)
    }
  }, [state]);

  const store = React.useMemo<Store>(
    () => ({
      state,
      set: (patch) => setState((s) => ({ ...s, ...patch })),
      setAi: (patch) => setState((s) => ({ ...s, ai: { ...s.ai, ...patch } })),
      setOverride: (mode, key, hex) =>
        setState((s) => {
          const next = { ...s.overrides[mode] };
          if (hex === null) delete next[key];
          else next[key] = hex;
          return { ...s, overrides: { ...s.overrides, [mode]: next } };
        }),
      reset: () => {
        setState(DEFAULT_STATE);
        if (Platform.OS === 'web') history.replaceState(null, '', window.location.pathname);
      },
      shareUrl: () => {
        if (Platform.OS !== 'web') return null;
        return `${window.location.origin}${window.location.pathname}#s=${encodeURIComponent(encode(state))}`;
      },
    }),
    [state]
  );

  return <DesignContext.Provider value={store}>{children}</DesignContext.Provider>;
}

export function useDesign() {
  const ctx = React.useContext(DesignContext);
  if (!ctx) throw new Error('useDesign must be used inside DesignProvider');
  return ctx;
}
