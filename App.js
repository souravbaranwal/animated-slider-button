import React from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';


const clamp = (value, lowerBound, upperBound) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};


export const SliderButton = ({
  width = 300,
  sliderHeight = 48,
  knobWidth = 40,
  padding = 4,
  disabled = false,
  label = '',
}) => {
  const translateX = useSharedValue(0);
  const totalSwipeableWidth = width - knobWidth - padding * 2;

  const onDragEnd = () => {
    Alert.alert('Logged in');
  };

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.offsetX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = clamp(
        event.translationX + ctx.offsetX,
        0,
        totalSwipeableWidth,
      );
    },
    onEnd: () => {
      if (translateX.value < totalSwipeableWidth / 2) {
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
          overshootClamping: true,
        });
      } else if (translateX.value > totalSwipeableWidth / 2 - knobWidth) {
        translateX.value = withSpring(totalSwipeableWidth, {
          damping: 15,
          stiffness: 150,
          overshootClamping: true,
        });
        runOnJS(onDragEnd)();
      }
    },
  });

  const animatedStyles = {
    scrollTranslationStyle: useAnimatedStyle(() => {
      return { transform: [{ translateX: translateX.value }] };
    }),
    progressStyle: useAnimatedStyle(() => {
      return {
        width: translateX.value + knobWidth + padding,
      };
    }),
    activeIconStyle: useAnimatedStyle(() => {
      return {
        opacity: interpolate(translateX.value, [0, totalSwipeableWidth - knobWidth - padding, totalSwipeableWidth], [1, 1, 0]),
        transform: [{ translateX: interpolate(translateX.value, [0, totalSwipeableWidth - knobWidth - padding, totalSwipeableWidth], [0, 0, knobWidth]) }]
      };
    }),
    inactiveIconStyle: useAnimatedStyle(() => {
      return {
        opacity: interpolate(translateX.value, [0, totalSwipeableWidth - knobWidth - padding, totalSwipeableWidth], [0, 0, 1]),
        transform: [{ translateX: interpolate(translateX.value, [0, totalSwipeableWidth - knobWidth, totalSwipeableWidth], [-knobWidth, -knobWidth, 0]) }]
      };
    }),
  }

  return (
    <GestureHandlerRootView>
      <View style={[styles.slider, { height: sliderHeight, width }]}>
        <Animated.View style={[styles.progress, animatedStyles.progressStyle]} />
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
        >
          <Animated.View style={[styles.knob, animatedStyles.scrollTranslationStyle, { height: knobWidth, width: knobWidth, left: padding }]} >
            <Animated.View style={[{ position: "absolute", }, animatedStyles.activeIconStyle]}>
              <AntDesign name="arrowright" size={24} color="white" />
            </Animated.View>
            <Animated.View style={[{ position: "absolute" }, animatedStyles.inactiveIconStyle]}>
              <AntDesign name="check" size={24} color="white" />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        <View style={styles.labelContainer}>
          <Text style={styles.text}>{label}</Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  slider: {
    borderRadius: 14,
    backgroundColor: "#183F3F",
    justifyContent: 'center',
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#183F3F",
    borderRadius: 14,
    position: 'absolute',
    zIndex: 1,
  },
  knob: {
    borderRadius: 10,
    backgroundColor: "#E76A40",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
    overflow: "hidden"
  },
  text: {
    marginLeft: 10,
    color: "#FFFFFF",
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconImage: {
    width: 18,
    height: 18,
  },
});










export default function App() {
  return (
    <View style={style.container}>
      <SliderButton
        label="Slide to sign"
        sliderWidth={300} sliderHeight={48} knobWidth={40} padding={4} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd38b',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
