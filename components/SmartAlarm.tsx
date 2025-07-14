import { View, StyleSheet, Dimensions, Button } from "react-native";
import NumberWheel from "./NumberWheel";
import { useEffect, useState } from "react";
import { Text } from "./Themed";

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


export default function SmartAlarm() {

    const [alarmTime, setAlarmTime] = useState({ hour: 0, minute: 0 });

    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(0);

    const wakeWindowStart: string = timeToString(selectedHour, selectedMinute);

    const end = addTime(selectedHour, selectedMinute, wakeWindow);
    const wakeWindowEnd: string = `${timeToString(end.hour, end.minutes)}`;

    const [elapsedTime, setElapsedTime] = useState(0);

    console.log("hour: ", selectedHour);
    console.log("minute: ", selectedMinute);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            if (currentHour === alarmTime.hour && currentMinute === alarmTime.minute) {
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);


    const styles = StyleSheet.create({
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
            <View style={styles.container}>
                <View style={styles.bar}></View>
                <NumberWheel
                    onChanged={(selected) => setSelectedHour(selected)}
                    numberRangeEnd={24}
                    paddingLeft={100}
                    height={375}
                    nVisibleNumbers={7}
                />
                <NumberWheel
                    onChanged={(selected) => setSelectedMinute(selected)}
                    numberRangeEnd={59}
                    paddingRight={100}
                    height={375}
                    nVisibleNumbers={7}
                />
            </View>
            <Text>Wake up between {wakeWindowStart}-{wakeWindowEnd}</Text>
            <Button
                onPress={() => {
                }}
                title={'start'}>
            </Button>
            <Text>{elapsedTime}</Text>
        </View>
    );
}

