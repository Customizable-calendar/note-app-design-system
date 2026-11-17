import { DaySectionTitle, TaskCheckRow } from '@/components/app/calendar';
import { CardListRow } from '@/components/app/cards';
import { AgendaRow, Briefing, NoteRow } from '@/components/app/home';
import { Lnb } from '@/components/app/lnb';
import { Scrim } from '@/components/app/overlays';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { HomeScreen } from '@/screens/redesign';
import { FileTextIcon, MicIcon, SearchIcon, SparklesIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

/** 휴대폰: 홈 위에 LNB 드로어가 열린 상태 */
export function DrawerScreen() {
  return (
    <View className="flex-1">
      <HomeScreen quickTools={false} />
      <Scrim />
      <View className="absolute bottom-0 left-0 top-0">
        <Lnb variant="drawer" />
      </View>
    </View>
  );
}

/** 태블릿과 웹: 왼쪽 메뉴 고정에 넓은 홈. 하단 탭바 없음. 휴대폰 홈과 같은 줄 모양을 2단으로 놓아요 */
export function TabletHomeScreen() {
  const [done, setDone] = React.useState(false);
  return (
    <View className="flex-1 flex-row">
      <Lnb variant="sidebar" active="home" />
      <View className="flex-1">
        <View className="h-16 flex-row items-center gap-4 border-b border-border px-8">
          <Text className="flex-1 text-xl font-bold text-foreground">10월 24일 토요일</Text>
          <View className="h-10 w-72 flex-row items-center gap-2 rounded-full bg-muted px-3.5">
            <Icon as={SearchIcon} size={16} className="text-muted-foreground" />
            <Text className="text-sm text-muted-foreground">문서, 일정, 녹음 검색</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Icon as={SparklesIcon} size={16} className="text-ai" />
            <Text className="text-[15px] font-bold text-ai">초안 만들기</Text>
          </View>
        </View>
        <ScrollView contentContainerClassName="gap-8 p-8">
          <Briefing lead="40분 뒤" title="팀 회의" detail="그 전에 견적서 보내기가 남았어요" />
          <View className="flex-row gap-10">
            <View className="flex-1">
              <DaySectionTitle label="일정" count={3} action="캘린더" />
              <AgendaRow start="10:00" end="11:30" title="자료구조 수업" meta="녹음 41분" tone="cal-2" past />
              <View className="h-px bg-border" />
              <AgendaRow start="15:00" end="16:00" title="팀 회의" meta="3층 회의실" action={{ icon: MicIcon, label: '이 일정 녹음하기' }} />
              <View className="h-px bg-border" />
              <AgendaRow start="19:00" end="20:00" title="운동" meta="아직 저장 안 됨" tone="ai" />
              <View className="h-6" />
              <DaySectionTitle label="할 일" count={done ? 1 : 2} />
              <TaskCheckRow flat title="견적서 보내기" meta="팀 회의 전에" status={done ? 'done' : undefined} onToggle={() => setDone((v) => !v)} />
              <View className="h-px bg-border" />
              <TaskCheckRow flat title="과제 제출" meta="23:59 까지" />
            </View>
            <View className="flex-1">
              <DaySectionTitle label="확인할 카드" count={2} action="모두 확인" />
              <CardListRow type="event" title="기획 회의" meta="내일 15:00, 강남, 민수" />
              <View className="h-px bg-border" />
              <CardListRow type="task" title="견적서 보내기" meta="기획 회의 전에" />
              <View className="h-6" />
              <DaySectionTitle label="최근 문서" />
              <NoteRow icon={MicIcon} title="팀 회의 10/24" status="받아쓰는 중 62%" when="방금" isNew />
              <View className="h-px bg-border" />
              <NoteRow icon={FileTextIcon} title="업무일지 10/23" preview="API 연동 테스트를 끝냈고 견적서는 내일로" when="어제" badge="카드 3" />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
