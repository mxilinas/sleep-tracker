import React, { useEffect, useRef } from 'react';
import { Animated, TextStyle } from 'react-native';

type FadeInTextProps = {
    children: string;
    duration?: number;
    style?: TextStyle;
};

function FadeInText({ children, duration = 500, style }: FadeInTextProps) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration,
            useNativeDriver: false,
        }).start();
    }, [opacity, duration]);

    return (
        <Animated.Text style={[{ opacity }, style]}>
            {children}
        </Animated.Text>
    );
}

export default FadeInText;
