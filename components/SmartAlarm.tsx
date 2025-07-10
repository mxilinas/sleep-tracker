import { Text, StyleSheet, NativeScrollEvent, NativeSyntheticEvent, View, Dimensions, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { FlatList } from "react-native";
import * as Haptics from "expo-haptics";


const { width, height } = Dimensions.get('window');


/** Interpolate a number x such that the function returns 0 when x is close to
* the minimum or maximum.
G* @param min - The minimum value of x
 * @param max - The maximum value of x
 * @param x - The value to be interpolated
 */
function shaping(min: number, max: number, x: number) {
    return 1 - Math.sin((x - min) * Math.PI * (1 / (max - min)));
}


function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

function invlerp(a: number, b: number, v: number): number {
    return (v - a) / (b - a);
}

export default function SmartAlarm() {

    const scrollViewHeight = 550;
    const nVisibleNumbers = 11;
    const numberHeight = scrollViewHeight / nVisibleNumbers;
    const [contentOffset, setContentOffset] = useState(0);

    const current = useRef(Math.floor(nVisibleNumbers / 2));

    const nScrolled = (contentOffset / numberHeight);

    const styles = StyleSheet.create({
        main: {
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            width: width,
        },
        bar: {
            pointerEvents: 'none',
            zIndex: 0,
            position: 'relative',
            top: - (scrollViewHeight / 2) - numberHeight / 2,
            height: numberHeight,
            width: width / 1.25,
            borderRadius: 10,
            backgroundColor: '#80808080',
        },
        container: {
            width: '100%',
            height: scrollViewHeight,
        },
        contentContainer: {
            alignContent: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
        },
    })

    const lastNScrolled = useRef(0);

    const listRef = useRef<FlatList<number> | null>(null);

    useEffect(() => {
        if (listRef.current == null) {
            return;
        }

        const scrollRef = listRef.current.getNativeScrollRef() as ScrollView;

        scrollRef.scrollTo({ y: numberHeight * 12, animated: false });

    }, [listRef])


    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        console.log(nScrolled)

        const nScrolledInt = Math.floor(nScrolled);

        const diff = nScrolled - lastNScrolled.current;

        const scrolledUp: boolean = diff < 0
        const scrolledDown: boolean = diff > 0

        let tic: Boolean = Math.floor(nScrolled) - lastNScrolled.current >= 0.5;

        console.log("int: ", Math.floor(nScrolled))
        console.log("last: ", lastNScrolled.current)

        // If it passes then set state to reset.

        tic = (Math.trunc(lastNScrolled.current * 10) / 10) % 1 == 0.5;

        if (tic) {
            Haptics.selectionAsync();
            if (scrolledDown) {
            }
            if (scrolledUp) {
            }
        }

        setContentOffset(event.nativeEvent.contentOffset.y);
        lastNScrolled.current = nScrolled;
    };

    const [numbers, setnumbers] = useState(
        [-1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, -1, -1, -1, -1, -1]
    );

    return (
        <View style={styles.main} >
            <FlatList
                ref={listRef}
                decelerationRate={0.1}
                showsVerticalScrollIndicator={false}
                snapToStart={true}
                snapToAlignment={"center"}
                snapToInterval={numberHeight}
                bounces={false}
                bouncesZoom={false}
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                onScroll={handleScroll}
                onScrollEndDrag={() => Haptics.selectionAsync()}
                scrollEventThrottle={16}
                data={numbers}
                renderItem={(item) => {
                    const offset = nScrolled;
                    const sint = shaping(offset, (nVisibleNumbers - 1) + offset, item.index);
                    const t = invlerp(offset, (nVisibleNumbers - 1) + offset, item.index);
                    const rotation = lerp(0, 75, sint);
                    const transfactor = 50;
                    const sig = 1 / (1 + Math.pow(Math.E, -40 * (t - 0.5)));
                    const shapingFunc = (t: number, f: number, s: number, k: number) => {
                        const num = Math.tanh(k * (t - f)) + Math.tanh(k * (t - s))
                        return num / 2 + 0.5;
                    }
                    const translation = lerp(transfactor, -transfactor, shapingFunc(t, 0, 1, 10));
                    const opacity = lerp(1, 0.0, sint);
                    const styles = StyleSheet.create({
                        item: {
                            fontFamily: 'SF Mono',
                            fontVariant: ['tabular-nums'],
                            fontSize: numberHeight - 10, // magic wow!
                            height: numberHeight,
                            color: 'black',
                            userSelect: 'none',
                            transform: [
                                { rotateX: `${rotation}deg` },
                                { translateY: translation },
                            ],
                            opacity: opacity
                        }
                    })
                    return (
                        <Text style={styles.item} key={item.index}>
                            {
                                item.item != -1 ? item.item.toString().padStart(2, '0') : ""
                            }
                        </Text>
                    )
                }}
            >
            </FlatList>
            <View style={styles.bar}></View>
        </View>
    )
}
