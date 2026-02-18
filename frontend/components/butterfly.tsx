import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const BOTTOM_Y_BASE = height - 240;
const Y_OFFSETS = [0, 72, -56, 36];
const X_OFFSETS = [-52, 48, -20, 28];

type ButterflyProps = {
  onFinish: () => void;
  direction: "left" | "right";
  startX?: number;
  startY?: number;
  duration?: number;
  clusterIndex?: number;
};

export function Butterfly({ onFinish, direction, startX, startY, duration = 7500, clusterIndex = 0 }: ButterflyProps) {
  const fromX = direction === "right" ? -80 : width + 80;
  const toX = direction === "right" ? width + 80 : -80;
  const i = clusterIndex % Y_OFFSETS.length;
  const initialY = startY ?? BOTTOM_Y_BASE + (Y_OFFSETS[i] ?? 0);
  const initialX = startX ?? fromX + (X_OFFSETS[i] ?? 0);
  const durationMs = duration + (i * 400) - 400;

  const translateX = useRef(new Animated.Value(initialX)).current;
  const translateY = useRef(new Animated.Value(initialY)).current;
  const flutter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flutter, {
          toValue: 1,
          duration: 120 + Math.random() * 80,
          useNativeDriver: true,
        }),
        Animated.timing(flutter, {
          toValue: -1,
          duration: 100 + Math.random() * 100,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(translateX, {
      toValue: toX,
      duration: durationMs,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  }, []);

  const rotate = flutter.interpolate({
    inputRange: [-1, 1],
    outputRange: direction === "right" ? ["-18deg", "18deg"] : ["18deg", "-18deg"],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.butterfly,
        {
          transform: [
            { translateX },
            { translateY },
            { rotate },
          ],
        },
      ]}
    >
      <Image
        source={require("../assets/images/butterfly.png")}
        style={[styles.image, direction === "left" && styles.imageFlipped]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  butterfly: {
    position: "absolute",
    zIndex: 9999,
    left: 0,
    top: 0,
  },
  image: {
    width: 56,
    height: 56,
    resizeMode: "contain",
  },
  imageFlipped: {
    transform: [{ scaleX: -1 }],
  },
});
