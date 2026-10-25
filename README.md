# note-app-design-system

noteApp(가안)의 디자인 시스템을 **회의 중에 직접 바꿔 보며 정하고**, 정한 값을 **앱 코드로 바로 옮기기** 위한 페이지입니다.
확정안이 아니며 언제든 바뀔 수 있어요.

- 앱과 같은 스택: Expo (React Native) + NativeWind v4 + [react-native-reusables](https://github.com/founded-labs/react-native-reusables) (MIT)
- 웹 브라우저에서 열어 쓰지만, 컴포넌트는 그대로 앱에서 동작하는 React Native 코드입니다.

**배포 주소:** https://customizable-calendar.github.io/note-app-design-system/
(main 에 push 하면 GitHub Actions 가 자동으로 다시 배포해요)

## 실행

```bash
npm install
npm run web        # http://localhost:8090
```

8081 포트는 다른 서버와 겹치지 않도록 8090을 씁니다.

## 페이지 구성

| 탭 | 하는 일 |
|---|---|
| 1. 테마 색 | 메인/서브 색을 RGB 슬라이더·HEX로 바꾸기, 프리셋, 회색 톤, 카드 4종 색, 모서리, 글꼴, 세부 토큰 직접 수정, 대비(WCAG) 검사 |
| 2. 컴포넌트 | 컴포넌트별 구성요소 번호 표시, 각 부분이 쓰는 토큰, 종류·상태, 쓰이는 화면, 코드 |
| 3. 내비게이션 · LNB | 하단 탭 3가지 구성 비교, LNB 드로어(휴대폰)·고정 사이드바(태블릿·웹), 여는 방법·선택 표시·구역, 메뉴 지도 |
| 4. AI 채팅 | AI 강조색, 말풍선 색·모양, 아바타, 채팅 속 카드, 생각 중·오류·첫 화면 상태, 입력창 |
| 5. 화면별 확인 | 목업 11개 + LNB 2개 화면을 라이트/다크로 나란히, 화면마다 확인할 디자인 요소 체크리스트 |
| 6. 사용 시나리오 | 낮 메모 → 카드, 밤 초안, 회의 녹음, AI에게 묻기, 처음 설정 — 단계별 화면과 디자인 확인 포인트 |
| 7. 코드 내보내기 | `global.css`, `lib/theme.ts`, `tailwind.config.js`, HeroUI Native 매핑, `design-tokens.json` |

- 오른쪽 위 **이 설정 링크 복사**: 지금 설정이 URL에 담겨서 팀원이 같은 화면으로 열 수 있어요.
- `?tab=components&c=extracted`, `?tab=screens&screen=capture`, `?tab=scenarios&sc=draft` 처럼 탭·컴포넌트·화면을 링크로 바로 열 수 있어요.
- 바꾼 값과 체크리스트는 그 브라우저에만 저장됩니다 (localStorage).

## 폴더

```
app/                 페이지 진입점 (Expo Router)
components/ui/       react-native-reusables 컴포넌트 (복사본, soft 버튼·글꼴만 추가)
components/app/      앱 전용 컴포넌트: 카드 칩, AI 추출 카드, 탭바, LNB, 시트, 슬래시 메뉴…
components/chat/     AI 채팅 컴포넌트
components/ds/       이 페이지 전용 (편집 패널, 휴대폰 틀, 구성요소 표시)
screens/             목업 화면 재현 + 화면별 확인 포인트
catalog/             컴포넌트 설명·구성요소·코드 예시, 사용 시나리오
views/               탭별 화면
lib/design/          토큰 계산(tokens.ts), 색 계산(color.ts), 내보내기(export.ts), 상태 저장(store.tsx)
design/              tailwind 색 이름 설정 (tailwind.config.js 와 내보내기가 같이 씀)
```

## 앱 레포로 옮길 때

`components/ui`, `components/app`, `components/chat`, `lib/font.ts`는 앱으로 그대로 옮길 코드입니다.
`components/ds`, `views`, `catalog`, `lib/design/store.tsx`는 이 페이지에서만 씁니다.

1. 7번 탭에서 `global.css`, `lib/theme.ts` 복사
2. `tailwind.config.js`의 colors · borderRadius 맞추기 (처음 한 번)
3. 위 컴포넌트 폴더 복사
4. `design-tokens.json`을 docs에 커밋 (나중에 이 페이지에서 다시 불러와 이어서 수정)

기본값(`lib/design/tokens.ts`의 `DEFAULT_STATE`)을 바꾼 뒤 `npm run gen`을 실행하면 이 레포의 `global.css`, `lib/theme.ts`도 다시 만들어집니다.

## 참고

- 기본 색은 기존 `앱 목업.html`에서 뽑았어요 (메인 `#0b6b8a`, 서브 `#b5470b`).
- 글꼴: Pretendard (SIL OFL 1.1), Noto Sans KR (SIL OFL 1.1). 웹에서는 CDN으로 불러오고, 앱에서는 expo-font로 넣어야 합니다.
- HeroUI Native(Apache-2.0) 매핑은 [공식 테마 문서](https://heroui.com/docs/native/getting-started/theming) 기준이며, 설치 버전의 `variables.css`와 대조가 필요합니다.
