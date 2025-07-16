import { Dimensions, StyleSheet, Text, View, ViewStyle } from "react-native"
import { CalendarEntry, SleepQuality } from "./Calendar";

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
