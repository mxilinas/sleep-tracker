import React, { useMemo } from "react";
import {
  Text,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ScrollView,
} from "react-native";
import { useRef, useState } from "react";
import { FlatList } from "react-native";
import { Platform } from 'react-native';
import * as Haptics from "expo-haptics";
import * as Interp from "../utils/interpolation";

type NumberWheelProps = {
  containerHeight: number;
  nVisibleNumbers: number,
  onChanged?: (selectedNumber: number) => void;
  paddingRight?: number,
  paddingLeft?: number,
  numberRangeEnd: number,
}


const PLACEHOLDER = -1 as const;
type Placeholder = typeof PLACEHOLDER;
type Number = Placeholder | number;


export default function NumberWheel(props: NumberWheelProps) {

  const numberHeight = props.containerHeight / props.nVisibleNumbers;
  const nPlaceHolders: number = Math.trunc(props.nVisibleNumbers / 2)

  /** The total distance scrolled, measured in pixels. */
  const [scrollDistPixels, setScrollDistPixels] = useState(0);

  /** The total distance scrolled, measured in numbers. */
  const scrollDistNumbers = (scrollDistPixels / numberHeight);
  const lastScrollDistNumbers = useRef(0);

  const numbers: Number[] = useMemo(() => {
    const placeholders = Array(nPlaceHolders).fill(PLACEHOLDER);
    const range = Array.from({ length: props.numberRangeEnd + 1 }, (_, i) => i);
    return [...placeholders, ...range, ...placeholders];
  }, [nPlaceHolders, props.numberRangeEnd]);

  const lastSelectedNumber = useRef(0);
  const getSelectedNumber = () => {
    const center = Math.floor(scrollDistNumbers + props.nVisibleNumbers / 2)
    return center - nPlaceHolders % 25
  }

  const flatListRef = useRef<FlatList | null>(null);

  const distToLastNum = useRef(0);

  const snapped = useRef<boolean>(false);

  const styles = StyleSheet.create({
    container: {
      height: props.containerHeight,
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
    const containerHeight = scrollDistNumbers + (props.nVisibleNumbers - 1);

    const t = Interp.invlerp(scrollDistNumbers, containerHeight, renderItem.index);
    const sint = Interp.invHalfSin(scrollDistNumbers, containerHeight, renderItem.index);

    const rotationFactor = sint;
    const opacityFactor = sint;
    const translationFactor = Interp.doubleAction(t, 20);
    const scaleFactor = Interp.sharpBowl(t, 10);

    // !!! Parameterize this.
    const rotation = Interp.lerp(0, 75, rotationFactor);
    const opacity = Interp.lerp(1, 0.0, opacityFactor);
    const translation = Interp.lerp(100, -100, translationFactor);
    const scale = Interp.lerp(1.0, 0.5, scaleFactor);

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
        fontSize: 28,
        color: 'white',
      }
    })

    const getNumberText = () => {
      if (renderItem.item != PLACEHOLDER) {
        return renderItem.item.toString().padStart(2, '0');
      }
      return "";
    }

    return (
      <View style={styles.itemContainer} key={renderItem.index}>
        <Text style={styles.item}>{getNumberText()}</Text>
      </View>
    )
  }

  const updateLastSelectedNumber = () => {
    const selectedNumber = getSelectedNumber();
    if (selectedNumber == lastSelectedNumber.current)
      return;
    if (selectedNumber < 0 || selectedNumber > props.numberRangeEnd) {
      lastSelectedNumber.current = selectedNumber;
      return;
    }
    props.onChanged?.(selectedNumber);
    lastSelectedNumber.current = selectedNumber;
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {

    const dist = Math.abs(scrollDistNumbers - lastScrollDistNumbers.current);

    distToLastNum.current = distToLastNum.current + dist;

    const pastSnappingThreshold = distToLastNum.current >= 0.5;

    if (pastSnappingThreshold && !snapped.current) {
      Haptics.selectionAsync();
      snapped.current = true;
      updateLastSelectedNumber();
    }

    const pastNextNumber = distToLastNum.current >= 1.0;

    if (pastNextNumber) {
      snapped.current = false;
      distToLastNum.current = 0;
    }

    setScrollDistPixels(event.nativeEvent.contentOffset.y);
    lastScrollDistNumbers.current = scrollDistNumbers;
  };

  const handleMomentumEnd = () => {
    snapped.current = false;
    distToLastNum.current = 0;
    Haptics.selectionAsync();
    updateLastSelectedNumber();

    if (Platform.OS === 'android') {
      const snapTarget = Math.round(scrollDistNumbers) * 50;
      const scrollRef = flatListRef.current!.getNativeScrollRef() as ScrollView
      scrollRef.scrollTo({ x: 0, y: snapTarget, animated: false });
    }
  };

  const handleScrollEndDrag = () => {
    distToLastNum.current = 0;
  };

  return (
    <FlatList
      ref={flatListRef}
      showsVerticalScrollIndicator={false}
      decelerationRate={'fast'}
      snapToInterval={Platform.OS === "ios" ? 50 : undefined}
      bounces={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      onMomentumScrollEnd={handleMomentumEnd}
      onScroll={handleScroll}
      onScrollEndDrag={handleScrollEndDrag}
      scrollEventThrottle={16}
      data={numbers}
      renderItem={number}
    />
  )
};
