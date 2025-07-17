import { Button, Dimensions, StyleSheet, View } from 'react-native';
import { Text as StyledText } from "./Themed";
import CustomButton from './CustomButton';

enum SleepQuality {
  GOOD,
  FAIR,
  POOR
}

const { width, height } = Dimensions.get('window');

export default function QualityQuestionnaire() {
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
          onPress={() => { }}>
        </CustomButton>
        <CustomButton
          color={"#bf9040"}
          title='Fair'
          onPress={() => { }}>
        </CustomButton>
        <CustomButton
          color={"#bf4040"}
          title='Poor'
          onPress={() => { }}>
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
