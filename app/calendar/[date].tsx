import { Text as StyledText } from '@/components/Themed';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

export default function EntryDetails() {
  const { date } = useLocalSearchParams<{ date: string }>();

  return (
    <>
      <Stack.Screen options={{ title: `Entry from ${date}` }} />
    </>
  )
}

