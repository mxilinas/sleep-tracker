import { Text, View } from "@/components/Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import HistoryTile from "@/components/HistoryTile";
import { Router, useRouter } from "expo-router";
import { CalendarEntry, SleepQuality, SimpleDate } from "@/components/Calendar";
import { useEffect, useState } from "react";
import { getEntriesInMonth } from "@/db/queries";

export default function SleepHistory() {
  const router = useRouter();
  const currDate = SimpleDate.currentDate();
  const [calendarEntries, setCalendarEntries] = useState<(CalendarEntry | null)[]>([]);

  useEffect(() => {
    (async () => {
      setCalendarEntries(await getEntriesInMonth(currDate)); 
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currDate.toPrettyString()}</Text>
      <View style={styles.historyGrid}>
        {
          calendarEntries.map((entry, i) => {
            return (
              <TouchableOpacity key={i} onPress={() => gotoEntryPage(router, null)}>
                <HistoryTile calendarEntry={entry} text={`${i + 1}`} />
              </TouchableOpacity>
            );
          })
        }
      </View>
    </View>
  )
}

/// Go to the entry (details) page
function gotoEntryPage(router: Router, calendarEntry: CalendarEntry | null) {
  if (calendarEntry === null) {
    return; // for now
  }
  router.push({
    pathname: '/calendar/[date]',
    params: {
      date: calendarEntry.date.toString(),
    },
  });
}

function randInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyGrid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: "wrap",
    marginBottom: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
