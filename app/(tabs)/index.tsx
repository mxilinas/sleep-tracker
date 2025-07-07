import { StyleSheet } from 'react-native';

import { QualityQuestionnaire, SleepQuality } from '@/components/QualityQuestionnaire';
import { useState } from 'react';


export default function TabOneScreen() {

    const [quality, setquality] = useState<SleepQuality | null>(null);

    function handleSelect(quality: SleepQuality) {
        console.log(quality);
        setquality(quality);
    }

    return (
        quality == null ? <QualityQuestionnaire onSelect={handleSelect} /> : null
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
