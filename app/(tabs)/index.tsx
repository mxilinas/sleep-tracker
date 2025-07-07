import { StyleSheet } from 'react-native';

import { QualityQuestionnaire } from '@/components/QualityQuestionnaire';

import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (date: string, value: string) => {
    try {
        await AsyncStorage.setItem(date, JSON.stringify(value));
    } catch (e) {
        console.error(e);
    }
}

export default function TabOneScreen() {
    return (
        <QualityQuestionnaire />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
