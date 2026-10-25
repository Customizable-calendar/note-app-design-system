import { ScopeModeContext } from '@/components/ds/theme-scope';
import { useDesign } from '@/lib/design/store';
import { buildTokens, type TokenKey } from '@/lib/design/tokens';
import { SunIcon } from 'lucide-react-native';
import * as React from 'react';

export const THEME_ICON = SunIcon;

/** SVG 처럼 className 을 못 쓰는 곳에서 토큰 색(hex)을 꺼내 쓴다. 실제 앱에서는 THEME[mode] 를 쓴다. */
export function useCssColor(key: TokenKey) {
  const { state } = useDesign();
  const mode = React.useContext(ScopeModeContext);
  return buildTokens(state, mode)[key];
}
