import { Text, View } from "@/components/Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import HistoryTile, { SleepQuality, CalendarEntry, YearMonthDay, TimeRange, Time } from "@/components/HistoryTile";
import { Router, useRouter } from "expo-router";

export default function SleepHistory() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getMonthString()}, {getYear()}</Text>
      <View style={styles.historyGrid}>
        {
          // TODO: change this to use actual entry data
          Array.from({ length: getNumDaysOfCurrentMonth() }).map((_, i) => {
            const date = new YearMonthDay(getYear(), getMonth(), i + 1);
            const dummyEntry = randInt(1, 9) === 1 ? null : generateDummyEntry(date);
            return (
              <TouchableOpacity key={i} onPress={() => gotoEntryPage(router, dummyEntry)}>
                <HistoryTile calendarEntry={dummyEntry} text={`${i + 1}`} />
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
      entryStr: JSON.stringify(calendarEntry),
    },
  });
}

/// Get the total number of days in the current month
function getNumDaysOfCurrentMonth() {
  const currDate = new Date();
  // Using 0 as the "day" argument fetches the last day of the previous month
  return new Date(currDate.getFullYear(), (currDate.getMonth() + 1) % 12, 0)
    .getDate();
}

/// Get the current month as a string
function getMonthString() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  return months[getMonth() - 1];
}

/// Get the current month (1 -> Jan, 12 -> Dec)
function getMonth() {
  return new Date().getMonth() + 1;
}

/// Get the current year
function getYear() {
  return new Date().getFullYear();
}

/// Generate a random dummy CalendarEntry for the current month
function generateDummyEntry(date: YearMonthDay): CalendarEntry {
  const sleepQualities = [SleepQuality.POOR, SleepQuality.FAIR, SleepQuality.GOOD];
  const entry = new CalendarEntry(
    date,
    sleepQualities[randInt(0, sleepQualities.length)],
    new TimeRange(
      new Time(randInt(18, 24), randInt(0, 60), randInt(0, 60)),
      new Time(randInt(5, 9), randInt(0, 60), randInt(0, 60)),
    ),
    "Test",
  );
  return entry;
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
