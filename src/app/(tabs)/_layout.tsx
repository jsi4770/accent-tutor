import { Tabs } from 'expo-router';
import { ColorValue, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

function TabIcon({ emoji, color }: { emoji: string; color: ColorValue }) {
  return <Text style={{ fontSize: 22, color }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{ title: '홈', tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} /> }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '학습 이력',
          tabBarIcon: ({ color }) => <TabIcon emoji="📚" color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: '성적표',
          tabBarIcon: ({ color }) => <TabIcon emoji="📊" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
        }}
      />
    </Tabs>
  );
}
