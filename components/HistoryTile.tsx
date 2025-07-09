import { Dimensions, StyleSheet, ViewStyle } from "react-native"
import { Text, View } from "./Themed"

// =======================  TODO: Replace with actual object type (start)
export class CalendarEntry {
  date: YearMonthDay;
  sleepQuality: SleepQuality;
  // timeVolume: TimeVolumeSeries, NOTE: may later implement
  sleepTimeRange: TimeRange;
  notes: string;

  constructor(date: YearMonthDay, sleepQuality: SleepQuality,
    sleepTimeRange: TimeRange, notes: string) {
    this.date = date;
    this.sleepQuality = sleepQuality;
    this.sleepTimeRange = sleepTimeRange;
    this.notes = notes;
  }
}

export class YearMonthDay {
  day: number;
  month: number;
  year: number;

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  toString() {
    return `${this.year}-${this.month}-${this.day}`
  }
}

export enum SleepQuality {
  POOR,
  FAIR,
  GOOD,
}

// TODO: maybe use later
// export interface TimeVolumeSeries {
//   series: Array<{ time: Time, volume: Decibel }>
// }

/// Time should be given in 24-hour format
export class Time {
  hour: number;
  minute: number;
  second: number;

  constructor(hour: number, minute: number, second: number) {
    this.hour = hour;
    this.minute = minute;
    this.second = second;
  }

  toString() {
    return `${this.hour}:${this.minute}:${this.second}`;
  }
}
export type Decibel = number

export class TimeRange {
  startTime: Time;
  endTime: Time;

  constructor(startTime: Time, endTime: Time) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  toString() {
    return `${this.startTime.toString()}-${this.endTime.toString()}`;
  }
}
// =======================  TODO: Replace with actual object type (end)

export default function HistoryTile({ calendarEntry, text }: { calendarEntry: CalendarEntry | null, text: string }) {
  if (calendarEntry === null) {
    return (
      <View style={styles.emptyTile}>
        <Text style={styles.dayText}>{text}</Text>
      </View>
    )
  }
  return (
    <View style={
      calendarEntry.sleepQuality == SleepQuality.POOR ? styles.poorTile
        : (calendarEntry.sleepQuality == SleepQuality.FAIR ? styles.fairTile
          : styles.goodTile)}>
      <Text style={styles.dayText}>{text}</Text>
    </View>
  )
}


const screenWidth = Dimensions.get('screen').width;
const TILE_MARGIN = 4;
const NUM_COLUMNS = 7;
const TOTAL_GAP = TILE_MARGIN * 2 * NUM_COLUMNS;
const SCREEN_WIDTH_OFFSET = (screenWidth / NUM_COLUMNS) % 2; // The value to subtract to remove the fractional component
const TILE_WIDTH = (screenWidth - SCREEN_WIDTH_OFFSET - TOTAL_GAP) / NUM_COLUMNS;

const baseTile: ViewStyle = {
  display: 'flex',
  width: TILE_WIDTH,
  height: TILE_WIDTH,
  margin: TILE_MARGIN,
  borderRadius: 8,
};

const baseTileHover: ViewStyle = {
  backgroundColor: 'black',
}

const styles = StyleSheet.create({
  goodTile: {
    ...baseTile,
    backgroundColor: '#7CB342',
  },
  fairTile: {
    ...baseTile,
    backgroundColor: '#C16733',
  },
  poorTile: {
    ...baseTile,
    backgroundColor: '#800020',
  },
  emptyTile: {
    ...baseTile,
    backgroundColor: '#9DA8AF',
  },
  dayText: {
    color: '#ffffff',
    fontWeight: 'bold',
    paddingHorizontal: 4,
  }
})
