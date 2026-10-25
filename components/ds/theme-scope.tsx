import { NavDesignContext } from '@/components/app/navigation';
import { ChatDesignContext } from '@/components/chat/chat';
import { FontContext } from '@/lib/font';
import { useDesign } from '@/lib/design/store';
import { buildTokens, FONTS, tokensToVars, type Mode } from '@/lib/design/tokens';
import { cn } from '@/lib/utils';
import { vars } from 'nativewind';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

export const ScopeModeContext = React.createContext<Mode>('light');

/** 안쪽 화면에만 편집 중인 토큰(CSS 변수)을 입힌다. 바깥 편집 패널은 영향 없음. */
export function ThemeScope({
  mode,
  className,
  style,
  ...props
}: ViewProps & { mode?: Mode; className?: string }) {
  const { state } = useDesign();
  const m = mode ?? state.mode;
  const themeVars = React.useMemo(
    () => vars(tokensToVars(buildTokens(state, m), state.radius)),
    [state, m]
  );
  return (
    <ScopeModeContext.Provider value={m}>
      <NavDesignContext.Provider value={state.nav}>
        <ChatDesignContext.Provider value={state.ai}>
          <FontContext.Provider value={FONTS[state.font].family}>
            <View style={[themeVars, style]} className={cn('bg-background', className)} {...props} />
          </FontContext.Provider>
        </ChatDesignContext.Provider>
      </NavDesignContext.Provider>
    </ScopeModeContext.Provider>
  );
}
