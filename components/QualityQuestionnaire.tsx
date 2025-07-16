import { Button, Text, Dimensions, StyleSheet, View } from 'react-native';

export enum SleepQuality {
    GOOD,
    FAIR,
    POOR
}

const { width, height } = Dimensions.get('window');

export function QualityQuestionnaire() {
    if (styles == undefined) {
        console.error("Failed to create stylesheet!");
    }

    return (
        <View style={styles.centeredContainer}>
            {/* TODO: this will need to be reworked /*}
            {/* <Text style={styles.title}>How was your sleep?</Text> */}
            {/* <View style={styles.buttonContainer}> */}
            {/*     <Button */}
            {/*         title='Good' */}
            {/*         onPress={() => setSleepData({ */}
            {/*             ...sleepData, */}
            {/*             quality: SleepQuality.GOOD */}
            {/*         })}> */}
            {/*     </Button> */}
            {/*     <Button */}
            {/*         title='Fair' */}
            {/*         onPress={() => setSleepData({ */}
            {/*             ...sleepData, */}
            {/*             quality: SleepQuality.FAIR */}
            {/*         })}> */}
            {/*     </Button> */}
            {/*     <Button */}
            {/*         title='Poor' */}
            {/*         onPress={() => setSleepData({ */}
            {/*             ...sleepData, */}
            {/*             quality: SleepQuality.POOR */}
            {/*         })}> */}
            {/*     </Button> */}
            {/* </View> */}
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
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    buttonContainer: {
        width: 100,
        gap: 5,
    },
    title: {
        fontSize: 35,
    }
})
