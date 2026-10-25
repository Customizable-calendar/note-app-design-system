import { ExtractedCard, ScheduleRow, SectionLabel } from '@/components/app/cards';
import { Lnb } from '@/components/app/lnb';
import { Scrim } from '@/components/app/overlays';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { HomeScreen } from '@/screens/tabs';
import { SearchIcon, SparklesIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

/** 휴대폰: 홈 위에 LNB 드로어가 열린 상태 */
export function DrawerScreen() {
  return (
    <View className="flex-1">
      <HomeScreen />
      <Scrim />
      <View className="absolute bottom-0 left-0 top-0">
        <Lnb variant="drawer" />
      </View>
    </View>
  );
}

/** 태블릿·웹: LNB 고정 + 넓은 홈. 하단 탭바 없음 */
export function TabletHomeScreen() {
  return (
    <View className="flex-1 flex-row">
      <Lnb variant="sidebar" active="home" />
      <View className="flex-1">
        <View className="h-16 flex-row items-center gap-4 border-b border-border px-8">
          <Text className="flex-1 text-xl font-bold text-foreground">10월 24일 토요일</Text>
          <View className="h-10 w-72 flex-row items-center gap-2 rounded-lg bg-muted px-3">
            <Icon as={SearchIcon} size={16} className="text-muted-foreground" />
            <Text className="text-sm text-muted-foreground">문서, 일정, 녹음 검색</Text>
          </View>
          <Button>
            <Icon as={SparklesIcon} size={16} />
            <Text>초안 만들기</Text>
          </Button>
        </View>
        <ScrollView contentContainerClassName="flex-row gap-6 p-8">
          <View className="flex-1 gap-3">
            <SectionLabel>오늘 일정</SectionLabel>
            <ScheduleRow time="10:00" title="자료구조 수업" meta="노트: 자료구조 7주차" />
            <ScheduleRow time="15:00" title="팀 회의" meta="Google 캘린더" metaTone="external" />
            <ScheduleRow time="23:59" title="과제 마감" meta="노트: 자료구조 7주차" badge="D-7" />
            <View className="mt-3 gap-2 rounded-xl bg-primary-soft p-5">
              <View className="flex-row items-center gap-1.5">
                <Icon as={SparklesIcon} size={15} className="text-ai" />
                <Text className="text-[13px] font-bold text-ai">AI 추천</Text>
              </View>
              <Text className="text-base font-bold text-foreground">확인한 카드 7장으로 업무일지 초안을 만들 수 있어요.</Text>
            </View>
          </View>
          <View className="flex-1 gap-3">
            <SectionLabel right={<Text className="text-[13px] font-bold text-primary">모두 확인</Text>}>확인 대기 2</SectionLabel>
            <ExtractedCard type="task" title="견적서 보내기" meta="기획 회의 전에" />
            <ExtractedCard
              type="person"
              title="민수"
              meta="처음 보는 이름이에요"
              actions={[{ label: '추가', primary: true }, { label: '사람 아님' }]}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
