import { Text, View } from "@/components/Themed";
import { Dimensions, StyleSheet } from "react-native";
import HistoryTile, { SleepQuality, CalendarEntry } from "@/components/HistoryTile";

export default function SleepHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getMonth()}, {getYear()}</Text>
      <View style={styles.historyGrid}>
        {Array.from({ length: getNumDaysOfCurrentMonth() }).map((_, i) => (
          <HistoryTile key={i} calendarEntry={generateDummyEntry()} />
        ))}
      </View>
    </View>
  )
}

/// Get the total number of days in the current month
function getNumDaysOfCurrentMonth() {
  const currDate = new Date();
  // Using 0 as the "day" argument fetches the last day of the previous month
  return new Date(currDate.getFullYear(), (currDate.getMonth() + 1) % 12, 0)
    .getDate();
}

/// Get the current month as a string
function getMonth() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  return months[new Date().getMonth()];
}

/// Get the current year as a string
function getYear() {
  return new Date().getFullYear();
}

/// Generate a random dummy CalendarEntry for the current month
function generateDummyEntry(): CalendarEntry {
  const sleepQualities = [SleepQuality.POOR, SleepQuality.FAIR, SleepQuality.GOOD];
  var entry = {
      sleepQuality: sleepQualities[randInt(0, sleepQualities.length)],
      sleepTimeRange: {
        startTime: {hour: randInt(18, 24), minute: randInt(0, 60), second: randInt(0, 60)},
        endTime: {hour: randInt(5, 9), minute: randInt(0, 60), second: randInt(0, 60)},
      },
      notes: "",
  }
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
