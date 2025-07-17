import { Dimensions, StyleSheet, View } from 'react-native';
import { Text as StyledText } from "./Themed";
import CustomButton from './CustomButton';
import { SleepQuality, Time, TimeRange, SimpleDate, CalendarEntry } from './Calendar';
import { insertEntry } from '@/db/queries';


const { width, height } = Dimensions.get('window');


async function addEntry(quality: SleepQuality, sleepStart: Time, sleepEnd: Time) {
  console.log("added entry");
  const simpleDate = SimpleDate.currentDate();
  const entry = new CalendarEntry(
    simpleDate, quality, new TimeRange(sleepStart, sleepEnd), ""
  );
  await insertEntry(entry);
}


type QualityQuestionnaireProps = {
  sleepStart: Time,
  sleepEnd: Time,
};


export default function QualityQuestionnaire({ sleepStart, sleepEnd }: QualityQuestionnaireProps) {
  if (styles == undefined) {
    console.error("Failed to create stylesheet!");
  }

  return (
    <View style={styles.centeredContainer}>
      <StyledText style={styles.title}>How was your sleep?</StyledText>
      <View style={styles.buttonContainer}>
        <CustomButton
          color={"#59bf40"}
          title='Good'
          onPress={async () => { await addEntry(SleepQuality.GOOD, sleepStart, sleepEnd) }}>
        </CustomButton>
        <CustomButton
          color={"#bf9040"}
          title='Fair'
          onPress={async () => { await addEntry(SleepQuality.FAIR, sleepStart, sleepEnd) }}>
        </CustomButton>
        <CustomButton
          color={"#bf4040"}
          title='Poor'
          onPress={async () => { await addEntry(SleepQuality.POOR, sleepStart, sleepEnd) }}>
        </CustomButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: width / 3,
    height: height / 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContainer: {
    gap: 20,
    height: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  buttonContainer: {
  },
  title: {
    fontSize: 35,
  }
})
