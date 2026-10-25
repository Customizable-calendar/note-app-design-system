import {
  CaptureScreen,
  ChatScreen,
  DraftScreen,
  EditorScreen,
  RecordScreen,
  SettingsScreen,
} from '@/screens/flows';
import { CardsScreen, FeedScreen, HomeScreen, SearchScreen, SessionsScreen } from '@/screens/tabs';
import type * as React from 'react';

export type ScreenSpec = {
  id: string;
  name: string;
  group: '기존 목업' | '절충안 (새 화면)';
  Component: React.ComponentType;
  /** 회의에서 같이 볼 디자인 포인트 */
  checks: { title: string; detail: string }[];
  /** 이 화면에 쓰인 컴포넌트 id (컴포넌트 탭과 연결) */
  uses: string[];
};

export const SCREENS: ScreenSpec[] = [
  {
    id: 'home',
    name: '홈',
    group: '기존 목업',
    Component: HomeScreen,
    uses: ['button', 'schedule', 'fab', 'tabbar'],
    checks: [
      { title: 'AI 추천 배너', detail: '메인 연한 면 위 글자 대비가 충분한지, 버튼이 배너 안에서 묻히지 않는지' },
      { title: '일정 시간 열', detail: '시간 글자 굵기·너비가 맞아서 세 줄이 세로로 정렬되는지' },
      { title: '외부 출처 색', detail: 'Google 캘린더 표시(서브 색)가 일정 카드 색(주황)과 헷갈리지 않는지' },
      { title: '떠 있는 버튼 2개', detail: '녹음·AI 버튼이 최근 문서와 탭바를 가리지 않는지, 어느 쪽이 주 행동인지' },
      { title: '탭바 선택 상태', detail: '선택 탭이 색만이 아니라 굵기로도 구분되는지' },
    ],
  },
  {
    id: 'cards',
    name: '오늘 카드',
    group: '절충안 (새 화면)',
    Component: CardsScreen,
    uses: ['chip', 'extracted', 'filter', 'tabbar', 'button'],
    checks: [
      { title: '카드 4종 색', detail: '일정·할 일·사람·아이디어가 한눈에 구분되는지 (색약도 글자 라벨로 구분 가능)' },
      { title: '확인 대기 묶음', detail: '아직 저장 안 된 카드가 확정 카드와 확실히 달라 보이는지 (점선 + 연한 면)' },
      { title: '확정 목록 밀도', detail: '한 줄 높이와 칩 크기가 너무 빽빽하거나 헐렁하지 않은지' },
      { title: '하단 초안 버튼', detail: '화면의 주 행동이 하나로 보이는지' },
    ],
  },
  {
    id: 'capture',
    name: '빠른 입력',
    group: '절충안 (새 화면)',
    Component: CaptureScreen,
    uses: ['extracted', 'chip', 'button', 'input'],
    checks: [
      { title: '제안 vs 확정', detail: '마지막 아이디어 카드(확정)와 위 3장(제안)의 차이가 보이는지' },
      { title: '버튼 우선순위', detail: '확인(채움) > 고치기·버리기(테두리) 순서가 자연스러운지' },
      { title: 'AI 표시', detail: 'AI가 만든 결과라는 표시(반짝이 + AI 색)가 일관된지' },
      { title: '원문 입력창', detail: '막 쓴 메모가 카드보다 덜 눈에 띄면서도 읽기 편한지' },
    ],
  },
  {
    id: 'chat',
    name: 'AI 채팅',
    group: '절충안 (새 화면)',
    Component: ChatScreen,
    uses: ['chat'],
    checks: [
      { title: '말풍선 구분', detail: '내 말과 AI 답이 색·위치·모양으로 확실히 나뉘는지' },
      { title: '채팅 속 카드', detail: '대화 안에서 뽑은 카드가 빠른 입력 화면의 카드와 같은 모양인지' },
      { title: '출처 표시', detail: '답의 근거(카드·문서)가 너무 작거나 시끄럽지 않은지' },
      { title: '입력창', detail: '보내기 버튼 색이 AI 색과 맞는지, 비용 문구가 방해되지 않는지' },
    ],
  },
  {
    id: 'sessions',
    name: '세션',
    group: '기존 목업',
    Component: SessionsScreen,
    uses: ['button', 'card'],
    checks: [
      { title: '세션 아이콘 타일', detail: '메인·서브·회색 세 가지 면 색이 세션 구분에 충분한지' },
      { title: '선택된 템플릿', detail: '두꺼운 테두리 + 연한 면 조합이 선택 상태로 읽히는지' },
      { title: '점선 버튼', detail: 'AI로 새 양식 만들기가 비활성처럼 보이지 않는지' },
    ],
  },
  {
    id: 'editor',
    name: '편집기',
    group: '기존 목업',
    Component: EditorScreen,
    uses: ['badge', 'slash', 'checkbox', 'chip'],
    checks: [
      { title: '글자 크기 단계', detail: '제목(28) · 소제목(18) · 본문(15) · 보조(14) 단계가 충분히 구분되는지' },
      { title: '카드 블록', detail: '문서 안에 끼운 카드가 본문과 구분되면서 튀지 않는지' },
      { title: '슬래시 메뉴', detail: '선택된 행 강조와 AI 항목 색' },
      { title: '키보드 위 툴바', detail: '가운데 AI 버튼 크기와 나머지 아이콘 간격' },
    ],
  },
  {
    id: 'draft',
    name: 'AI 초안 시트',
    group: '기존 목업',
    Component: DraftScreen,
    uses: ['sheet', 'button', 'input'],
    checks: [
      { title: '뒤 화면 가림', detail: '어둡게 덮는 정도와 시트 그림자' },
      { title: '카드 칩 선택', detail: '눌러서 켜고 끄는 상태가 확실히 보이는지 (칩을 직접 눌러 보세요)' },
      { title: '비용 문구', detail: '예상 토큰 문구 크기와 위치' },
    ],
  },
  {
    id: 'record',
    name: '녹음',
    group: '기존 목업',
    Component: RecordScreen,
    uses: [],
    checks: [
      { title: '녹음 중 표시', detail: '서브 색이 경고·오류(빨강)와 헷갈리지 않는지' },
      { title: '정지 버튼', detail: '지름 80 이상, 한 손으로 누르기 쉬운지' },
      { title: '받아쓰기 미리보기', detail: '긴 글 줄 간격과 대비' },
    ],
  },
  {
    id: 'feed',
    name: '피드',
    group: '기존 목업',
    Component: FeedScreen,
    uses: ['filter', 'avatar'],
    checks: [
      { title: '필터 칩', detail: '선택 칩(진한 면)과 나머지 칩의 대비' },
      { title: 'AI 표시', detail: '"AI 초안 → 직접 수정" 표시가 너무 강하거나 약하지 않은지' },
      { title: '반응 버튼', detail: '아이콘 크기와 누르는 영역(최소 44)' },
    ],
  },
  {
    id: 'search',
    name: '검색',
    group: '기존 목업',
    Component: SearchScreen,
    uses: ['segment'],
    checks: [
      { title: '그래프 노드 색', detail: '중심(메인) · 문서(회색) · 일정(카드 일정 색)이 구분되는지' },
      { title: '목록/그래프 전환', detail: '세그먼트 선택 상태' },
      { title: '검색창', detail: '회색 면 위 안내 글자 대비' },
    ],
  },
  {
    id: 'settings',
    name: '설정',
    group: '기존 목업',
    Component: SettingsScreen,
    uses: ['controls', 'progress'],
    checks: [
      { title: '켜짐 상태 색', detail: '라디오·스위치가 메인 색으로 통일되는지 (직접 눌러 보세요)' },
      { title: '보안 안내', detail: 'API 키 안내 문구가 잘 보이는지' },
      { title: '사용량 바', detail: '진행 바 색과 두께' },
    ],
  },
];
