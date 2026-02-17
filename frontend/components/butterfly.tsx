import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export function Butterfly({ onFinish }: { onFinish: () => void }) {
  const translateX = useRef(new Animated.Value(-100)).current;
  const translateY = useRef(
    200
  ).current;
  const flutter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wing flutter (rotation)
    Animated.loop(
      Animated.sequence([
        Animated.timing(flutter, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(flutter, {
          toValue: -1,
          duration: 150,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fly across screen
    Animated.timing(translateX, {
      toValue: width + 100,
      duration: 10000,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  }, []);

  const rotate = flutter.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-15deg", "15deg"],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.butterfly,
        {
          transform: [{ translateX }, { translateY }, { rotate }],
        },
      ]}
    >
      <Image
        source={require("../assets/images/butterfly.png")}
        style={styles.image}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  butterfly: {
    position: "absolute",
    zIndex: 9999,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});
