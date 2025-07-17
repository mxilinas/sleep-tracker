import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

import Alarm from '@/components/SmartAlarm';

export default function TabOneScreen() {

  const [data, setData] = useState(0);

  return (
    <View>
      <Alarm />
    </View>
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
