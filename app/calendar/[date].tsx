import { CalendarEntry, SimpleDate, SleepQuality } from '@/components/Calendar';
import { TileColor } from '@/components/HistoryTile';
import { getAllEntries, getEntryFromDate } from '@/db/queries';
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const getQualityColor = (entry: CalendarEntry | null) => {
  if (entry === null) {
    return "#00000000";
  }
  switch (entry.sleepQuality) {
    case SleepQuality.POOR:
      return TileColor.POOR;
    case SleepQuality.FAIR:
      return TileColor.FAIR;
    case SleepQuality.GOOD:
      return TileColor.GOOD;
  }
}

export default function EntryDetails() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [entry, setEntry] = useState<CalendarEntry | null>(null);

  useEffect(() => {
    (async () => {
      const entryFromDate = await getEntryFromDate(SimpleDate.fromString(date));
      setEntry(entryFromDate);
    })()
  }, [])

  async function printall() {
    const entries = await getAllEntries();
  }

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
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.innerContainer}>
            <Text style={styles.containerTitle}>Sleep Quality</Text>
            <Text style={[styles.qualityText, { backgroundColor: getQualityColor(entry) }]}>{entryText(entry, () => { return QualityText.get(entry!.sleepQuality)!; })}</Text>
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.containerTitle}>Sleep Time</Text>
            <Text style={styles.timeText}>{entryText(entry, () => { return entry!.sleepTime.startTime.toString(); })}  🌙</Text>
            <Text style={styles.timeText}>{entryText(entry, () => { return entry!.sleepTime.endTime.toString(); })}  ☀️</Text>
          </View>
        </View>
        <View style={styles.notesContainer}>
          <Text style={styles.notes}>Notes: {entryText(entry, () => { return entry!.notes; })}</Text>
        </View>
      </View >
    </>
  )
}


const styles = StyleSheet.create({
  topContainer: {
    padding: 24,
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    height: "100%",
    backgroundColor: "white",
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
  },
  innerContainer: {
    padding: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e1e1d',
    borderRadius: 25,
    marginHorizontal: 16,
  },
  qualityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 30,
    paddingVertical: 7,
    borderRadius: 100,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'semibold',
    paddingVertical: 5,
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
  },
  containerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 24,
  }
})
