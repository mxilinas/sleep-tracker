import { CalendarEntry, SimpleDate, SleepQuality } from '@/components/Calendar';
import { Text as StyledText } from '@/components/Themed';
import { getEntryFromDate } from '@/db/queries';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function EntryDetails() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [entry, setEntry] = useState<CalendarEntry | null>(null);

  useEffect(() => {
    (async () => {
      setEntry(await getEntryFromDate(SimpleDate.fromString(date)));
    })()
  }, [])


  type StringCallback = () => string;
  const entryText = (entry: CalendarEntry | null, callback: StringCallback) => {
    return `${entry === null ? '...' : callback()}`;
  }

  const QualityText: Map<SleepQuality, string> = new Map([
    [SleepQuality.POOR, "Poor"],
    [SleepQuality.FAIR, "Fair"],
    [SleepQuality.GOOD, "Good"],
  ]);

  return (
    <>
      <Stack.Screen options={{ title: `Entry from ${entryText(entry, () => { return entry!.date.toPrettyString(); })}` }} />
      <Text style={styles.qualityText}>Sleep Quality: {entryText(entry, () => { return QualityText.get(entry!.sleepQuality)!; })}</Text>
      <Text style={styles.sleepTimeText}>Sleep Time: {entryText(entry, () => { return entry!.sleepTime.toString(); })}</Text>
      <View style={styles.notesContainer}>
        <Text style={styles.notes}>Notes: {entryText(entry, () => { return entry!.notes; })}</Text>
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  qualityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  sleepTimeText: {
    fontSize: 18,
    color: 'black',
  },
  notesContainer: {
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  notes: {
    fontSize: 12,
    fontWeight: 'semibold',
    color: '#202320',
  }
})
