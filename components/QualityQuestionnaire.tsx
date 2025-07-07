import { Button, Text, Dimensions, StyleSheet, View } from 'react-native';

export enum SleepQuality {
    GOOD,
    FAIR,
    POOR
}

const { width, height } = Dimensions.get('window');

type QuestionnaireProps = {
    onSelect: (quality: SleepQuality) => void;
}

export function QualityQuestionnaire({ onSelect }: QuestionnaireProps) {

    if (styles == undefined) {
        console.error("Failed to create stylesheet!");
    }

    return (
        <View style={styles.centeredContainer}>
            <Text style={styles.title}>How was your sleep?</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title='Good'
                    onPress={() => onSelect(SleepQuality.GOOD)}>
                </Button>
                <Button
                    title='Fair'
                    onPress={() => onSelect(SleepQuality.FAIR)}>
                </Button>
                <Button
                    title='Poor'
                    onPress={() => onSelect(SleepQuality.POOR)}>
                </Button>
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
