import { View, StyleSheet, Dimensions } from "react-native";
import NumberWheel from "./NumberWheel";
import { useEffect, useRef, useState } from "react";
import { Text as StyledText } from "./Themed";
import { useAudioPlayer } from "expo-audio";
import QualityQuestionnaire from "./QualityQuestionnaire";
import CustomButton from "./CustomButton";
import { Time } from "./Calendar";

const { width } = Dimensions.get('window');

function timeToString(hour: number, minute: number) {
  const hourString = hour.toString().padStart(2, '0');
  const minuteString = minute.toString().padStart(2, '0');
  return `${hourString}:${minuteString}`;
}

function addTime(hour: number, minute: number, minutes: number) {
  const totalMinutes = minute + minutes;
  const carryHours = Math.floor(totalMinutes / 60);
  const hours = hour + carryHours;
  return { hour: hours % 24, minutes: totalMinutes - 60 * carryHours };
}

function getTimeAsleep(wakeHour: number, wakeMinute: number): { hour: number, minute: number } {
  var hour = 0;
  var minute = 0;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const diffHours = wakeHour - currentHour;
  const diffMins = wakeMinute - currentMinute;

  if (diffHours > 0) {
    hour = diffHours;
  }
  if (diffHours < 0) {
    hour = 23 - Math.abs(diffHours);
  }

  if (diffMins > 0) {
    minute = diffMins
  }
  if (diffMins < 0) {
    minute = 60 - Math.abs(diffMins)
    if (diffHours <= 0) {
      hour = 23 - Math.abs(diffHours);
    }
  }

  return { hour: hour, minute: minute };
}


type SmartAlarmProps = {
  wakeWindow: 30,
  onStop: (stopTime: Time) => void,
}

function SmartAlarm({ wakeWindow, onStop }: SmartAlarmProps) {

  const alarmSoundSource = require("../alarm.wav");

  const audioPlayer = useAudioPlayer(alarmSoundSource);

  const [started, setstarted] = useState(false);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const startTime = useRef<Time>(null);

  const timeAsleep = getTimeAsleep(selectedHour, selectedMinute);

  const wakeWindowStart: string = timeToString(selectedHour, selectedMinute);

  const end = addTime(selectedHour, selectedMinute, wakeWindow);
  const wakeWindowEnd: string = `${timeToString(end.hour, end.minutes)}`;

  useEffect(() => {
    if (!started) { return; }

    const checkAlarm = setInterval(() => {

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (currentHour === selectedHour && currentMinute === selectedMinute) {
        console.log("Alarm sounding!");
        audioPlayer.seekTo(0);
        audioPlayer.play();
        clearInterval(checkAlarm);
      }

    }, 1000);
    return () => clearInterval(checkAlarm);
  }, [started]);

  const styles = StyleSheet.create({
    buttonContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    wakeWindow: {
      fontSize: 26,
    },
    bar: {
      height: 50,
      width: width / 1.25,
      pointerEvents: 'none',
      zIndex: 0,
      position: 'absolute',
      borderRadius: 20,
      backgroundColor: '#80808066',
    },
    main: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    }
  })

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.bar}></View>
        <NumberWheel
          onChanged={(selected) => setSelectedHour(selected)}
          numberRangeEnd={23}
          paddingLeft={100}
          containerHeight={7 * 50}
          nVisibleNumbers={7}
        />
        <NumberWheel
          onChanged={(selected) => setSelectedMinute(selected)}
          numberRangeEnd={59}
          paddingRight={100}
          containerHeight={7 * 50}
          nVisibleNumbers={7}
        />
      </View>
      <View style={styles.buttonContainer}>
        <StyledText
          style={styles.wakeWindow}>
          Wake up between {wakeWindowStart}-{wakeWindowEnd}
        </StyledText>
        <StyledText style={styles.wakeWindow}>
          Time Asleep: {timeToString(timeAsleep.hour, timeAsleep.minute)}
        </StyledText>
        <CustomButton
          color={'#80cc66'}
          onPress={() => {
            const now = new Date();
            let start = new Time(
              now.getHours(), now.getMinutes(), now.getSeconds()
            );
            startTime.current = start;
            setstarted(true);
          }}
          title={'START'}>
        </CustomButton>
        <CustomButton
          color={'#e66666'}
          title={'STOP'}
          onPress={() => {
            setstarted(false);
            audioPlayer.pause();
            onStop(startTime.current!);
          }}
        />
        <CustomButton
          color={'#e60066'}
          title={'TEST'}
          onPress={() => {
            if (!audioPlayer.playing) {
              audioPlayer.play();
              audioPlayer.seekTo(0);
            }
          }}
        />
      </View>
    </View>
  );
}


export default function Alarm() {
  const [stopped, setStopped] = useState(false);

  const startTime = useRef<Time | null>(null);

  if (!stopped) {
    return (
      <SmartAlarm
        onStop={(start: Time) => {
          setStopped(true)
          startTime.current = start;
        }}
        wakeWindow={30}
      />
    )
  }

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  let stopTime = new Time(currentHour, currentMinute, currentSecond);

  return (
    <View>
      <QualityQuestionnaire
        sleepStart={startTime.current!}
        sleepEnd={stopTime}
      />
    </View>
  )
}
