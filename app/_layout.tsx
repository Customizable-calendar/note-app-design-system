import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { DesignProvider } from '@/lib/design/store';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  return (
    <DesignProvider>
      <ThemeProvider value={NAV_THEME.light}>
        <StatusBar style="dark" />
        <Stack />
        <PortalHost />
      </ThemeProvider>
    </DesignProvider>
  );
}
