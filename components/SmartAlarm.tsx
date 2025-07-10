import { View, StyleSheet, Dimensions, Button } from "react-native";
import NumberWheel from "./NumberWheel";


const { width } = Dimensions.get('window');


export default function SmartAlarm() {

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
                    numberRangeEnd={24}
                    paddingLeft={100}
                    height={375}
                    nVisibleNumbers={7}
                />
                <NumberWheel
                    numberRangeEnd={59}
                    paddingRight={100}
                    height={375}
                    nVisibleNumbers={7}
                />
            </View>
            <Button title={'start'}></Button>
        </View>
    );
}

