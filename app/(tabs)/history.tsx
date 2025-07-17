import { Text as StyledText, View as StyledView } from "@/components/Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import HistoryTile from "@/components/HistoryTile";
import { Router, useRouter } from "expo-router";
import { CalendarEntry, SleepQuality, SimpleDate, Time, TimeRange } from "@/components/Calendar";
import { useEffect, useState } from "react";
import { getAllEntries, getEntriesInMonth, getEntryFromDate, insertEntry } from "@/db/queries";

export default function SleepHistory() {
  const router = useRouter();
  const currDate = SimpleDate.currentDate();
  const [calendarEntries, setCalendarEntries] = useState<(CalendarEntry | null)[]>([]);

  useEffect(() => {
    (async () => {
      // // TODO: Remove this test
      // const todayEntry = await getEntryFromDate(new SimpleDate(2025, 7, 17));
      // if (todayEntry !== null) {
      //   console.log("Already exists!");
      // } else {
      //   const testEntry = new CalendarEntry(
      //     new SimpleDate(2025, 7, 17),
      //     SleepQuality.FAIR,
      //     new TimeRange(new Time(19, 40, 20), new Time(8, 0, 0)),
      //     "Spooky scary nightmare but other than that alright!",
      //   );
      //   await insertEntry(testEntry);
      // }
      setCalendarEntries(await getEntriesInMonth(currDate));
    })();
  }, []);

  return (
    <StyledView style={styles.container}>
      <StyledText style={styles.title}>{currDate.toPrettyString()}</StyledText>
      <StyledView style={styles.historyGrid}>
        {
          calendarEntries.map((entry, i) => {
            return (
              <TouchableOpacity key={i} onPress={() => gotoEntryPage(router, entry)}>
                <HistoryTile calendarEntry={entry} text={`${i + 1}`} />
              </TouchableOpacity>
            );
          })
        }
      </StyledView>
    </StyledView>
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
