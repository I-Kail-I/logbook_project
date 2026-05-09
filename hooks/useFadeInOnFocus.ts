import { useIsFocused } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export function useFadeInOnFocus(duration = 400, reducedMotion = false) {
  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(reducedMotion ? 0 : 30)).current;

  useEffect(() => {
    if (reducedMotion) {
      // Skip animation when reduced motion is enabled
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      return;
    }

    if (isFocused) {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fadeAnim, isFocused, slideAnim, duration, reducedMotion]);

  return { fadeAnim, slideAnim };
}
