import { Redirect } from 'expo-router';

import { useSession } from '@/store/session';

export default function Index() {
  const { token } = useSession();
  return <Redirect href={token ? '/(tabs)/home' : '/(auth)/start'} />;
}
