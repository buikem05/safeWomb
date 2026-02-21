import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: '#a3b899' }, // Soft sage green
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen name="index" options={{ title: 'SafeWomb - Pregnancy' }} />
      <Stack.Screen name="infant" options={{ title: 'SafeWomb - Infant Care' }} />
    </Stack>
  );
}