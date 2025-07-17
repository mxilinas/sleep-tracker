import { TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import NumberWheel from "./NumberWheel";
import { useEffect, useState } from "react";
import { Text as StyledText } from "./Themed";
import { useAudioPlayer } from "expo-audio";

/** Time span for waking window. 30 = 30 minutes */
const wakeWindow = 30;

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

function getHoursAsleep(currentHour: number, wakeHour: number) {
    const hoursAsleep = wakeHour - currentHour;
    if (hoursAsleep < 0) {
        return 24 - Math.abs(hoursAsleep);
    }
    if (hoursAsleep == 0) {
        return 24;
    }
    return hoursAsleep;
}

type ButtonProps = {
    onPress: () => void,
    title: string,
    color: string,
}

function CustomButton({ onPress, title, color }: ButtonProps) {

    const styles = StyleSheet.create({
        button: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: width,
            height: 100,
            backgroundColor: color,
        },
        title: {
            fontSize: 50,
        }
    })

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
        >
            <StyledText style={styles.title}>
                {title}
            </StyledText>
        </TouchableOpacity>
    )
}

const alarmSoundSource = require("../alarm.wav");

export default function SmartAlarm() {

    const audioPlayer = useAudioPlayer(alarmSoundSource);

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const [started, setstarted] = useState(false);

    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(0);

    const hoursAsleep = getHoursAsleep(currentHour, selectedHour);

    const wakeWindowStart: string = timeToString(selectedHour, selectedMinute);

    const end = addTime(selectedHour, selectedMinute, wakeWindow);
    const wakeWindowEnd: string = `${timeToString(end.hour, end.minutes)}`;

    const hoursRemaining = Math.max(0, selectedHour - currentHour);
    const minutesRemaining = Math.max(0, selectedMinute - currentMinute);

    useEffect(() => {
        if (!started) {
            return;
        }
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
    }, [started, currentHour, currentMinute]);


    const styles = StyleSheet.create({
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
            backgroundColor: '#1a1a1aff',
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        }
    })

    return (
        <View style={styles.main}>
            <StyledText style={styles.wakeWindow}>Time: {`${currentHour}:${currentMinute}`} </StyledText>
            <View style={styles.container}>
                <View style={styles.bar}></View>
                <NumberWheel
                    onChanged={(selected) => setSelectedHour(selected)}
                    numberRangeEnd={24}
                    paddingLeft={100}
                    height={7*50}
                    nVisibleNumbers={7}
                />
                <NumberWheel
                    onChanged={(selected) => setSelectedMinute(selected)}
                    numberRangeEnd={59}
                    paddingRight={100}
                    height={7*50}
                    nVisibleNumbers={7}
                />
            </View>
            <StyledText
                style={styles.wakeWindow}>
                Wake up between {wakeWindowStart}-{wakeWindowEnd}
            </StyledText>
            <CustomButton
                color={'#80cc66'}
                onPress={() => { setstarted(true); }}
                title={'START'}>
            </CustomButton>
            <CustomButton
                color={'#e66666'}
                title={'STOP'}
                onPress={() => {
                    setstarted(false);
                    audioPlayer.pause();
                }}
            />
            <StyledText style={styles.wakeWindow}> Total hours: {hoursAsleep} </StyledText>
            <StyledText style={styles.wakeWindow}> Time Remaining: {hoursRemaining}:{minutesRemaining} </StyledText>
        </View>
    );
}

