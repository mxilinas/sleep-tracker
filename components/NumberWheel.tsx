import { Text, StyleSheet, NativeScrollEvent, NativeSyntheticEvent, View, Dimensions, } from "react-native";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import React from "react";
import { FlatList } from "react-native";
import * as Haptics from "expo-haptics";


const { width } = Dimensions.get('window');


/**
 * Maps a value 'x' between 'min' and 'max' to a value between 0 and 1.
 * Behaves like inverse lerp but using the trough of a sin wave instead of
 * a linear function.
 *
 * https://www.desmos.com/calculator/cg0cklo5fb
 *
 * @param min - The lower bound of x.
 * @param max - The upper bound of x.
 * @param x - The value between `min` and `max` to map.
 * @returns A value between 0 and 1.
 */
export function invHalfSin(min: number, max: number, x: number): number {
    return 1 - Math.sin((Math.PI * (x - min) / (max - min)));
}


/**
 * https://www.desmos.com/calculator/jatg9numyf
 * @param t - A value between 0 and 1.
 * @param s - The flatness of the middle of the curve.
 * @returns A number between 0 and 1
 */
export function doubleAction(t: number, s: number): number {
    const num = Math.tanh(s * t) + Math.tanh(s * (t - 1))
    return num / 2 + 0.5;
}


/**
 * https://www.desmos.com/calculator/jatg9numyf
 * @param t - A value between 0 and 1.
 * @param s - The flatness of the middle of the curve.
 * @returns A number between 0 and 1
 */
export function sharpBowl(t: number, s: number): number {
    const num = Math.tanh(s * t) * Math.tanh(s * (t - 1))
    return num / 2 + 0.5;
}


/**
 * Maps a value `t` between 0 and 1 to a value between `a` and `b`.
 *
 * @param a - The start value of the range.
 * @param b - The end value of the range.
 * @param t - The interpolation factor between 0 and 1.
 * @returns The interpolated value between `a` and `b`.
 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}


/**
 * Calculates the interpolation factor `t` that maps a value `v` 
 * back between `a` and `b`.
 *
 * @param a - The start value of the range.
 * @param b - The end value of the range.
 * @param v - The value to inverse interpolate.
 * @returns A value between 0 and 1, the position of `v` between `a` and `b`.
 */
function invlerp(a: number, b: number, v: number): number {
    return (v - a) / (b - a);
}

export type NumberWheelRef = {
    getSelectedNumber: () => number
}

type NumberWheelProps = {
    height: number;
    nVisibleNumbers: number,
    paddingRight?: number,
    paddingLeft?: number,
    numberRangeEnd: number,
}


const NumberWheel = forwardRef<NumberWheelRef, NumberWheelProps>((props: NumberWheelProps, ref) => {

    useImperativeHandle(ref, () => ({
        getSelectedNumber: () => selectedNumber,
    }));

    const padding: number = Math.trunc(props.nVisibleNumbers / 2)

    const genNumbers = () => {
        var numbers = [];
        for (let i = 0; i < padding; i++) {
            numbers.push(-1);
        }
        for (let i = 0; i <= props.numberRangeEnd; i++) {
            numbers.push(i);
        }
        for (let i = 0; i < padding; i++) {
            numbers.push(-1);
        }
        return numbers;
    }

    const numberHeight = props.height / props.nVisibleNumbers;

    const [scrollDistPixels, setScrollDistPixels] = useState(0);

    const scrollDistNumbers = (scrollDistPixels / numberHeight);

    const lastScrollDistNumbers = useRef(0);

    const selectedNumber = Math.floor(scrollDistNumbers + props.nVisibleNumbers / 2) - padding % 25;

    const [distToLastNum, setDistToLastNum] = useState(0);

    const snapped = useRef<boolean>(false);

    const styles = StyleSheet.create({
        container: {
            height: props.height,
        },
        contentContainer: {
            paddingRight: props.paddingRight,
            paddingLeft: props.paddingLeft,
            alignContent: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
        },
    })

    const number = (renderItem: any) => {
        const rangeOffset = scrollDistNumbers;
        const sint = invHalfSin(rangeOffset, (props.nVisibleNumbers - 1) + rangeOffset, renderItem.index);
        const t = invlerp(rangeOffset, (props.nVisibleNumbers - 1) + rangeOffset, renderItem.index);

        const rotation = lerp(0, 75, sint);
        const translation = lerp(100, -100, doubleAction(t, 20));
        const opacity = lerp(1, 0.0, sint);
        const scale = lerp(1.0, 0.5, sharpBowl(t, 10));

        const styles = StyleSheet.create({
            itemContainer: {
                aspectRatio: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: numberHeight,
                color: 'white',
                userSelect: 'none',
                transform: [
                    { rotateX: `${rotation}deg` },
                    { translateY: translation },
                    { scale: scale },
                ],
                opacity: opacity
            },
            item: {
                fontFamily: 'SpaceMono',
                fontSize: 35,
                color: 'white',
            }
        })

        return (
            <View style={styles.itemContainer} key={renderItem.index}>
                <Text style={styles.item}>{renderItem.item != -1 ? renderItem.item.toString().padStart(2, '0') : ""}</Text>
            </View>
        )
    }


    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {

        const dist = Math.abs(scrollDistNumbers - lastScrollDistNumbers.current);

        setDistToLastNum(distToLastNum + dist);

        const pastSnappingThreshold = distToLastNum >= 0.5;

        if (pastSnappingThreshold && !snapped.current) {
            Haptics.selectionAsync();
            snapped.current = true;
        }

        const pastNextNumber = distToLastNum >= 1.0;

        if (pastNextNumber) {
            snapped.current = false;
            setDistToLastNum(0);
        }

        setScrollDistPixels(event.nativeEvent.contentOffset.y);
        lastScrollDistNumbers.current = scrollDistNumbers;
    };

    const handleMomentumEnd = () => {
        snapped.current = false;
        setDistToLastNum(0);
        Haptics.selectionAsync();
    }

    const handleScrollEndDrag = () => {
        setDistToLastNum(0);
    }

    var numbers: number[] = genNumbers();

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            decelerationRate={'fast'}
            snapToStart={true}
            snapToEnd={true}
            snapToInterval={numberHeight}
            bounces={true}
            bouncesZoom={true}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            onMomentumScrollEnd={handleMomentumEnd}
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEndDrag}
            scrollEventThrottle={16}
            data={numbers}
            renderItem={number}
        >
        </FlatList>
    )
});

export default NumberWheel;
