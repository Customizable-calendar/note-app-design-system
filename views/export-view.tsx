import { PanelSection } from '@/components/ds/controls';
import { CodeBlock } from '@/components/ds/frame';
import { Text } from '@/components/ui/text';
import { toGlobalCss, toHeroUiCss, toJson, toTailwindConfig, toThemeTs } from '@/lib/design/export';
import { useDesign } from '@/lib/design/store';
import type { DesignState } from '@/lib/design/tokens';
import { cn } from '@/lib/utils';
import { MainSection, Sheet, Workspace } from '@/views/workspace';
import * as React from 'react';
import { Pressable, View } from 'react-native';

const FORMATS: {
  id: string;
  file: string;
  title: string;
  desc: string;
  make: (s: DesignState) => string;
}[] = [
  {
    id: 'css',
    file: 'global.css',
    title: 'global.css',
    desc: 'react-native-reusables + NativeWind. 색·모서리 값이 모두 여기 있어요. 앱 레포의 global.css 를 이걸로 바꾸면 끝.',
    make: toGlobalCss,
  },
  {
    id: 'theme',
    file: 'lib/theme.ts',
    title: 'lib/theme.ts',
    desc: '아이콘·그래프처럼 className 을 못 쓰는 곳, 네비게이션 테마, 글꼴 이름, AI 채팅 설정(CHAT_DESIGN), 탭·LNB 설정(NAV_DESIGN).',
    make: toThemeTs,
  },
  {
    id: 'tailwind',
    file: 'tailwind.config.js',
    title: 'tailwind.config.js',
    desc: '토큰 이름을 bg-primary-soft, text-event 같은 클래스로 쓰게 해 주는 설정. 색이 바뀌어도 이 파일은 안 바뀌어요.',
    make: () => toTailwindConfig(),
  },
  {
    id: 'heroui',
    file: 'heroui-global.css',
    title: 'HeroUI Native 용',
    desc: '라이브러리를 HeroUI Native 로 정하면 쓸 변수 매핑. 이름이 달라서(primary → accent 등) 변환해 둔 것. 설치 버전의 variables.css 와 대조 필요.',
    make: toHeroUiCss,
  },
  {
    id: 'json',
    file: 'design-tokens.json',
    title: 'design-tokens.json',
    desc: '결정 원본. 레포 docs/ 에 같이 커밋해 두면 나중에 이 페이지로 다시 불러와 이어서 고칠 수 있어요.',
    make: toJson,
  },
];

export function ExportView() {
  const { state } = useDesign();
  const [id, setId] = React.useState('css');
  const fmt = FORMATS.find((f) => f.id === id) ?? FORMATS[0];

  const panel = (
    <>
      <PanelSection title="내보낼 파일" hint="지금 화면에서 정한 값으로 바로 만들어져요">
        <View className="gap-1">
          {FORMATS.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setId(f.id)}
              className={cn('rounded-lg px-3 py-2', f.id === id ? 'bg-slate-900' : 'bg-transparent')}>
              <Text className={cn('font-mono text-[13px] font-semibold', f.id === id ? 'text-white' : 'text-slate-700')}>
                {f.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </PanelSection>
      <PanelSection title="앱 레포에 옮기는 순서">
        {[
          'global.css 를 덮어쓰기',
          'tailwind.config.js 의 colors · borderRadius 를 맞추기 (처음 한 번만)',
          'lib/theme.ts 를 덮어쓰기',
          'components/ui · components/app · components/chat 폴더를 복사',
          'design-tokens.json 을 docs/design/ 에 커밋하고 PR 에 이 페이지 공유 링크 첨부',
        ].map((t, i) => (
          <View key={t} className="flex-row gap-2.5">
            <Text className="w-4 font-mono text-xs text-slate-400">{i + 1}</Text>
            <Text className="flex-1 text-[13px] leading-5 text-slate-700">{t}</Text>
          </View>
        ))}
      </PanelSection>
    </>
  );

  return (
    <Workspace panel={panel}>
      <MainSection title={fmt.title} hint={fmt.desc}>
        <CodeBlock code={fmt.make(state)} filename={fmt.file} maxHeight={720} />
      </MainSection>
      <Sheet className="gap-2">
        <Text className="text-sm font-bold text-slate-800">글꼴은 따로</Text>
        <Text className="text-[13px] leading-6 text-slate-600">
          이 페이지는 웹 글꼴로 보여줘요. 앱에서는 expo-font 로 글꼴 파일(Pretendard 는 SIL OFL 1.1)을 assets/fonts 에 넣고 불러온 뒤,
          lib/font.ts 의 FontContext 에 이름을 넣으면 같은 모양이 돼요.
        </Text>
      </Sheet>
    </Workspace>
  );
}
