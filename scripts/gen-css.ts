/// <reference types="node" />
// 기본값(DEFAULT_STATE)으로 global.css 와 lib/theme.ts 를 다시 만든다: npm run gen
import { writeFileSync } from 'node:fs';
import { toGlobalCss, toThemeTs } from '../lib/design/export';
import { DEFAULT_STATE } from '../lib/design/tokens';

writeFileSync('global.css', toGlobalCss(DEFAULT_STATE));
writeFileSync('lib/theme.ts', toThemeTs(DEFAULT_STATE));
console.log('global.css, lib/theme.ts 생성 완료');
