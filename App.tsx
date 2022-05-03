import React from "react";
import { Dimensions } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const WIDTH = Dimensions.get("screen").width;
const CONTAINER_WIDTH = WIDTH * 0.9;
const NUMBER_OF_ICONS = 10;
const PADDING = 10;
const ICON_SIZE = CONTAINER_WIDTH / (NUMBER_OF_ICONS + 1);

const getCurrentPosition = (value: number) => {
  "worklet";
  return Math.floor((value - PADDING * 2) / ICON_SIZE);
};

const App = () => {
  const currentPosition = useSharedValue(-1); // -1 means no icon is selected
  const resetPosition = () => {
    "worklet";
    currentPosition.value = -1;
  };
  const animatedGestureHandler = useAnimatedGestureHandler({
    onActive({ x }) {
      currentPosition.value = getCurrentPosition(x);
    },
    onEnd() {
      resetPosition();
    },
    onCancel() {
      resetPosition();
    },
    onFail() {
      resetPosition();
    },
    onStart({ x }) {
      currentPosition.value = getCurrentPosition(x);
    },
  });
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: "white",
            padding: PADDING,
            borderRadius: PADDING,
            width: CONTAINER_WIDTH,
          }}
        >
          {new Array(NUMBER_OF_ICONS).fill(0).map((_, index) => (
            <Box key={index} index={index} activeIndex={currentPosition} />
          ))}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

interface Props {
  index: number;
  activeIndex: Animated.SharedValue<number>;
}

const Box = ({ activeIndex, index }: Props) => {
  const inputRange = [-1, 0, 7]; // input range is zero when activeIndex is equal to index;
  const backgroundColor = index % 2 ? "red" : "purple";

  const animatedStyle = useAnimatedStyle(() => {
    const isGestureInactive = activeIndex.value === -1;
    const diff = isGestureInactive ? -1 : Math.abs(activeIndex.value - index);
    return {
      transform: [
        {
          scale: withSpring(
            interpolate(diff, inputRange, [1, 2, 0.3], Extrapolate.CLAMP)
          ),
        },
        {
          translateY: withSpring(
            interpolate(diff, inputRange, [0, -40, 0], Extrapolate.CLAMP)
          ),
        },
      ],
      zIndex: interpolate(diff, inputRange, [0, 10, 1], Extrapolate.CLAMP),
      marginHorizontal: withSpring(
        interpolate(diff, inputRange, [0, ICON_SIZE, 0], Extrapolate.CLAMP)
      ),
      elevation: withSpring(
        interpolate(diff, inputRange, [0, 10, 0], Extrapolate.CLAMP)
      ),
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: PADDING,
          backgroundColor: backgroundColor,
        },
        animatedStyle,
      ]}
    />
  );
};

export default App;
