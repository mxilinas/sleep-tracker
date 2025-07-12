import { View, StyleSheet, Dimensions, Button } from "react-native";
import NumberWheel, { NumberWheelRef } from "./NumberWheel";
import { useEffect, useRef, useState } from "react";
import { Text } from "./Themed";


const { width } = Dimensions.get('window');

export default function SmartAlarm() {

    const [alarmTime, setAlarmTime] = useState({ hour: 0, minute: 0 });

    const hourWheelRef = useRef<NumberWheelRef>(null);
    const minuteWheelRef = useRef<NumberWheelRef>(null);

    const getHour = () => {
        const number = hourWheelRef.current?.getSelectedNumber();
        console.log('Selected number:', number);
        setAlarmTime({ ...alarmTime, hour: number! });
    };

    const getMinute = () => {
        const number = minuteWheelRef.current?.getSelectedNumber();
        console.log('Selected number:', number);
        setAlarmTime({ ...alarmTime, minute: number! });
    };

    const [elapsedTime, setElapsedTime] = useState(0);


    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            if (currentHour === alarmTime.hour && currentMinute === alarmTime.minute) {
                console.log("alarm triggered");
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
        <View>
            <View style={styles.container}>
                <View style={styles.bar}></View>
                <NumberWheel
                    ref={hourWheelRef}
                    numberRangeEnd={24}
                    paddingLeft={100}
                    height={375}
                    nVisibleNumbers={7}
                />
                <NumberWheel
                    ref={minuteWheelRef}
                    numberRangeEnd={59}
                    paddingRight={100}
                    height={375}
                    nVisibleNumbers={7}
                />
            </View>
            <Button
                onPress={() => {
                    getHour();
                    getMinute();
                }}
                title={'start'}>
            </Button>
            <Text>{elapsedTime}</Text>
        </View>
    );
}

