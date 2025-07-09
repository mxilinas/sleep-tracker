import { CalendarEntry } from '@/components/HistoryTile';
import { Text } from '@/components/Themed';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

export default function EntryDetails() {
  const { date, entryStr } = useLocalSearchParams<{ date: string, entryStr: string }>();
  const entry: CalendarEntry = JSON.parse(entryStr);
  console.log(entry.sleepTimeRange.startTime)

  return (
    <>
      <Stack.Screen options={{ title: `Entry from ${prettifyDateString(date)}` }} />
      <Text>Sleep Time: {entry.sleepTimeRange.startTime.toString()}</Text>
      <Text>{entry.notes}</Text>
    </>
  )
}

/// Convert a date string from the format 'Year(#)-Month(#)-Day(#)'
/// to the format 'Month(name) Day(#), Year(#)'
function prettifyDateString(str: string) {
  let yearBuf = "";
  let monthBuf = "";
  let dayBuf = "";

  let i = 0;

  // Get the year
  for (; str[i] != '-'; i++) {
    yearBuf += str[i];
  }
  i++;

  // Get the month
  for (; str[i] != '-'; i++) {
    monthBuf += str[i];
  }
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  monthBuf = months[parseInt(monthBuf) - 1];
  i++;

  // Get the day
  for (; i < str.length; i++) {
    dayBuf += str[i];
  }

  return `${monthBuf} ${dayBuf}, ${yearBuf}`;
}
