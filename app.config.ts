import type { ConfigContext, ExpoConfig } from 'expo/config';
import base from './app.base.json';

// GitHub Pages 처럼 하위 경로에 배포할 때만 EXPO_BASE_URL=/note-app-design-system 을 넣는다
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  ...(base.expo as ExpoConfig),
  experiments: {
    ...base.expo.experiments,
    baseUrl: process.env.EXPO_BASE_URL || undefined,
  },
});
